<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      <!-- Card: Categorías -->
      <router-link 
        to="/admin/categories"
        class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-500 flex flex-col justify-between h-40 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer group"
      >
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Categorías</h3>
        <div v-if="isLoading" class="mt-2 text-indigo-500 animate-pulse font-medium text-lg">Cargando...</div>
        <div v-else class="flex items-baseline gap-2">
            <p class="text-5xl font-black text-gray-900 mt-2">{{ stats.totalCategories }}</p>
            <span class="text-xs text-gray-400 font-medium">rubros activos</span>
        </div>
      </router-link>

      <!-- Card: Stock Bajo -->
      <router-link 
        to="/admin/products?filter=low-stock"
        class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500 flex flex-col justify-between h-40 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer group"
      >
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-red-600 transition-colors">Stock Bajo</h3>
        <div v-if="isLoading" class="mt-2 text-red-500 animate-pulse font-medium text-lg">Cargando...</div>
        <div v-else class="flex flex-col">
            <p :class="stats.lowStockProducts > 0 ? 'text-red-600' : 'text-gray-900'" class="text-5xl font-black mt-2">{{ stats.lowStockProducts }}</p>
            <p class="text-xs text-red-400 font-bold mt-2 uppercase tracking-tighter">{{ stats.lowStockProducts > 0 ? '¡Reponer pronto!' : 'Todo en orden' }}</p>
        </div>
      </router-link>

      <!-- Card: Destacados -->
      <router-link 
        to="/admin/products?filter=featured"
        class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-yellow-400 flex flex-col justify-between h-40 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer group"
      >
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-yellow-600 transition-colors">Destacados</h3>
        <div v-if="isLoading" class="mt-2 text-yellow-500 animate-pulse font-medium text-lg">Cargando...</div>
        <div v-else class="flex items-baseline gap-2">
            <p class="text-5xl font-black text-gray-900 mt-2">{{ stats.featuredProducts }}</p>
            <span class="text-xs text-gray-400 font-medium">en vidriera</span>
        </div>
      </router-link>

      <!-- Card: En Promoción -->
      <router-link 
        to="/admin/products?filter=promo"
        class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 flex flex-col justify-between h-40 transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer group"
      >
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Ofertas</h3>
        <div v-if="isLoading" class="mt-2 text-blue-500 animate-pulse font-medium text-lg">Cargando...</div>
        <div v-else class="flex items-baseline gap-2">
            <p class="text-5xl font-black text-gray-900 mt-2">{{ stats.promotionProducts }}</p>
            <span class="text-xs text-gray-400 font-medium">activas</span>
        </div>
      </router-link>

    </div>

    <!-- Feedback de error si ocurre -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center shadow-sm">
       <span class="mr-3 text-xl">⚠️</span>
       <span class="font-medium">{{ error }}</span>
    </div>

    <!-- Banner Accionable -->
    <div class="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 rounded-3xl p-10 text-white shadow-xl overflow-hidden relative border border-white/10">
       <div class="relative z-10 lg:w-2/3">
          <div class="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">Métricas Sincronizadas</div>
          <h2 class="text-4xl font-black mb-4 leading-tight">Control Total de tu Negocio</h2>
          <p class="text-primary-100 mb-8 text-xl leading-relaxed">
             Mantené tu inventario al día para ofrecer el mejor servicio. <br class="hidden lg:block"/>
             Revisá los productos con <b>stock bajo</b> y asegurate de que tus <b>promociones</b> lleguen a todos.
          </p>
          <div class="flex flex-wrap gap-4">
             <router-link to="/admin/products" class="bg-white text-primary-700 px-8 py-4 rounded-2xl font-black hover:bg-primary-50 transition shadow-lg flex items-center group/btn">
                Gestionar Inventario
                <svg class="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
             </router-link>
             <router-link to="/" target="_blank" class="bg-primary-500/30 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-black hover:bg-primary-500/50 transition">
                Ver Catálogo Público
             </router-link>
          </div>
       </div>
       <!-- Decoración -->
       <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
       <div class="absolute right-10 top-10 opacity-10 pointer-events-none">
          <svg class="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import api from '../../services/api';

const stats = reactive({
    totalCategories: 0,
    lowStockProducts: 0,
    featuredProducts: 0,
    promotionProducts: 0
});

const isLoading = ref(true);
const error = ref(null);

const fetchStats = async () => {
   try {
     isLoading.value = true;
     const { data } = await api.get('/dashboard/stats');
     Object.assign(stats, data.data);
   } catch (err) {
     console.error("Dashboard error:", err);
     error.value = err.response?.data?.error || 'Error de conexión con las estadísticas reales.';
   } finally {
     isLoading.value = false;
   }
};

onMounted(() => {
   fetchStats();
});
</script>
