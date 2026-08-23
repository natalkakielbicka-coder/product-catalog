import { createRouter, createWebHistory } from 'vue-router'
import productsView from '../views/ProductsView.vue'
import ProductView from '../views/ProductView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'products',
      component: productsView,
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductView,
    },
  ],
})

export default router
