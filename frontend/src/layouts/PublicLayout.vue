<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <!-- Navbar público -->
    <header class="bg-primary-600 shadow-2xl sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 sm:h-20 items-center">
          <router-link to="/" class="flex items-center group">
             <div>
                <h1 class="text-white font-black text-xl sm:text-2xl tracking-tighter uppercase italic leading-none">
                  {{ storeName.split(' ')[0] }}<span class="text-primary-200">{{ storeName.split(' ').slice(1).join(' ') }}</span>
                </h1>
             </div>
          </router-link>
          
          <div class="flex items-center space-x-4">
             <router-link v-if="authStore.isAuthenticated" to="/admin" class="hidden md:flex text-white/80 hover:text-white transition text-[10px] font-black uppercase tracking-widest bg-black/10 px-3 py-1.5 rounded-lg border border-white/10">Panel</router-link>
             
             <!-- Botón Carrito Mejorado -->
             <button 
               @click="isCartOpen = true"
               class="relative bg-white text-primary-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all group border-b-2 sm:border-b-4 border-primary-100"
             >
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <span v-if="cartStore.totalCount > 0" class="absolute -top-2 -right-2 bg-secondary-500 text-white text-[9px] sm:text-[10px] font-black w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-lg border border-white animate-bounce">
                   {{ cartStore.totalCount }}
                </span>
             </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido Dinámico -->
    <main class="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-16 px-4 text-center border-t border-gray-800">
      <div class="max-w-xl mx-auto space-y-8">
         <div class="flex flex-col items-center">
            <span class="font-black text-white uppercase tracking-tighter text-3xl italic mb-2">{{ storeName }}</span>
            <div class="w-12 h-1.5 bg-primary-600 rounded-full"></div>
         </div>
         <p class="text-sm font-medium text-gray-500 italic px-8 leading-relaxed">Tu almacén amigo, ahora más cerca que nunca con nuestro catálogo online. Calidad y confianza para el barrio.</p>
         <div class="pt-8 border-t border-gray-800 flex justify-center gap-6">
            <span class="text-[10px] font-bold uppercase tracking-widest">Aceptamos Transferencia</span>
            <span class="text-[10px] font-bold uppercase tracking-widest">Efectivo al Retirar</span>
         </div>
         <p class="text-[10px] uppercase font-black tracking-widest opacity-30">&copy; {{ new Date().getFullYear() }} - Todos los derechos reservados</p>
      </div>
    </footer>

    <!-- Carrito Overlay -->
    <CartOverlay :isOpen="isCartOpen" @close="isCartOpen = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import CartOverlay from '../components/public/CartOverlay.vue';
import axios from 'axios';
import { API_URL } from '../services/api';

const authStore = useAuthStore();
const cartStore = useCartStore();
const isCartOpen = ref(false);
const storeName = ref('Almacen Montt');

const fetchSettings = async () => {
    try {
        const res = await axios.get(`${API_URL}/public/settings`);
        if (res.data.data?.business_name) {
            storeName.value = res.data.data.business_name;
            document.title = storeName.value + ' | Catálogo Online';
        }
    } catch (error) {
        console.error("No se pudo cargar la configuración:", error);
    }
};

onMounted(fetchSettings);
</script>
