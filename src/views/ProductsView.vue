<script setup>
import { onMounted } from 'vue'
import ProductGrid from '@/components/ProductGrid.vue'
import { useProducts } from '@/composables/useProducts'
import ProductSearch from '@/components/ProductSearch.vue'
import { useProductFilters } from '@/composables/useProductFilters'

const { products, loading, error, fetchProducts } = useProducts()
const { searchInput, filteredProducts, applySearch } = useProductFilters(products)

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <main>
    <h1>Products</h1>

    <ProductSearch v-model="searchInput" @search="applySearch" />

    <p v-if="loading">Loading products...</p>

    <p v-else-if="error">Something went wrong.</p>

    <ProductGrid v-else :products="filteredProducts" />
  </main>
</template>

<style scoped>
main {
  width: min(var(--container), calc(100% - 40px));
  margin: 0 auto;
  padding: 72px 0 96px;
}

h1 {
  margin: 0 0 48px;
  font-size: clamp(42px, 6vw, 72px);
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.06em;
}
</style>
