import axios from 'axios';
import router from '../router';
import { useAuthStore } from '../stores/auth';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de Request para inyectar el token JWT
api.interceptors.request.use(
  (config) => {
    // Al usar Pinia en un entorno independiente de los componentes de Vue, 
    // lo ideal es instanciar la tienda al momento de su uso, para garantizar 
    // que la instancia base de Pinia ya esté montada por main.js
    const authStore = useAuthStore();
    
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Response para manejar 401 (Expiración o Token Inválido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      
      // Si el 401 ocurre en el propio endpoint de login (credenciales erróneas), 
      // dejamos que el componente se encargue de mostrar el error.
      // Si ocurre en otros endpoints protegidos, forzamos logout (token expiró).
      if (error.config.url !== '/auth/login') {
        authStore.logout();
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
