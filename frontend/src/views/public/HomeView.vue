<template>
  <div class="space-y-12">
    <!-- Header Hero -->
    <div class="text-center md:text-left pt-2 sm:pt-6 pb-2">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4 uppercase italic">
        {{ storeName.split(' ')[0] }} <span class="text-primary-600 underline decoration-indigo-200">{{ storeName.split(' ').slice(1).join(' ') }}</span>
      </h1>
      <p class="text-base md:text-xl text-gray-400 max-w-2xl font-medium tracking-tight">
        Lo que necesitás para tu casa, a un mensaje de distancia. ⚡️
      </p>
    </div>

    <!-- Sección Destacados / Promociones (Solo si existen) -->
    <section v-if="featuredProducts.length > 0 && !searchQuery && !selectedCategory" class="animate-in fade-in slide-in-from-top-10 duration-1000">
       <div class="flex items-center justify-between mb-8">
          <h2 class="text-xl font-bold uppercase tracking-[0.2em] text-gray-900 italic border-l-8 border-primary-500 pl-4">Imperdibles 🔥</h2>
          <span class="text-[10px] font-black text-primary-400 uppercase tracking-widest">Lo más pedido del barrio</span>
       </div>
       <div class="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 no-scrollbar">
          <div 
             v-for="p in featuredProducts" 
             :key="'feat-' + p.id" 
             class="min-w-[280px] md:min-w-[320px] bg-indigo-900 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between"
          >
             <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-all"></div>
             <div>
                <span class="text-[9px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full border border-white/10 mb-4 inline-block">Destacado</span>
                <h3 class="text-xl font-black leading-tight mb-2 pr-10 line-clamp-2 italic">{{ p.name }}</h3>
                <p class="text-4xl font-black tracking-tighter mb-6">${{ Number(p.price).toLocaleString() }}</p>
             </div>
             <div class="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
                <router-link :to="{ name: 'product-detail', params: { id: p.id } }" class="text-xs font-black uppercase tracking-widest text-primary-200 hover:text-white transition underline">Detalles</router-link>
                <button 
                   v-if="p.stock_actual > 0"
                   @click="addToCart(p)"
                   class="bg-white text-indigo-900 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm hover:bg-gray-100 transition active:scale-95"
                >
                   Añadir
                </button>
                <button 
                   v-else
                   @click="consultProduct(p)"
                   class="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition active:scale-95"
                >
                   Consultar
                </button>
             </div>
          </div>
       </div>
    </section>

    <!-- Barra de Filtros (Chips de Categoría) -->
    <div class="sticky top-24 z-40 bg-slate-50/90 backdrop-blur-md pt-2 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
       <div class="bg-white p-4 sm:p-6 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
          <!-- Chips Categorías -->
          <div class="flex overflow-x-auto gap-3 no-scrollbar pb-1">
             <button 
               @click="selectedCategory = ''"
               :class="selectedCategory === '' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 font-black' : 'bg-gray-50 text-gray-400 font-bold border border-gray-100'"
               class="px-6 py-3 rounded-2xl text-[11px] uppercase tracking-widest whitespace-nowrap transition-all active:scale-95 flex items-center gap-2"
             >
                <span v-if="selectedCategory === ''">🏠</span> Todas
             </button>
             <button 
               v-for="cat in categories" 
               :key="cat.id"
               @click="selectedCategory = cat.name"
               :class="selectedCategory === cat.name ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 font-black' : 'bg-gray-50 text-gray-400 font-bold border border-gray-100'"
               class="px-6 py-3 rounded-2xl text-[11px] uppercase tracking-widest whitespace-nowrap transition-all active:scale-95"
             >
                {{ cat.name }}
             </button>
          </div>

          <!-- Búsqueda -->
          <div class="relative group">
             <span class="absolute inset-y-0 left-0 pl-6 flex items-center text-gray-300">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </span>
             <input 
               v-model="searchQuery"
               type="text" 
               placeholder="¿Buscás algo en especial?" 
               class="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-primary-500 focus:bg-white rounded-[2rem] focus:outline-none transition-all font-bold text-xl placeholder:text-gray-200" 
             />
          </div>
       </div>
    </div>

    <!-- Grid de Productos -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
       <div v-for="n in 8" :key="n" class="h-[480px] bg-gray-200/50 rounded-[3rem] animate-pulse"></div>
    </div>

    <div v-else-if="sortedProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
      <div 
        v-for="product in sortedProducts" 
        :key="product.id" 
        class="flex flex-col group animate-in zoom-in-95 duration-500"
        :class="product.stock_actual <= 0 ? 'opacity-60' : ''"
      >
        <!-- Imagen Container -->
        <div class="h-64 sm:h-72 bg-white rounded-[3rem] shadow-xl relative overflow-hidden mb-6 flex items-center justify-center p-8 border border-gray-100 transition-all duration-700 group-hover:shadow-2xl group-hover:scale-[1.02]">
            <router-link :to="{ name: 'product-detail', params: { id: product.id } }" class="w-full h-full flex items-center justify-center">
                <template v-if="product.images && product.images.length > 0">
                   <img :src="product.images[0].url" :alt="product.name" class="max-w-full max-h-full object-contain transition duration-700 group-hover:scale-110" />
                </template>
                <div v-else class="text-gray-200 opacity-50 flex flex-col items-center">
                   <svg class="w-20 h-20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
            </router-link>

            <!-- Etiquetas Dinámicas (Múltiples) -->
            <div class="absolute top-4 left-4 flex flex-wrap gap-2 pr-4">
               <span v-if="product.stock_actual <= 0" class="bg-red-700 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Agotado</span>
               <span v-if="product.destacado" class="bg-indigo-600 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Destacado</span>
               <span v-if="product.en_promocion" class="bg-secondary-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg italic">Oferta</span>
               <span v-if="product.custom_label" class="bg-white text-gray-900 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl border border-gray-100 italic">{{ product.custom_label }}</span>
            </div>
        </div>

        <!-- Información -->
        <div class="px-4 space-y-4">
           <div>
              <span class="text-[10px] text-primary-400 font-bold uppercase tracking-[0.2em]">{{ product.category_name || 'General' }}</span>
              <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
                 <h3 class="text-2xl font-black text-gray-900 leading-tight group-hover:text-primary-600 transition tracking-tighter italic">{{ product.name }}</h3>
              </router-link>
           </div>
           
           <div class="flex items-end justify-between gap-4">
              <div class="flex flex-col">
                 <span class="text-gray-300 text-[9px] font-black uppercase tracking-widest mb-1 italic">Precio</span>
                 <span class="text-3xl font-black text-gray-900 tracking-tighter leading-none">${{ Number(product.price).toLocaleString() }}</span>
              </div>
              
              <!-- Acción Dinámica: Añadir o Consultar -->
              <button 
                v-if="product.stock_actual > 0"
                @click="addToCart(product)"
                class="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-3xl shadow-xl shadow-primary-500/30 transition-all active:scale-95 flex items-center justify-center group/btn"
              >
                <svg class="w-6 h-6 group-hover/btn:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </button>
              <button 
                v-else
                @click="consultProduct(product)"
                class="bg-green-700 hover:bg-green-800 text-white px-5 py-4 rounded-3xl font-black uppercase tracking-widest text-[9px] transition-all active:scale-95 flex items-center gap-2"
              >
                 <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                 Consultar
              </button>
           </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-32 bg-white rounded-[3rem] shadow-xl border border-gray-50 max-w-2xl mx-auto">
       <div class="text-8xl mb-8 opacity-20">🔍</div>
       <h3 class="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Sin resultados</h3>
       <p class="text-gray-400 mt-2 font-medium">Probá cambiando el filtro o la búsqueda.</p>
       <button @click="resetFilters" class="mt-10 text-primary-600 font-black underline uppercase text-xs tracking-widest">Ver todo el catálogo</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useCartStore } from '../../stores/cart';

