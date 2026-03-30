<template>
  <div class="max-w-4xl mx-auto pb-20">
    <div class="flex items-center mb-6">
      <router-link to="/admin/products" class="text-gray-500 hover:text-gray-900 mr-4 transition">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </router-link>
      <h1 class="text-3xl font-black text-gray-900 tracking-tight">{{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}</h1>
    </div>

    <!-- Alert de feedback -->
    <div v-if="feedback" :class="feedback.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'" class="p-4 rounded-xl border mb-6 shadow-sm font-bold animate-in fade-in duration-300">
      {{ feedback.msg }}
    </div>

    <form @submit.prevent="saveProduct" class="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden">
      <!-- Sección Info Básica -->
      <div class="p-10 border-b border-gray-100">
        <h2 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Información General</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-gray-700 mb-2">Nombre del Producto *</label>
            <input v-model="form.name" type="text" required class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl focus:outline-none transition-all text-lg font-medium" placeholder="Ej: Coca-Cola 1.5L" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-gray-700 mb-2">Descripción Corta / Detalles (Se muestra en la web)</label>
            <textarea v-model="form.short_description" rows="2" class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl focus:outline-none transition-all font-medium" placeholder="Ej: Gaseosa sabor cola 1.5 litros"></textarea>
          </div>

          <!-- Selección Categoría -->
          <div>
             <label class="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
             <select 
               v-model="form.category_id" 
               @change="checkQuickCreate($event, 'category')"
               class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl focus:outline-none transition-all font-medium appearance-none"
             >
                <option :value="null">-- Ninguna --</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                <option value="NEW" class="text-primary-600 font-bold">+ Crear nueva categoría</option>
             </select>
          </div>

          <!-- Selección Marca -->
          <div>
             <label class="block text-sm font-bold text-gray-700 mb-2">Marca</label>
             <select 
               v-model="form.brand_id" 
               @change="checkQuickCreate($event, 'brand')"
               class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl focus:outline-none transition-all font-medium appearance-none"
             >
                <option :value="null">-- Ninguna --</option>
                <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
                <option value="NEW" class="text-primary-600 font-bold">+ Crear nueva marca</option>
             </select>
          </div>
          
          <!-- Selección Proveedor -->
          <div class="md:col-span-2">
             <label class="block text-sm font-bold text-gray-700 mb-2">Proveedor Habitual</label>
             <select 
               v-model="form.supplier_id" 
               @change="checkQuickCreate($event, 'supplier')"
               class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl focus:outline-none transition-all font-medium appearance-none"
             >
                <option :value="null">-- Ninguno --</option>
                <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
                <option value="NEW" class="text-primary-600 font-bold">+ Crear nuevo proveedor</option>
             </select>
          </div>
        </div>
      </div>

      <!-- Sección Precios y Stock -->
      <div class="p-10 border-b border-gray-100 bg-gray-50/50">
        <h2 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Control y Finanzas</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Precio de Venta ($) *</label>
            <input v-model.number="form.price" type="number" step="0.01" min="0" required class="w-full px-5 py-4 bg-white border-2 border-transparent focus:border-primary-500 rounded-2xl focus:outline-none transition-all text-xl font-black text-primary-700" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Stock Actual</label>
            <input v-model.number="form.stock_actual" type="number" step="1" min="0" required class="w-full px-5 py-4 bg-white border-2 border-transparent focus:border-primary-500 rounded-2xl focus:outline-none transition-all font-bold text-lg" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Stock Mínimo</label>
            <input v-model.number="form.stock_minimo" type="number" step="1" min="0" required class="w-full px-5 py-4 bg-white border-2 border-transparent focus:border-primary-500 rounded-2xl focus:outline-none transition-all font-bold text-lg" />
          </div>
        </div>
      </div>

      <!-- Sección Estados y Tags -->
      <div class="p-10">
         <h2 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Visibilidad y Etiquetas</h2>
         <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="flex items-center p-5 border-2 border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition group">
               <input v-model="form.activo" type="checkbox" class="h-6 w-6 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-lg" />
               <span class="ml-4 font-bold text-gray-700 block group-hover:text-gray-900">Producto Activo</span>
            </label>
            
            <label class="flex items-center p-5 border-2 border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition group">
               <input v-model="form.visible_en_web" type="checkbox" class="h-6 w-6 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-lg" />
               <span class="ml-4 font-bold text-gray-700 block group-hover:text-gray-900">Visible en Catálogo Online</span>
            </label>

            <label class="flex items-center p-5 border-2 border-yellow-100 bg-yellow-50/50 rounded-2xl cursor-pointer hover:bg-yellow-100/50 transition group">
               <input v-model="form.destacado" type="checkbox" class="h-6 w-6 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded-lg" />
               <span class="ml-4 font-bold text-yellow-800 block">Marcar como Destacado</span>
            </label>

            <label class="flex items-center p-5 border-2 border-blue-100 bg-blue-50/50 rounded-2xl cursor-pointer hover:bg-blue-100/50 transition group">
               <input v-model="form.en_promocion" type="checkbox" class="h-6 w-6 text-blue-600 focus:ring-blue-500 border-blue-300 rounded-lg" />
               <span class="ml-4 font-bold text-blue-800 block">En Promoción / Oferta</span>
            </label>

            <div class="sm:col-span-2 space-y-2 mt-4 pt-4 border-t border-gray-100">
               <label class="block text-xs font-black text-gray-400 uppercase tracking-widest">Etiqueta Personalizada (opcional)</label>
               <input v-model="form.custom_label" type="text" maxlength="50" placeholder="Ej: Nuevo, 2x1, Edición Limitada" class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl focus:outline-none transition-all font-bold" />
               <p class="text-[10px] text-gray-400 font-medium italic">Se mostrará exactamente este texto sobre el producto en el catálogo.</p>
            </div>
         </div>
      </div>

      <!-- Footer Acciones -->
      <div class="p-10 bg-gray-50 border-t border-gray-100 flex justify-end gap-6">
         <router-link to="/admin/products" class="px-8 py-4 text-gray-500 hover:text-gray-700 font-bold transition">Cancelar</router-link>
         <button type="submit" :disabled="isSaving" class="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:shadow-primary-500/20 transition-all active:scale-95 flex items-center gap-2">
            <span v-if="isSaving" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
             {{ isSaving ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto') }}
         </button>
      </div>

    </form>

    <!-- Modal de Creación Rápida -->
    <QuickCreateModal 
      :isOpen="quickModal.isOpen"
      :label="quickModal.label"
      :endpoint="quickModal.endpoint"
      @close="quickModal.isOpen = false"
      @created="onEntityCreated"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../services/api';
import QuickCreateModal from '../../components/admin/QuickCreateModal.vue';

const route = useRoute();
const router = useRouter();

const isEditing = ref(false);
const isSaving = ref(false);
const feedback = ref(null);

// Colecciones para Selects
const categories = ref([]);
const brands = ref([]);
const suppliers = ref([]);

// Estado para el Modal de Creación Rápida
const quickModal = reactive({
   isOpen: false,
   label: '',
   endpoint: '',
   targetField: '' // 'category_id', 'brand_id' o 'supplier_id'
});

// State Formulario Centralizado
const form = reactive({
   id: null,
   name: '',
   category_id: null,
   brand_id: null,
   supplier_id: null,
   price: 0,
   stock_actual: 0,
   stock_minimo: 0,
   visible_en_web: true,
   destacado: false,
   en_promocion: false,
   custom_label: '',
   short_description: '',
   activo: true
});

const loadSelects = async () => {
   try {
      const [catRes, brandRes, supRes] = await Promise.all([
         api.get('/categories'),
         api.get('/brands'),
         api.get('/suppliers')
      ]);
      categories.value = catRes.data.data;
      brands.value = brandRes.data.data;
      suppliers.value = supRes.data.data;
   } catch (error) {
     console.error("Error al cargar selects", error);
   }
};

const checkQuickCreate = (event, type) => {
   if (event.target.value === 'NEW') {
      // Revertir selección temporalmente para que no quede "NEW" seleccionado si se cancela
      form[`${type}_id`] = null;
      
      quickModal.targetField = `${type}_id`;
      quickModal.isOpen = true;
      
      if (type === 'category') {
         quickModal.label = 'Categoría';
         quickModal.endpoint = '/categories';
      } else if (type === 'brand') {
         quickModal.label = 'Marca';
         quickModal.endpoint = '/brands';
      } else if (type === 'supplier') {
         quickModal.label = 'Proveedor';
         quickModal.endpoint = '/suppliers';
      }
   }
};

const onEntityCreated = (newEntity) => {
   // Agregar al estado local sin recargar todo el backend
   if (quickModal.targetField === 'category_id') {
      categories.value.push(newEntity);
      categories.value.sort((a,b) => a.name.localeCompare(b.name));
   } else if (quickModal.targetField === 'brand_id') {
      brands.value.push(newEntity);
      brands.value.sort((a,b) => a.name.localeCompare(b.name));
   } else if (quickModal.targetField === 'supplier_id') {
      suppliers.value.push(newEntity);
      suppliers.value.sort((a,b) => a.name.localeCompare(b.name));
   }

   // Auto-seleccionar el nuevo registro
   form[quickModal.targetField] = newEntity.id;
   
   showFeedback('success', `${quickModal.label} creada y seleccionada.`);
};

const loadProductData = async (targetId) => {
   try {
      const { data } = await api.get(`/products/${targetId}`);
      const p = data.data;
      form.id = p.id;
      form.name = p.name;
      form.category_id = p.category_id;
      form.brand_id = p.brand_id;
      form.supplier_id = p.supplier_id;
      form.price = Number(p.price);
      form.stock_actual = p.stock_actual;
      form.stock_minimo = p.stock_minimo;
      form.visible_en_web = !!p.visible_en_web;
      form.destacado = !!p.destacado;
      form.en_promocion = !!p.en_promocion;
      form.custom_label = p.custom_label || '';
      form.short_description = p.short_description || '';
      form.activo = !!p.activo;
   } catch (error) {
      showFeedback('error', 'No se pudo consultar el producto.');
   }
};

const showFeedback = (type, msg) => {
  feedback.value = { type, msg };
  if(type === 'success') setTimeout(() => feedback.value = null, 3000);
};

const saveProduct = async () => {
   isSaving.value = true;
   feedback.value = null;

   try {
      const payload = { ...form };
      if (!payload.category_id) payload.category_id = null;
      if (!payload.brand_id) payload.brand_id = null;
      if (!payload.supplier_id) payload.supplier_id = null;

      if (isEditing.value) {
         await api.put(`/products/${form.id}`, payload);
         showFeedback('success', '¡Producto actualizado!');
         setTimeout(() => router.push('/admin/products'), 1000);
      } else {
         await api.post('/products', payload);
         showFeedback('success', '¡Producto creado con éxito!');
         setTimeout(() => router.push('/admin/products'), 1000);
      }
   } catch (error) {
      showFeedback('error', error.response?.data?.error || 'Falló el guardado. Revisa los datos.');
   } finally {
      isSaving.value = false;
   }
};

onMounted(async () => {
   await loadSelects();
   if (route.params.id) {
     isEditing.value = true;
     await loadProductData(route.params.id);
   }
});
</script>
