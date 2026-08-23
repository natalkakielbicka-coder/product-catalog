<script setup>
import { onMounted } from 'vue'
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

    <p v-else>Products: {{ products.length }}</p>
  </main>
</template>
