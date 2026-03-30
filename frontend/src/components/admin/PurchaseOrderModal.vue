<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 shadow-2xl backdrop-blur-sm animate-in fade-in duration-300">
    <div class="bg-white rounded-t-[2.5rem] sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-in slide-in-from-bottom-10 duration-500">
      
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 class="text-2xl font-black text-gray-900 tracking-tight">Resumen del Pedido</h3>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Revisa y edita las cantidades sugeridas</p>
        </div>
        <button @click="$emit('close')" class="p-2 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Contenido Scrollable -->
      <div class="flex-grow overflow-y-auto p-6 space-y-8">
        <div v-for="(group, supplierId) in groupedOrders" :key="supplierId" class="space-y-4">
          <!-- Separador de Proveedor -->
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-sm">
                {{ supplierId === 'null' ? '❓' : '🚛' }}
             </div>
             <div>
                <h4 class="text-lg font-black text-gray-900 leading-none">{{ supplierId === 'null' ? 'Sin Proveedor Asignado' : group.name }}</h4>
                <p v-if="group.phone" class="text-xs font-bold text-emerald-600 uppercase tracking-tighter mt-1">📲 WhatsApp Disponible</p>
             </div>
          </div>

          <!-- Lista de Productos en el grupo -->
          <div class="bg-gray-50/50 rounded-2xl border border-gray-100 p-2 divide-y divide-gray-100">
             <div v-for="item in group.items" :key="item.id" class="p-3 flex items-center justify-between">
                <div class="flex-grow pr-4">
                   <p class="font-bold text-gray-800 leading-tight">{{ item.name }}</p>
                   <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Actual: {{ item.stock_actual }} | Mín: {{ item.stock_minimo || 0 }}</p>
                </div>
                <!-- Input Cantidad Editable -->
                <div class="flex items-center gap-3">
                   <span class="text-gray-300 text-xs font-bold">Pedir:</span>
                   <input 
                     type="number" 
                     v-model.number="item.orderQuantity"
                     class="w-14 px-2 py-2 bg-white border-2 border-gray-200 rounded-xl text-center font-black focus:border-primary-500 focus:outline-none transition-all shadow-sm"
                     min="1"
                   />
                </div>
             </div>
          </div>

          <!-- Acciones por Proveedor -->
          <div class="flex gap-2 justify-end">
             <button @click="copyOrder(group)" class="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition shadow-sm">
                Copiar
             </button>
             <button v-if="group.phone" @click="sendToWhatsApp(group)" class="px-4 py-2 bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                WhatsApp
             </button>
          </div>
        </div>
      </div>

      <!-- Footer General -->
      <div class="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
         <button @click="copyAll" class="flex-1 py-4 bg-white border border-gray-300 text-gray-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition shadow-sm">
            Copiar Todo el Pedido
         </button>
         <button @click="$emit('close')" class="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-500/20 active:scale-95 transition-all">
            Cerrar
         </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  selectedProducts: Array
});

const emit = defineEmits(['close']);

// Clonamos productos para mantener cantidades editables localmente
const localItems = ref([]);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    localItems.value = props.selectedProducts.map(p => {
       const min = p.stock_minimo || 0;
       const actual = p.stock_actual || 0;
       // Fallback de 10 si no hay stock mínimo o si el sugerido da <= 0 por alguna razón
       let suggested = min - actual;
       if (suggested <= 0 || min === 0) suggested = 10;

       return {
          ...p,
          orderQuantity: suggested
       };
    });
  }
});

const groupedOrders = computed(() => {
  const groups = {};
  
  localItems.value.forEach(item => {
    const key = item.supplier_id || 'null';
    if (!groups[key]) {
      groups[key] = {
        name: item.supplier_name || 'Sin Proveedor',
        phone: item.supplier_phone || null,
        items: []
      };
    }
    groups[key].items.push(item);
  });
  
  return groups;
});

const formatOrderText = (group) => {
  let text = `📦 *PEDIDO PARA: ${group.name.toUpperCase()}*\n\n`;
  group.items.forEach(item => {
    text += `- ${item.name} x ${item.orderQuantity}\n`;
  });
  return text;
};

const copyOrder = (group) => {
  const text = formatOrderText(group);
  navigator.clipboard.writeText(text);
  alert('Pedido copiado al portapapeles');
};

const sendToWhatsApp = (group) => {
  if (!group.phone) return;
  const cleanPhone = group.phone.replace(/\D/g, '');
  const text = encodeURIComponent(formatOrderText(group));
  window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
};

const copyAll = () => {
  let fullText = `🛍️ *RESUMEN DE PEDIDOS GENERADOS*\n\n`;
  Object.values(groupedOrders.value).forEach(group => {
     fullText += formatOrderText(group) + '\n';
  });
  navigator.clipboard.writeText(fullText);
  alert('Resumen completo copiado');
};
</script>
