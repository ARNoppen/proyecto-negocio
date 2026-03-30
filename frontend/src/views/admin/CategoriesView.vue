<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Categorías</h1>
      <button @click="openModal()" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition">
        + Nueva Categoría
      </button>
    </div>

    <!-- Alert de feedack -->
    <div v-if="feedback" :class="feedback.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'" class="p-4 rounded-lg border mb-4">
      {{ feedback.msg }}
    </div>

    <!-- Tabla -->
    <div class="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center text-gray-500 animate-pulse">Cargando...</div>
      <table v-else class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-gray-500 border-b border-gray-200">
          <tr>
            <th class="p-4 font-semibold text-sm">Nombre</th>
            <th class="p-4 font-semibold text-sm">Estado</th>
            <th class="p-4 font-semibold text-sm text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50 transition">
            <td class="p-4">
              <div class="font-medium text-gray-900">{{ cat.name }}</div>
              <div class="text-xs text-gray-400 mt-1">{{ cat.slug }}</div>
            </td>
            <td class="p-4">
              <span :class="cat.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'" class="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                {{ cat.active ? 'Activa' : 'Inactiva' }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2">
              <button @click="openModal(cat)" class="text-indigo-600 hover:text-indigo-900 font-medium text-sm transition">Editar</button>
              <button @click="toggleStatus(cat)" :class="cat.active ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'" class="font-medium text-sm transition">
                {{ cat.active ? 'Desactivar' : 'Activar' }}
              </button>
            </td>
          </tr>
          <tr v-if="categories.length === 0">
            <td colspan="3" class="p-8 text-center text-gray-500">No hay categorías registradas.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form (Simple superpuesto en el DOM para simplificar sin librerías externas complejas) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-900">{{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
          <button @click="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">&times;</button>
        </div>
        <form @submit.prevent="saveCategory" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea v-model="form.description" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"></textarea>
          </div>
          <div class="flex items-center mt-2">
             <input v-model="form.active" id="isActive" type="checkbox" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer" />
             <label for="isActive" class="ml-2 block text-sm text-gray-900 cursor-pointer">Inicializar activa</label>
          </div>
          
          <div class="pt-4 flex justify-end space-x-3">
             <button type="button" @click="closeModal()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">Cancelar</button>
             <button type="submit" :disabled="isSaving" class="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition">
               {{ isSaving ? 'Guardando...' : 'Guardar' }}
             </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import api from '../../services/api';

const categories = ref([]);
const isLoading = ref(true);
const feedback = ref(null);

// Modal state
const isModalOpen = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const form = reactive({ id: null, name: '', description: '', active: true });

const fetchCategories = async () => {
  try {
    isLoading.value = true;
    const res = await api.get('/categories');
    categories.value = res.data.data;
  } catch (error) {
    showFeedback('error', 'Error al cargar categorías');
  } finally {
    isLoading.value = false;
  }
};

const showFeedback = (type, msg) => {
  feedback.value = { type, msg };
  setTimeout(() => feedback.value = null, 4000);
};

const openModal = (category = null) => {
  if (category) {
    isEditing.value = true;
    form.id = category.id;
    form.name = category.name;
    form.description = category.description || '';
    form.active = !!category.active;
  } else {
    isEditing.value = false;
    form.id = null;
    form.name = '';
    form.description = '';
    form.active = true;
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveCategory = async () => {
  isSaving.value = true;
  try {
    if (isEditing.value) {
      await api.put(`/categories/${form.id}`, { name: form.name, description: form.description, active: form.active });
      showFeedback('success', 'Categoría actualizada');
    } else {
      await api.post('/categories', { name: form.name, description: form.description, active: form.active });
      showFeedback('success', 'Categoría creada');
    }
    closeModal();
    fetchCategories();
  } catch (error) {
    showFeedback('error', error.response?.data?.error || 'Error al guardar');
  } finally {
    isSaving.value = false;
  }
};

const toggleStatus = async (cat) => {
  try {
    await api.patch(`/categories/${cat.id}/toggle`);
    showFeedback('success', 'Estado modificado');
    fetchCategories();
  } catch (error) {
    showFeedback('error', 'No se pudo modificar el estado');
  }
};

onMounted(() => {
  fetchCategories();
});
</script>
