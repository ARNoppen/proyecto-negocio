<template>
  <div class="pb-24">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 class="text-3xl font-black text-gray-900 tracking-tight">Gestión de Productos</h1>
      <router-link to="/admin/products/new" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-[1.03] active:scale-95">
        + Nuevo Producto
      </router-link>
    </div>

    <!-- Barra de Acción de Pedido (Sticky/Float) -->
    <div v-if="selectedIds.size > 0" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-lg bg-indigo-900 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-10 duration-500 border border-indigo-700/50 backdrop-blur-md">
       <div class="flex items-center gap-3 pl-2">
          <div class="w-10 h-10 bg-indigo-500/30 rounded-full flex items-center justify-center text-xl">🛒</div>
          <div>
             <p class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 leading-none mb-1">Seleccionados</p>
             <p class="text-xl font-black leading-none">{{ selectedIds.size }} productos</p>
          </div>
       </div>
       <button @click="isOrderModalOpen = true" class="bg-white text-indigo-900 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all active:scale-95 shadow-xl">
          Generar Pedido
       </button>
    </div>

    <!-- Indicador de Filtro Activo -->
    <div v-if="activeFilter" class="mb-6 flex items-center bg-indigo-50 border border-indigo-100 p-4 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
       <span class="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-xl mr-4 text-xl">ℹ️</span>
       <div class="flex-grow">
          <p class="text-sm text-indigo-900 font-bold uppercase tracking-widest leading-none mb-1">Filtro Activo</p>
          <p class="text-lg text-indigo-700 font-medium capitalize">{{ activeFilterLabel }}</p>
       </div>
       <button @click="clearFilter" class="px-5 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
          Ver todos
       </button>
    </div>

    <div v-if="feedback" :class="feedback.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'" class="p-4 rounded-xl border mb-6 shadow-sm font-medium">
      {{ feedback.msg }}
    </div>

    <!-- Tabla -->
    <div class="bg-white shadow-xl rounded-3xl border border-gray-100 overflow-hidden">
      <div v-if="isLoading" class="p-20 text-center">
         <div class="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
         <p class="text-gray-400 font-medium">Sincronizando inventario...</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead class="bg-gray-50/50 text-gray-400 border-b border-gray-100 uppercase text-[10px] font-black tracking-widest">
            <tr>
              <th class="p-5 w-10">
                 <input 
                   type="checkbox" 
                   :checked="isAllSelected" 
                   @change="toggleAll"
                   class="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                 />
              </th>
              <th class="p-5">Producto</th>
              <th class="p-5">Proveedor / Marca</th>
              <th class="p-5 text-center">Stock Actual</th>
              <th class="p-5 text-center">Mínimo</th>
              <th class="p-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50/50 transition duration-150 group" :class="{'bg-indigo-50/30': selectedIds.has(product.id)}">
              <td class="p-5">
                 <input 
                   type="checkbox" 
                   :checked="selectedIds.has(product.id)" 
                   @change="toggleSelection(product.id)"
                   class="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                 />
              </td>
              <td class="p-5" @click="toggleSelection(product.id)">
                <div class="font-bold text-gray-900 text-lg leading-tight cursor-pointer">{{ product.name }}</div>
                <div class="flex gap-2 mt-2">
                   <span v-if="product.destacado" class="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-lg text-[10px] font-black uppercase tracking-tighter">Destacado</span>
                   <span v-if="product.en_promocion" class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-tighter">Promo</span>
                </div>
              </td>
              <td class="p-5">
                 <div class="text-sm font-bold text-gray-700">{{ product.supplier_name || '-- Sin Proveedor --' }}</div>
                 <div class="text-xs text-gray-400 font-medium italic mt-0.5">{{ product.brand_name || 'Sin marca' }}</div>
              </td>
              <!-- Celda Stock Editable -->
              <td class="p-5 text-center">
                 <div class="inline-flex items-center">
                    <input 
                      type="number" 
                      v-model.number="product.stock_actual"
                      @blur="updateStock(product)"
                      @keyup.enter="$event.target.blur()"
                      :disabled="updatingRows[product.id]?.loading"
                      class="w-20 px-3 py-1.5 rounded-xl text-sm font-black border-b-2 text-center transition-all focus:ring-2 focus:ring-primary-500 focus:outline-none"
                      :class="[
                        product.stock_actual <= 0 ? 'bg-red-500 text-white border-red-600' : 
                        (product.stock_actual < (product.stock_minimo || 10) ? 'bg-orange-500 text-white border-orange-600' : 'bg-green-500 text-white border-green-600'),
                      ]"
                    />
                    <div class="ml-2 w-5 flex items-center justify-center">
                       <span v-if="updatingRows[product.id]?.loading" class="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
                       <span v-if="updatingRows[product.id]?.success" class="text-green-500 font-bold text-lg">✓</span>
                    </div>
                 </div>
              </td>
              <td class="p-5 text-center text-sm text-gray-400 font-bold border-r border-gray-50 italic">
                 {{ product.stock_minimo || '-' }}
              </td>
              <td class="p-5 text-right space-x-2">
                <router-link :to="`/admin/products/${product.id}/edit`" class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition shadow-sm border-b-2 border-gray-200 hover:border-indigo-700">
                   Editar
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Pedido -->
    <PurchaseOrderModal 
      :isOpen="isOrderModalOpen"
      :selectedProducts="selectedProductsForOrder"
      @close="isOrderModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../services/api';
