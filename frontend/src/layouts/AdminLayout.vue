<template>
  <div class="flex h-screen bg-gray-100 font-sans antialiased text-gray-900">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex-col hidden md:flex shadow-2xl">
      <div class="p-6 bg-gray-900 border-b border-gray-800 flex items-center justify-center">
        <h1 class="text-xl font-black tracking-tighter uppercase italic">Almacen <span class="text-primary-400 font-black">Montt</span></h1>
      </div>
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        <router-link to="/admin" exact-active-class="bg-primary-600 text-white font-bold shadow-lg shadow-primary-900/20" class="flex items-center px-4 py-3 rounded-xl hover:bg-gray-800 transition-all group">
           Dashboard
        </router-link>
        <router-link to="/admin/products" active-class="bg-primary-600 text-white font-bold shadow-lg shadow-primary-900/20" class="flex items-center px-4 py-3 rounded-xl hover:bg-gray-800 transition-all group">
           Productos
        </router-link>
        <router-link to="/admin/categories" active-class="bg-primary-600 text-white font-bold shadow-lg shadow-primary-900/20" class="flex items-center px-4 py-3 rounded-xl hover:bg-gray-800 transition-all group">
           Categorías
        </router-link>
        <router-link to="/admin/brands" active-class="bg-primary-600 text-white font-bold shadow-lg shadow-primary-900/20" class="flex items-center px-4 py-3 rounded-xl hover:bg-gray-800 transition-all group">
           Marcas
        </router-link>
        <router-link to="/admin/suppliers" active-class="bg-primary-600 text-white font-bold shadow-lg shadow-primary-900/20" class="flex items-center px-4 py-3 rounded-xl hover:bg-gray-800 transition-all group">
           Proveedores
        </router-link>
        <router-link v-if="authStore.user?.role === 'admin'" to="/admin/users" active-class="bg-primary-600 text-white font-bold shadow-lg shadow-primary-900/20" class="flex items-center px-4 py-3 rounded-xl hover:bg-gray-800 transition-all group">
           Usuarios
        </router-link>
        
        <div class="pt-4 mt-4 border-t border-gray-800"></div>

        <router-link to="/admin/settings" active-class="bg-primary-600 text-white font-bold shadow-lg shadow-primary-900/20" class="flex items-center px-4 py-3 rounded-xl hover:bg-gray-800 transition-all group">
           Configuración
        </router-link>
        
        <router-link to="/" class="flex items-center px-4 py-3 text-xs rounded-xl hover:bg-gray-800 transition-all text-gray-500 mt-8 border border-gray-800 border-dashed">
           <span class="mr-3 opacity-50">⬅️</span> Ver Catálogo Público
        </router-link>
      </nav>
      <div class="p-4 border-t border-gray-800 bg-gray-900/50">
        <button @click="logout" class="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm">
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Navbar superior -->
      <header class="bg-white shadow-sm border-b border-gray-200 z-10">
        <div class="px-8 py-4 flex justify-between items-center">
          <div class="flex items-center md:hidden">
             <h1 class="text-lg font-black tracking-tighter uppercase italic">A.<span class="text-primary-600 font-black">M</span></h1>
          </div>
          <div>
             <span class="text-xs font-black text-gray-400 uppercase tracking-widest leading-none block">Sesión activa:</span>
             <h2 class="text-sm font-bold text-gray-800">{{ authStore.user?.name }} <span class="bg-gray-100 text-[10px] px-2 py-0.5 rounded-full ml-2 text-gray-500 uppercase">{{ authStore.user?.role }}</span></h2>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const logout = async () => {
  authStore.logout();
  router.push('/login');
};
</script>
