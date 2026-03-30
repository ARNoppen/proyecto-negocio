<template>
  <div class="max-w-4xl">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 italic">
        <span class="bg-primary-600 text-white p-2 rounded-2xl shadow-xl shadow-primary-900/20 not-italic">⚙️</span>
        Configuraciones Generales
      </h1>
      <p class="text-gray-500 mt-2 font-medium">Personalizá la identidad de Almacen Montt y sus canales de venta.</p>
    </div>

    <div v-if="feedback" :class="feedback.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'" class="p-6 rounded-2xl border mb-8 shadow-sm font-bold flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
       <span class="mr-4 text-2xl">{{ feedback.type === 'error' ? '❌' : '✅' }}</span>
       {{ feedback.msg }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Columna Izquierda: Identidad -->
      <div class="md:col-span-2 space-y-8">
        <div class="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10">
          <h2 class="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-4 uppercase tracking-widest text-xs opacity-40">Identidad Visual</h2>
          
          <form @submit.prevent="saveSettings" class="space-y-8">
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div class="space-y-2">
                   <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nombre del Negocio</label>
                   <input 
                     v-model="form.business_name" 
                     type="text" 
                     placeholder="Ej: Almacen Montt"
                     class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl focus:outline-none transition-all font-bold text-lg shadow-inner"
                   />
                </div>
                <div class="space-y-2">
                   <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp de Ventas</label>
                   <input 
                     v-model="form.whatsapp_number" 
                     type="text" 
                     placeholder="Ej: 5491100000000"
                     class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl focus:outline-none transition-all font-bold text-lg shadow-inner"
                   />
                </div>
             </div>

             <div class="pt-8 border-t border-gray-50">
                <button 
                  type="submit" 
                  :disabled="isSaving"
                  class="w-full sm:w-auto px-12 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                   {{ isSaving ? 'Guardando Cambios...' : 'Guardar Configuración' }}
                </button>
             </div>
          </form>
        </div>

        <div class="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10">
          <h2 class="text-xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-4 uppercase tracking-widest text-xs opacity-40">Métodos de Pago Disponibles</h2>
          <p class="text-xs text-gray-400 mb-6 font-bold italic">Seleccioná los métodos que verán los clientes en el carrito.</p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div 
               @click="togglePaymentMethod('transferencia')"
               :class="hasPaymentMethod('transferencia') ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-xl shadow-primary-500/10' : 'border-gray-100 bg-gray-50 text-gray-400'"
               class="p-6 rounded-3xl border-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-between group"
             >
                <div class="flex items-center gap-4">
                   <span class="text-3xl bg-white p-2 rounded-2xl shadow-sm border border-gray-100">🏦</span>
                   <span class="font-black uppercase tracking-widest text-xs">Transferencia Bancaria</span>
                </div>
                <div v-if="hasPaymentMethod('transferencia')" class="bg-primary-500 text-white p-1 rounded-full text-xs">✓</div>
             </div>

             <div 
               @click="togglePaymentMethod('efectivo')"
               :class="hasPaymentMethod('efectivo') ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-xl shadow-primary-500/10' : 'border-gray-100 bg-gray-50 text-gray-400'"
               class="p-6 rounded-3xl border-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-between group"
             >
                <div class="flex items-center gap-4">
                   <span class="text-3xl bg-white p-2 rounded-2xl shadow-sm border border-gray-100">💵</span>
                   <span class="font-black uppercase tracking-widest text-xs">Efectivo al retirar</span>
                </div>
                <div v-if="hasPaymentMethod('efectivo')" class="bg-primary-500 text-white p-1 rounded-full text-xs">✓</div>
             </div>
          </div>
        </div>
      </div>

      <!-- Ayuda -->
      <div class="space-y-6">
         <div class="bg-indigo-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 class="text-lg font-black uppercase tracking-widest mb-4 italic">¿Cómo funciona?</h3>
            <p class="text-sm text-indigo-100 leading-relaxed font-medium">Los cambios que realices aquí se reflejarán **instantáneamente** en el catálogo público para tus clientes.</p>
            <div class="mt-8 space-y-4">
               <div class="flex items-center gap-3 text-xs font-bold text-indigo-200">
                  <span class="bg-white/20 p-1.5 rounded-lg">🚀</span> Nombre dinámico
               </div>
               <div class="flex items-center gap-3 text-xs font-bold text-indigo-200">
                  <span class="bg-white/20 p-1.5 rounded-lg">📲</span> Link de WhatsApp
               </div>
               <div class="flex items-center gap-3 text-xs font-bold text-indigo-200">
                  <span class="bg-white/20 p-1.5 rounded-lg">💳</span> Opciones de flujo
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const isSaving = ref(false);
const feedback = ref(null);
const form = ref({
   business_name: '',
   whatsapp_number: '',
   payment_methods: 'transferencia,efectivo'
});

const fetchSettings = async () => {
   try {
      const res = await api.get('/settings');
      if (res.data.data) {
         form.value = { ...form.value, ...res.data.data };
      }
   } catch (error) {
      console.error("Error al cargar configuración:", error);
   }
};

const saveSettings = async () => {
   try {
      isSaving.value = true;
      await api.put('/settings', form.value);
      showFeedback('success', 'Configuración guardada exitosamente.');
      setTimeout(() => {
         // Recargar para aplicar cambios globales (como nombre en sidebar)
         window.location.reload();
      }, 1000);
   } catch (error) {
      showFeedback('error', 'No se pudieron guardar las configuraciones.');
   } finally {
      isSaving.value = false;
   }
};

const togglePaymentMethod = (method) => {
   let methods = form.value.payment_methods ? form.value.payment_methods.split(',').filter(Boolean) : [];
   if (methods.includes(method)) {
      methods = methods.filter(m => m !== method);
   } else {
      methods.push(method);
   }
   form.value.payment_methods = methods.join(',');
};

const hasPaymentMethod = (method) => {
   if (!form.value.payment_methods) return false;
   return form.value.payment_methods.split(',').includes(method);
};

const showFeedback = (type, msg) => {
   feedback.value = { type, msg };
   setTimeout(() => feedback.value = null, 4000);
};

onMounted(fetchSettings);
</script>