import { API_URL } from '../../services/api';

const products = ref([]);
const categories = ref([]);
const isLoading = ref(true);
const cartStore = useCartStore();
const storeName = ref('Almacen Montt');
const whatsappNumber = ref('5491100000000');

// Filtros
const searchQuery = ref('');
const selectedCategory = ref('');

const fetchData = async () => {
   try {
      isLoading.value = true;
      const [prodRes, catRes, setRes] = await Promise.all([
         axios.get(`${API_URL}/public/products`),
         axios.get(`${API_URL}/public/categories`),
         axios.get(`${API_URL}/public/settings`)
      ]);
      
      products.value = prodRes.data.data;
      categories.value = catRes.data.data;
      
      const sets = setRes.data.data;
      if (sets) {
         storeName.value = sets.business_name || 'Almacen Montt';
         whatsappNumber.value = sets.whatsapp_number || '5491100000000';
      }
   } catch (error) {
      console.error("Error al cargar el catálogo:", error);
   } finally {
      isLoading.value = false;
   }
};

const filteredProducts = computed(() => {
   return products.value.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchCategory = selectedCategory.value === '' || p.category_name === selectedCategory.value;
      return matchSearch && matchCategory;
   });
});

const featuredProducts = computed(() => {
   return products.value.filter(p => !!p.destacado && p.stock_actual > 0);
});

const sortedProducts = computed(() => {
   // Primero disponibles, luego agotados
   return [...filteredProducts.value].sort((a, b) => {
      if (a.stock_actual > 0 && b.stock_actual <= 0) return -1;
      if (a.stock_actual <= 0 && b.stock_actual > 0) return 1;
      return 0;
   });
});

const resetFilters = () => {
   searchQuery.value = '';
   selectedCategory.value = '';
};

const addToCart = (product) => {
    cartStore.addItem(product);
};

const consultProduct = (product) => {
   const text = encodeURIComponent(`Hola! Quisiera consultar por el producto: *${product.name}* que figura sin stock en el catálogo online.`);
   window.open(`https://wa.me/${whatsappNumber.value}?text=${text}`, '_blank');
};

onMounted(() => {
   fetchData();
});
</script>
