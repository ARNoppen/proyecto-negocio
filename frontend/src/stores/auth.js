import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('kiosco_user')) || null,
    token: localStorage.getItem('kiosco_token') || null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  
  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data.data;
        
        this.token = token;
        this.user = user;
        
        localStorage.setItem('kiosco_token', token);
        localStorage.setItem('kiosco_user', JSON.stringify(user));
        
        return { success: true };
      } catch (error) {
        // Obtenemos el mensaje limpio que devuelve backend, o usamos uno por omisión
        const msg = error.response?.data?.error || 'Error al iniciar sesión';
        return { success: false, error: msg };
      }
    },
    
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('kiosco_token');
      localStorage.removeItem('kiosco_user');
    }
  }
});
