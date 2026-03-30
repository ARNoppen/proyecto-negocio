import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items')) || [],
    observations: ''
  }),
  
  getters: {
    totalCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalAmount: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    isProductInCart: (state) => (productId) => state.items.some(item => item.id === productId),
    getItemQuantity: (state) => (productId) => {
      const item = state.items.find(item => item.id === productId);
      return item ? item.quantity : 0;
    }
  },
  
  actions: {
    addItem(product) {
      const existingItem = this.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        });
      }
      this.saveToStorage();
    },
    
    removeItem(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      this.saveToStorage();
    },
    
    updateQuantity(productId, delta) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
          this.removeItem(productId);
        } else {
          this.saveToStorage();
        }
      }
    },
    
    clearCart() {
      this.items = [];
      this.observations = '';
      this.saveToStorage();
    },
    
    saveToStorage() {
      localStorage.setItem('cart_items', JSON.stringify(this.items));
    }
  }
});
