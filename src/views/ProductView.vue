<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '@/composables/useProducts'

const route = useRoute()

const { product, loading, error, fetchProduct } = useProducts()

onMounted(() => {
  fetchProduct(route.params.id)
})
</script>

<template>
  <main>
    <p v-if="loading">Loading product...</p>

    <p v-else-if="error">Something went wrong.</p>

    <div v-else-if="product">
      <h1>{{ product.title }}</h1>

      <img :src="product.thumbnail" :alt="product.title" />

      <p>{{ product.description }}</p>

      <p>{{ product.price }} $</p>
    </div>
  </main>
</template>
