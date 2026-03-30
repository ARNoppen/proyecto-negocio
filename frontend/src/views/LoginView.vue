<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">Kiosco<span class="text-primary-600">Admin</span></h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ingresa al panel de gestión
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative">
      <div class="bg-white py-8 px-4 shadow-xl shadow-primary-500/10 sm:rounded-2xl sm:px-10 border border-gray-100 relative">
        <form class="space-y-6" @submit.prevent="handleLogin">
          
          <!-- Alerta de Error -->
          <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <span class="text-red-500 font-bold">!</span>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"> Email </label>
            <div class="mt-1">
              <input v-model="email" id="email" type="email" required class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition" placeholder="admin@kiosco.com" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"> Clave </label>
            <div class="mt-1">
              <input v-model="password" id="password" type="password" required class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition" placeholder="******" />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" type="checkbox" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900 cursor-pointer"> Recordarme </label>
            </div>
          </div>

          <div>
            <button :disabled="isLoading" type="submit" class="w-full flex justify-center py-3 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50">
              <span v-if="!isLoading">Ingresar</span>
              <span v-else>Cargando...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
    errorMessage.value = '';
    
    if (!email.value || !password.value) return;

    isLoading.value = true;
    
    const res = await authStore.login(email.value, password.value);
    
    isLoading.value = false;
    
    if (res.success) {
      router.push('/admin');
    } else {
      errorMessage.value = res.error;
    }
};
</script>
