<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Usuarios</h1>
      <button @click="openModal()" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition">
        + Nuevo Usuario
      </button>
    </div>

    <!-- Alert de feedack -->
    <div v-if="feedback" :class="feedback.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'" class="p-4 rounded-lg border mb-4 shadow-sm transition-all">
      <div class="flex items-center">
         <span class="mr-2">{{ feedback.type === 'error' ? '⚠️' : '✅' }}</span>
         <span>{{ feedback.msg }}</span>
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center text-gray-500 animate-pulse">Cargando usuarios...</div>
      <table v-else class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-gray-500 border-b border-gray-200">
          <tr>
            <th class="p-4 font-semibold text-sm">Nombre</th>
            <th class="p-4 font-semibold text-sm">Email</th>
            <th class="p-4 font-semibold text-sm">Rol / Grupo</th>
            <th class="p-4 font-semibold text-sm">Estado</th>
            <th class="p-4 font-semibold text-sm text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition">
            <td class="p-4">
              <div class="font-medium text-gray-900">{{ user.name }}</div>
              <div class="text-xs text-gray-400 mt-1">ID: #{{ user.id }}</div>
            </td>
            <td class="p-4 text-sm text-gray-600">{{ user.email }}</td>
            <td class="p-4">
               <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold tracking-wider capitalize">
                  {{ user.role || 'Sin Rol' }}
               </span>
            </td>
            <td class="p-4">
              <span :class="user.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'" class="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                {{ user.active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button @click="openModal(user)" class="text-indigo-600 hover:text-indigo-900 font-medium text-sm transition">Editar</button>
              <button 
                @click="toggleStatus(user)" 
                :disabled="user.email === currentSessionEmail"
                :class="user.active ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'" 
                class="font-medium text-sm transition disabled:opacity-30 disabled:cursor-not-allowed"
                :title="user.email === currentSessionEmail ? 'No puedes desactivar tu propio usuario' : ''"
              >
                {{ user.active ? 'Desactivar' : 'Activar' }}
              </button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="5" class="p-8 text-center text-gray-500">No hay usuarios registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-xl font-bold text-gray-900">{{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
          <button @click="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">&times;</button>
        </div>
        <form @submit.prevent="saveUser" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email (Acceso) *</label>
            <input v-model="form.email" type="email" required autocomplete="username" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Grupo de Acceso *</label>
            <select v-model.number="form.access_group_id" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white focus:outline-none transition">
               <!-- IDs estáticos temporalmente alineados al Seed. Lo ideal sería traerlos vía endpoint -->
               <option :value="1">Admin (Acceso total)</option>
               <option :value="2">Administración (Limitado)</option>
            </select>
          </div>
          <div class="p-4 bg-yellow-50 border border-yellow-100 rounded-lg mt-2">
            <label class="block text-sm font-medium text-yellow-800 mb-1">Corriente / Nueva Contraseña {{ isEditing ? '(Opcional)' : '*' }}</label>
            <input v-model="form.password" type="password" autocomplete="new-password" :required="!isEditing" placeholder="••••••••" class="w-full px-4 py-2 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none transition" />
            <p v-if="isEditing" class="text-xs text-yellow-600 mt-1">Dejar en blanco para mantener la contraseña actual.</p>
          </div>
          <div class="flex items-center mt-4">
             <input v-model="form.active" id="isActive" type="checkbox" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer" />
             <label for="isActive" class="ml-2 block text-sm text-gray-900 cursor-pointer">Activar inmediatamente</label>
          </div>
          
          <div class="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-4">
             <button type="button" @click="closeModal()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">Cancelar</button>
             <button type="submit" :disabled="isSaving" class="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition">
               {{ isSaving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Registrar') }}
             </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import api from '../../services/api';

const authStore = useAuthStore();
const currentSessionEmail = computed(() => authStore.user?.email);

const users = ref([]);
const isLoading = ref(true);
const feedback = ref(null);

// Modal state
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const form = reactive({ 
   id: null, 
   name: '', 
   email: '', 
   password: '', 
   access_group_id: 2, 
   active: true 
});

const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const res = await api.get('/users');
    users.value = res.data.data;
  } catch (error) {
    showFeedback('error', 'Error al cargar usuarios. Verifica que tienes permisos de administrador.');
  } finally {
    isLoading.value = false;
  }
};

const showFeedback = (type, msg) => {
  feedback.value = { type, msg };
  setTimeout(() => feedback.value = null, 5000);
};

const openModal = (user = null) => {
  if (user) {
     isEditing.value = true;
     form.id = user.id;
     form.name = user.name;
     form.email = user.email;
     form.access_group_id = user.access_group_id || 2;
     form.active = !!user.active;
     form.password = '';
  } else {
     isEditing.value = false;
     form.id = null;
     form.name = '';
     form.email = '';
     form.access_group_id = 2;
     form.active = true;
     form.password = '';
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveUser = async () => {
  isSaving.value = true;
  feedback.value = null;
  try {
    
    // Preparar payload para evitar mandar strings vacíos a la db
    const payload = { 
       name: form.name, 
       email: form.email, 
       access_group_id: form.access_group_id, 
       active: form.active 
    };
    
    if (form.password && form.password.trim() !== '') {
       payload.password = form.password;
    }

    if (isEditing.value) {
      await api.put(`/users/${form.id}`, payload);
      showFeedback('success', 'Usuario actualizado satisfactoriamente');
    } else {
      await api.post('/users', payload);
      showFeedback('success', 'Usuario creado satisfactoriamente');
    }
    closeModal();
    fetchUsers();
  } catch (error) {
    showFeedback('error', error.response?.data?.error || 'No se pudo guardar la información del usuario');
  } finally {
    isSaving.value = false;
  }
};

const toggleStatus = async (targetUser) => {
  if(targetUser.email === currentSessionEmail.value) return; // Prevent self lock

  try {
    const res = await api.patch(`/users/${targetUser.id}/toggle`);
    showFeedback('success', 'Estado de acceso modificado');
    
    // Mutar el ref directamente para UX instantánea
    const userInList = users.value.find(u => u.id === targetUser.id);
    if(userInList) userInList.active = res.data.data.active;

  } catch (error) {
    showFeedback('error', 'No se pudo modificar el estado');
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
