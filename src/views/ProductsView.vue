<script setup>
import { onMounted } from 'vue'
import ProductGrid from '@/components/ProductGrid.vue'
import { useProducts } from '@/composables/useProducts'
const { products, loading, error, fetchProducts } = useProducts()

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <main>
    <h1>Products</h1>

    <p v-if="loading">Loading products...</p>

    <p v-else-if="error">Something went wrong.</p>

    <ProductGrid v-else :products="products" />
  </main>
</template>

<style scoped>
main {
  width: min(var(--container), calc(100% - 40px));
  margin: 0 auto;
  padding: 64px 0 80px;
}

h1 {
  margin: 0 0 40px;
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.05em;
}
</style>
