<template>
  <div class="max-w-6xl mx-auto py-4 sm:py-8 lg:py-12 px-6 pb-24">
    <!-- Botón Volver -->
    <router-link to="/" class="inline-flex items-center text-gray-400 hover:text-primary-600 mb-12 transition font-black uppercase text-[10px] tracking-[0.3em] group italic">
      <svg class="w-6 h-6 mr-3 transition-transform group-hover:-translate-x-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Volver al catálogo
    </router-link>

    <div v-if="isLoading" class="bg-white rounded-[2rem] sm:rounded-[3.5rem] shadow-sm border border-gray-100 p-6 sm:p-10 flex flex-col md:flex-row gap-8 sm:gap-16 animate-pulse">
        <div class="w-full md:w-1/2 h-[300px] sm:h-[550px] bg-gray-100 rounded-[2rem]"></div>
        <div class="w-full md:w-1/2 space-y-10 py-10">
           <div class="h-12 bg-gray-100 rounded w-3/4"></div>
           <div class="h-6 bg-gray-100 rounded w-1/3"></div>
           <div class="space-y-4">
              <div class="h-4 bg-gray-100 rounded w-full"></div>
              <div class="h-4 bg-gray-100 rounded w-full"></div>
              <div class="h-4 bg-gray-100 rounded w-2/3"></div>
           </div>
           <div class="h-24 bg-gray-100 rounded-[2rem] w-full mt-auto"></div>
        </div>
    </div>

    <div v-else-if="product" class="bg-white rounded-[2rem] sm:rounded-[4rem] shadow-3xl border border-gray-50 overflow-hidden animate-in zoom-in-95 duration-700">
      <div class="flex flex-col md:flex-row min-h-[400px] sm:min-h-[600px]">
        
        <!-- Galería / Imagen -->
        <div class="w-full md:w-1/2 bg-slate-50 flex items-center justify-center p-8 lg:p-12 border-r border-gray-50 relative group/img overflow-hidden">
            <template v-if="product.images && product.images.length > 0">
               <img :src="product.images[0].url" :alt="product.name" class="max-w-full max-h-[350px] sm:max-h-[500px] object-contain drop-shadow-3xl transition duration-1000 font-bold hover:scale-[1.05]" />
            </template>
            <template v-else>
               <div class="flex flex-col items-center text-gray-200 py-32 opacity-30">
                  <svg class="w-48 h-48 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span class="text-2xl font-black italic tracking-[0.4em] uppercase">Sin imagen</span>
               </div>
            </template>

            <!-- Etiquetas Múltiples Flotantes -->
            <div class="absolute top-10 left-10 flex flex-col gap-3">
               <span v-if="product.en_promocion" class="bg-secondary-500 text-white font-black px-6 py-2.5 rounded-full uppercase tracking-widest shadow-2xl rotate-[-4deg] text-xs italic border-2 border-white/20">En Oferta</span>
               <span v-if="product.destacado" class="bg-indigo-600 text-white font-black px-6 py-2.5 rounded-full uppercase tracking-widest shadow-2xl rotate-[2deg] text-xs border-2 border-white/20">Destacado</span>
               <span v-if="product.custom_label" class="bg-white text-gray-900 font-bold px-6 py-2.5 rounded-full uppercase tracking-widest shadow-2xl text-xs border border-gray-100 italic">{{ product.custom_label }}</span>
               <span v-if="product.stock_actual <= 0" class="bg-red-700 text-white font-black px-6 py-2.5 rounded-full uppercase tracking-widest shadow-2xl text-xs border-2 border-white/20 italic">Agotado</span>
            </div>
        </div>

        <!-- Información -->
        <div class="w-full md:w-1/2 p-4 lg:p-8 flex flex-col justify-between">
          <div class="space-y-6 sm:space-y-10">
             <div class="flex items-center gap-4">
                 <span class="text-[10px] text-primary-600 font-black tracking-[0.2em] uppercase bg-primary-50 px-5 py-2 rounded-2xl border border-primary-100 shadow-sm">{{ product.category_name || 'General' }}</span>
                <span v-if="product.brand_name" class="text-[10px] text-gray-400 font-black tracking-[0.2em] uppercase border-2 border-gray-100 px-5 py-2 rounded-2xl">{{ product.brand_name }}</span>
             </div>
             
             <h1 class="text-4xl lg:text-5xl font-black text-gray-900 leading-[0.9] tracking-tighter italic">{{ product.name }}</h1>
             
             <div class="flex items-center gap-8">
                <div v-if="product.stock_actual > 0" class="flex items-center text-green-500 font-black text-[10px] uppercase tracking-[0.2em] bg-green-50 px-6 py-3 rounded-2xl border border-green-100 shadow-inner">
                   <span class="w-2.5 h-2.5 bg-green-500 rounded-full mr-4 animate-pulse shadow-green-500/50 shadow-lg border-2 border-white"></span>
                   Disponible ahora
                </div>
                <div v-else class="flex items-center text-red-700 font-black text-[10px] uppercase tracking-[0.2em] bg-red-50 px-6 py-2 rounded-2xl border border-red-100 shadow-inner">
                   <span class="w-2.5 h-2.5 bg-red-700 rounded-full mr-4 shadow-red-700/30 shadow-lg border-2 border-white"></span>
                   Agotado temporalmente
                </div>
             </div>

             <div class="space-y-2 lg:space-y-4">
                <h3 class="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] italic border-b border-gray-50 pb-2 lg:pb-4">Detalles del Ítem</h3>
                <p class="text-gray-500 text-xl lg:text-2xl leading-relaxed font-medium italic pr-10">
                   {{ product.full_description || product.short_description || 'Explora la frescura y calidad de este ítem seleccionado para vos. Calidad garantizada en Almacen Montt.' }}
                </p>
             </div>
          </div>

          <!-- Acciones de Compra -->
          <div class="bg-gray-50/50 -mx-8 lg:-mx-12 -mb-8 lg:-mb-12 p-8 lg:p-10 border-t border-gray-100 mt-10 lg:mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 lg:gap-12">
             <div class="flex flex-col text-center sm:text-left">
                <span class="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2 italic">Precio Final</span>
                <span class="text-5xl lg:text-6xl font-black text-gray-900 leading-none tracking-tighter">${{ Number(product.price).toLocaleString() }}</span>
             </div>
             
             <button 
                v-if="product.stock_actual > 0"
                @click="addToCart(product)"
                class="w-full sm:w-auto px-8 py-5 bg-primary-600 hover:bg-primary-700 text-white shadow-3xl shadow-primary-500/30 hover:scale-[1.05] active:scale-95 transition-all rounded-[2.5rem] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 group/btn"
             >
                <svg class="w-8 h-8 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                Añadir al Carrito
             </button>
              <button 
                v-else
                @click="consultProduct(product)"
                class="w-full sm:w-auto px-8 py-4 bg-green-700 hover:bg-green-800 text-white shadow-3xl shadow-green-700/30 hover:scale-[1.05] active:scale-95 transition-all rounded-[2.5rem] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 group"
             >
                <svg class="w-7 h-7 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Consultar Ítem
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-32 bg-white rounded-[4rem] shadow-xl border border-gray-100 max-w-2xl mx-auto">
       <div class="text-9xl mb-12 opacity-10 grayscale underline">🏝️</div>
       <h1 class="text-4xl font-black text-gray-900 mb-6 tracking-tighter uppercase italic">No disponible</h1>
       <p class="text-gray-400 mb-12 text-xl font-medium px-16">Este producto ya no forma parte del catálogo activo de Almacen Montt o ha sido removido temporalmente.</p>
       <router-link to="/" class="bg-primary-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-primary-700 transition shadow-2xl shadow-primary-500/40">Descubrir otros articulos</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '../../stores/cart';
import { API_URL } from '../../services/api';

const route = useRoute();
const product = ref(null);
const isLoading = ref(true);
const cartStore = useCartStore();
const whatsappNumber = ref('5491100000000');

const fetchProduct = async () => {
   try {
      isLoading.value = true;
      
      const [res, setRes] = await Promise.all([
          axios.get(`${API_URL}/public/products/${route.params.id}`),
          axios.get(`${API_URL}/public/settings`)
      ]);

      product.value = res.data.data;
      if (setRes.data.data?.whatsapp_number) {
          whatsappNumber.value = setRes.data.data.whatsapp_number;
      }
      
      if (product.value) {
         document.title = `${product.value.name} | Almacen Montt`;
      }
   } catch (error) {
      console.error("Error al cargar detalle:", error);
   } finally {
      isLoading.value = false;
   }
};

const addToCart = (p) => {
    cartStore.addItem(p);
};

const consultProduct = (p) => {
   const text = encodeURIComponent(`Hola! Quisiera consultar por el producto: *${p.name}* (${p.category_name}). Figure sin stock en el sitio online.`);
   window.open(`https://wa.me/${whatsappNumber.value}?text=${text}`, '_blank');
};

onMounted(fetchProduct);
</script>