import PurchaseOrderModal from '../../components/admin/PurchaseOrderModal.vue';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const isLoading = ref(true);
const feedback = ref(null);
const selectedIds = ref(new Set());
const isOrderModalOpen = ref(false);

const updatingRows = reactive({});

const activeFilter = computed(() => route.query.filter || null);
const activeFilterLabel = computed(() => {
   switch(activeFilter.value) {
      case 'low-stock': return 'Stock Bajo (necesita reposición)';
      case 'featured': return 'Destacados en Vidriera';
      case 'promo': return 'Ofertas y Promociones';
      default: return 'Filtro personalizado';
   }
});

const filteredProducts = computed(() => {
   if (!activeFilter.value) return products.value;
   return products.value.filter(p => {
      if (activeFilter.value === 'low-stock') {
         const threshold = p.stock_minimo || 10;
         return p.stock_actual >= 0 && p.stock_actual <= threshold;
      }
      if (activeFilter.value === 'featured') return !!p.destacado;
      if (activeFilter.value === 'promo') return !!p.en_promocion;
      return true;
   });
});

const isAllSelected = computed(() => {
   return filteredProducts.value.length > 0 && filteredProducts.value.every(p => selectedIds.value.has(p.id));
});

const selectedProductsForOrder = computed(() => {
   return Array.from(selectedIds.value).map(id => products.value.find(p => p.id === id)).filter(Boolean);
});

const toggleSelection = (id) => {
   if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id);
   } else {
      selectedIds.value.add(id);
   }
};

const toggleAll = () => {
   if (isAllSelected.value) {
      filteredProducts.value.forEach(p => selectedIds.value.delete(p.id));
   } else {
      filteredProducts.value.forEach(p => selectedIds.value.add(p.id));
   }
};

const clearFilter = () => {
   router.push('/admin/products');
   selectedIds.value.clear();
};

const fetchProducts = async () => {
  try {
    isLoading.value = true;
    const res = await api.get('/products');
    products.value = res.data.data;
  } catch (error) {
    showFeedback('error', 'Error al cargar inventario.');
  } finally {
    isLoading.value = false;
  }
};

const updateStock = async (product) => {
   const val = product.stock_actual;
   if (!Number.isInteger(val) || val < 0) return;
   if (updatingRows[product.id]?.loading) return;

   updatingRows[product.id] = { loading: true, success: false };

   try {
      await api.put(`/products/${product.id}`, { stock_actual: val });
      updatingRows[product.id].loading = false;
      updatingRows[product.id].success = true;
      setTimeout(() => { if (updatingRows[product.id]) updatingRows[product.id].success = false; }, 3000);
   } catch (error) {
      updatingRows[product.id].loading = false;
      showFeedback('error', 'Error al actualizar stock');
   }
};

const showFeedback = (type, msg) => {
  feedback.value = { type, msg };
  setTimeout(() => feedback.value = null, 4000);
};

onMounted(() => {
  fetchProducts();
});
</script>
