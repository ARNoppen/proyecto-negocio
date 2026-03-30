<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 class="text-3xl font-black text-gray-900 tracking-tight">Proveedores</h1>
      <button @click="openCreateModal" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.03] active:scale-95">
        + Nuevo Proveedor
      </button>
    </div>

    <div v-if="feedback" :class="feedback.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'" class="p-4 rounded-xl border mb-6 shadow-sm font-medium">
      {{ feedback.msg }}
    </div>

    <!-- Tabla Proveedores -->
    <div class="bg-white shadow-xl rounded-3xl border border-gray-100 overflow-hidden">
      <div v-if="isLoading" class="p-20 text-center">
         <div class="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
         <p class="text-gray-400 font-medium">Cargando proveedores...</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead class="bg-gray-50/50 text-gray-400 border-b border-gray-100 uppercase text-[10px] font-black tracking-widest">
            <tr>
              <th class="p-5">Nombre</th>
              <th class="p-5">Teléfono / WhatsApp</th>
              <th class="p-5 text-center">Estado</th>
              <th class="p-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="sup in suppliers" :key="sup.id" class="hover:bg-gray-50/50 transition duration-150">
              <td class="p-5">
                <div class="font-bold text-gray-900 text-lg leading-tight">{{ sup.name }}</div>
                <div class="text-xs text-gray-400 font-medium">{{ sup.email || 'Sin email registrado' }}</div>
              </td>
              <td class="p-5">
                 <div class="flex items-center gap-3">
                    <span v-if="sup.phone" class="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">{{ sup.phone }}</span>
                    <a v-if="sup.phone" :href="'https://wa.me/' + cleanPhone(sup.phone)" target="_blank" class="text-green-500 hover:text-green-600 transition" title="Enviar WhatsApp">
                       <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                    <span v-else class="text-xs text-gray-300 italic">No disponible</span>
                 </div>
              </td>
              <td class="p-5 text-center">
                 <button @click="toggleStatus(sup)" :class="sup.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'" class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition hover:scale-105 active:scale-95">
                  {{ sup.active ? 'Activo' : 'Inactivo' }}
                </button>
              </td>
              <td class="p-5 text-right">
                <button @click="openEditModal(sup)" class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition shadow-sm border-b-2 border-gray-200 hover:border-indigo-700">
                   Editar
                </button>
              </td>
            </tr>
            <tr v-if="suppliers.length === 0">
              <td colspan="4" class="p-20 text-center text-gray-400 font-bold italic">No hay proveedores registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Edición / Creación -->
    <div v-if="modal.isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
       <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <h3 class="text-xl font-black text-gray-900">{{ modal.isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor' }}</h3>
             <button @click="modal.isOpen = false" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>
          <form @submit.prevent="saveSupplier" class="p-8 space-y-4">
             <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nombre Comercial *</label>
                <input v-model="modal.form.name" type="text" required class="w-full px-5 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium" />
             </div>
             <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Teléfono / WhatsApp</label>
                <input v-model="modal.form.phone" type="text" placeholder="Ej: +54911..." class="w-full px-5 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium" />
             </div>
             <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email de contacto</label>
                <input v-model="modal.form.email" type="email" placeholder="proveedor@ejemplo.com" class="w-full px-5 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium" />
             </div>
             <div class="pt-4 flex gap-4">
                <button type="button" @click="modal.isOpen = false" class="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition">Cancelar</button>
                <button type="submit" :disabled="isSaving" class="flex-1 px-6 py-3 rounded-2xl font-black text-white bg-primary-600 hover:bg-primary-700 transition shadow-lg disabled:opacity-50">
                   {{ isSaving ? 'Guardando...' : 'Guardar' }}
                </button>
             </div>
          </form>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../../services/api';

const suppliers = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const feedback = ref(null);

const modal = reactive({
   isOpen: false,
   isEdit: false,
   form: {
      id: null,
      name: '',
      phone: '',
      email: ''
   }
});

const loadSuppliers = async () => {
   try {
      isLoading.value = true;
      const res = await api.get('/suppliers');
      suppliers.value = res.data.data;
   } catch (error) {
      showFeedback('error', 'Error al cargar proveedores');
   } finally {
      isLoading.value = false;
   }
};

const openCreateModal = () => {
   modal.isEdit = false;
   modal.form = { id: null, name: '', phone: '', email: '' };
   modal.isOpen = true;
};

const openEditModal = (sup) => {
   modal.isEdit = true;
   modal.form = { ...sup };
   modal.isOpen = true;
};

const saveSupplier = async () => {
   try {
      isSaving.value = true;
      if (modal.isEdit) {
         await api.put(`/suppliers/${modal.form.id}`, modal.form);
      } else {
         await api.post('/suppliers', modal.form);
      }
      showFeedback('success', `Proveedor ${modal.isEdit ? 'actualizado' : 'creado'} correctamente`);
      modal.isOpen = false;
      loadSuppliers();
   } catch (error) {
      showFeedback('error', 'No se pudo guardar la información');
   } finally {
      isSaving.value = false;
   }
};

const toggleStatus = async (sup) => {
   try {
      await api.patch(`/suppliers/${sup.id}/toggle`);
      showFeedback('success', 'Estado actualizado');
      loadSuppliers();
   } catch (error) {
      showFeedback('error', 'No se pudo cambiar el estado');
   }
};

const showFeedback = (type, msg) => {
   feedback.value = { type, msg };
   setTimeout(() => feedback.value = null, 4000);
};

const cleanPhone = (phone) => {
   return phone.replace(/\D/g, '');
};

onMounted(loadSuppliers);
</script>
