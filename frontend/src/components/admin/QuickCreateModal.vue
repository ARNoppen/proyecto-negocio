<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
      <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 class="text-xl font-black text-gray-900 leading-tight">Nueva {{ label }}</h3>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="p-8">
        <div class="mb-6">
          <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nombre de la {{ label }}</label>
          <input 
            type="text" 
            v-model="name" 
            ref="nameInput"
            required
            placeholder="Ej: Bebidas, Lácteos..."
            class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white focus:outline-none transition-all text-lg font-medium placeholder:text-gray-300"
            :disabled="isLoading"
          />
          <p v-if="error" class="mt-3 text-sm text-red-500 font-bold flex items-center">
             <span class="mr-1">⚠️</span> {{ error }}
          </p>
        </div>

        <div class="flex gap-4">
          <button 
            type="button" 
            @click="close" 
            class="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition shadow-sm active:scale-95"
            :disabled="isLoading"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="flex-1 px-6 py-4 rounded-2xl font-black text-white bg-primary-600 hover:bg-primary-700 transition shadow-xl hover:shadow-primary-500/20 active:scale-95 flex items-center justify-center gap-2"
            :disabled="isLoading || !name.trim()"
          >
            <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
             {{ isLoading ? 'Creando...' : 'Crear ahora' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import api from '../../services/api';

const props = defineProps({
  isOpen: Boolean,
  label: String,
  endpoint: String
});

const emit = defineEmits(['close', 'created']);

const name = ref('');
const isLoading = ref(false);
const error = ref(null);
const nameInput = ref(null);

// Foco automático al abrir
watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    name.value = '';
    error.value = null;
    await nextTick();
    nameInput.value?.focus();
  }
});

const close = () => {
  if (isLoading.value) return;
  emit('close');
};

const handleSubmit = async () => {
  if (!name.value.trim() || isLoading.value) return;

  try {
    isLoading.value = true;
    error.value = null;
    
    const res = await api.post(props.endpoint, { name: name.value.trim() });
    
    // El backend devuelve success: true, data: { ... }
    emit('created', res.data.data);
    emit('close');
  } catch (err) {
    error.value = err.response?.data?.error || 'No se pudo crear. Intenta otro nombre.';
  } finally {
    isLoading.value = false;
  }
};
</script>
