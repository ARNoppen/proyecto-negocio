<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-end p-0 sm:p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
    <div class="bg-white rounded-t-[3.5rem] sm:rounded-[3rem] w-full sm:max-w-md h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-in slide-in-from-bottom-20 sm:slide-in-from-right-20 duration-500 shadow-3xl">
      
      <!-- Header -->
      <div class="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
        <div>
          <h3 class="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Tu Pedido</h3>
          <p class="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mt-1">{{ cartStore.totalCount }} PRODUCTOS SELECCIONADOS</p>
        </div>
        <button @click="$emit('close')" class="p-2 sm:p-3 bg-gray-100 text-gray-400 hover:text-primary-600 rounded-2xl transition-all active:scale-90">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Contenido -->
      <div class="flex-grow overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-10 no-scrollbar">
        <div v-if="cartStore.items.length === 0" class="py-24 text-center">
           <div class="text-8xl mb-6 opacity-10">🛒</div>
           <p class="text-gray-300 font-black italic tracking-widest uppercase text-xs">El carrito está vacío</p>
           <button @click="$emit('close')" class="mt-8 text-primary-600 font-bold underline uppercase text-[10px] tracking-widest">Ver productos</button>
        </div>
        
        <div v-else class="space-y-8">
           <!-- Lista Items -->
           <div class="space-y-4">
              <div v-for="item in cartStore.items" :key="item.id" class="flex items-center justify-between group">
                 <div class="flex-grow pr-4">
                    <p class="font-black text-gray-900 leading-tight italic">{{ item.name }}</p>
                    <p class="text-[10px] text-primary-400 font-bold mt-1 uppercase tracking-tighter">${{ Number(item.price).toLocaleString() }} x uni.</p>
                 </div>
                 
                 <div class="flex items-center gap-2 sm:gap-3">
                    <div class="flex items-center gap-4 bg-gray-50 p-1.5 sm:p-2 rounded-2xl border border-gray-100">
                       <button @click="cartStore.updateQuantity(item.id, -1)" class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-primary-600 transition active:scale-90 font-black text-lg">-</button>
                       <span class="text-base sm:text-lg font-black w-6 text-center text-gray-900 leading-none">{{ item.quantity }}</span>
                       <button @click="cartStore.updateQuantity(item.id, 1)" class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white shadow-sm hover:text-primary-600 transition active:scale-90 font-black text-lg">+</button>
                    </div>
                    <!-- Botón Eliminar -->
                    <button 
                      @click="cartStore.removeItem(item.id)" 
                      class="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:text-red-700 hover:bg-red-100 transition active:scale-90 border border-red-100 shadow-sm"
                      title="Eliminar producto"
                    >
                       <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                 </div>
              </div>
           </div>

           <!-- Observaciones -->
           <div class="pt-6 border-t border-gray-50">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 italic">Observaciones del Pedido</label>
              <textarea 
                v-model="cartStore.observations"
                placeholder="Ej: Retiro a la tarde, Llevo efectivo justo..."
                class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-2xl focus:outline-none transition-all font-bold text-sm shadow-inner"
                rows="2"
              ></textarea>
           </div>

           <!-- Selección de Pago -->
           <div class="pt-6 border-t border-gray-50">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 italic">Forma de Pago (Obligatorio)</label>
              <div class="grid grid-cols-1 gap-2 sm:gap-3">
                 <label 
                   :class="paymentMethod === 'Transferencia' ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-xl shadow-primary-500/10' : 'border-gray-50 bg-gray-50 text-gray-400'"
                   class="flex items-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group"
                 >
                    <input type="radio" value="Transferencia" v-model="paymentMethod" class="hidden" />
                    <span class="text-lg mr-3">🏦</span>
                    <span class="font-black uppercase tracking-widest text-[9px]">Transferencia Bancaria</span>
                    <span v-if="paymentMethod === 'Transferencia'" class="ml-auto text-primary-500 font-black">✓</span>
                 </label>

                 <label 
                   :class="paymentMethod === 'Efectivo' ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-xl shadow-primary-500/10' : 'border-gray-50 bg-gray-50 text-gray-400'"
                   class="flex items-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group"
                 >
                    <input type="radio" value="Efectivo" v-model="paymentMethod" class="hidden" />
                    <span class="text-lg mr-3">💵</span>
                    <span class="font-black uppercase tracking-widest text-[9px]">Efectivo al Retirar</span>
                    <span v-if="paymentMethod === 'Efectivo'" class="ml-auto text-primary-500 font-black">✓</span>
                 </label>
              </div>
           </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="cartStore.items.length > 0" class="p-10 bg-white border-t border-gray-100 space-y-6">
         <div class="flex justify-between items-end mb-4">
            <span class="text-gray-300 font-black uppercase text-[10px] tracking-[0.2em] italic">Total Final</span>
            <span class="text-5xl font-black text-gray-900 tracking-tighter leading-none">${{ cartStore.totalAmount.toLocaleString() }}</span>
         </div>
         
         <button 
           @click="sendOrder" 
           :disabled="!paymentMethod"
           :class="!paymentMethod ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-2xl shadow-primary-500/30 active:scale-95 transition-all hover:scale-[1.03]'"
           class="w-full py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 group"
         >
            <svg class="w-6 h-6 animate-in slide-in-from-left-4 duration-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {{ !paymentMethod ? 'Elegí Forma de Pago' : 'Enviar Pedido' }}
         </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '../../stores/cart';
import axios from 'axios';
import { API_URL } from '../../services/api';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const cartStore = useCartStore();
const paymentMethod = ref('');
const whatsappNumber = ref('5491100000000');

const fetchSettings = async () => {
   try {
      const res = await axios.get(`${API_URL}/public/settings`);
      if (res.data.data?.whatsapp_number) {
         whatsappNumber.value = res.data.data.whatsapp_number;
      }
   } catch (error) {}
};

const sendOrder = () => {
    if (cartStore.items.length === 0 || !paymentMethod.value) return;

    let message = `🛒 *NUEVO PEDIDO - ALMACEN MONTT*\n\n`;
    
    cartStore.items.forEach(item => {
        message += `• *${item.name}* x ${item.quantity} ($${(item.price * item.quantity).toLocaleString()})\n`;
    });

    message += `\n💰 *Total: $${cartStore.totalAmount.toLocaleString()}*`;
    message += `\n💳 *Forma de Pago:* ${paymentMethod.value}`;

    if (cartStore.observations.trim()) {
        message += `\n\n📝 *Notas:* ${cartStore.observations.trim()}`;
    }

    message += `\n\n_Pedido enviado desde el catálogo online_`;

    const whatsappLink = `https://wa.me/${whatsappNumber.value}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappLink, '_blank');
    
    // Resetear
    cartStore.clearCart();
    paymentMethod.value = '';
    emit('close');
};

onMounted(fetchSettings);
</script>
