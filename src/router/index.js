import { createRouter, createWebHistory } from 'vue-router'
import productsView from '../views/ProductsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'products',
      component: productsView,
    },
  ],
})

export default router
