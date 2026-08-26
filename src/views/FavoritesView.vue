<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import ProductGrid from '@/components/ProductGrid.vue'
import { useProducts } from '@/composables/useProducts'
import { useFavorites } from '@/composables/useFavorites'
import { useDocumentTitle } from '@/composables/useDocumentTitle'

const { products, loading, error, fetchProducts } = useProducts()
const { favoriteIds } = useFavorites()

const pageTitle = ref('Favorites | Product Catalog')
useDocumentTitle(pageTitle)

const favoriteProducts = computed(() => {
  return products.value.filter((product) => {
    return favoriteIds.value.includes(product.id)
  })
})

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <main>
    <h1>Favorites</h1>

    <p v-if="loading">Loading favorites...</p>

    <p v-else-if="error">Something went wrong.</p>

    <div v-else-if="favoriteProducts.length === 0" class="favorites-empty">
      <span class="favorites-empty__icon">♡</span>

      <h2>No favorite products yet</h2>

      <p>Add products to your favorites and they will appear here.</p>

      <RouterLink to="/" class="favorites-empty__button"> Browse products </RouterLink>
    </div>

    <ProductGrid v-else :products="favoriteProducts" />
  </main>
</template>

<style scoped>
main {
  width: min(var(--container), calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0 80px;
}

h1 {
  margin: 0 0 32px;
  font-size: clamp(32px, 5vw, 48px);
  letter-spacing: -0.04em;
}

.favorites-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 520px;
  margin: 80px auto;
  text-align: center;
}

.favorites-empty__icon {
  color: var(--color-accent);
  font-size: 64px;
}

.favorites-empty h2 {
  margin: 16px 0 8px;
}

.favorites-empty p {
  margin: 0 0 24px;
  color: var(--color-muted);
}

.favorites-empty__button {
  padding: 12px 20px;
  border-radius: 999px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 700;
  text-decoration: none;
}
</style>
