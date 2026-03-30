import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import PublicLayout from '../layouts/PublicLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', name: 'home', component: () => import('../views/public/HomeView.vue') },
        { path: 'products/:id', name: 'product-detail', component: () => import('../views/public/ProductDetailView.vue') }
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('../views/admin/DashboardView.vue') },
        { path: 'categories', name: 'admin-categories', component: () => import('../views/admin/CategoriesView.vue') },
        { path: 'brands', name: 'admin-brands', component: () => import('../views/admin/BrandsView.vue') },
        { path: 'products', name: 'admin-products', component: () => import('../views/admin/ProductsView.vue') },
        { path: 'products/new', name: 'admin-products-new', component: () => import('../views/admin/ProductFormView.vue') },
        { path: 'products/:id/edit', name: 'admin-products-edit', component: () => import('../views/admin/ProductFormView.vue') },
        { path: 'suppliers', name: 'admin-suppliers', component: () => import('../views/admin/SuppliersView.vue') },
        { path: 'settings', name: 'admin-settings', component: () => import('../views/admin/SettingsView.vue') },
        { 
          path: 'users', 
          name: 'admin-users', 
          component: () => import('../views/admin/UsersView.vue'),
          beforeEnter: (to, from, next) => {
             const authStore = useAuthStore()
             if (authStore.user?.role !== 'admin') {
                next({ name: 'admin-dashboard' })
             } else {
                next()
             }
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'admin-dashboard' })
  } else {
    next()
  }
})

export default router
