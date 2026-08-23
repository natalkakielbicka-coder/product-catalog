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

    <div v-else-if="product" class="product">
      <div class="product__image">
        <img :src="product.thumbnail" :alt="product.title" />
      </div>

      <div class="product__content">
        <p class="product__category">
          {{ product.category }}
        </p>

        <h1>{{ product.title }}</h1>

        <p class="product__description">
          {{ product.description }}
        </p>

        <p class="product__price">{{ product.price }} $</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  padding: 48px 0;
}

.product {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.product__image {
  padding: 32px;
  border-radius: 16px;
  background: #f7f7f7;
}

.product__image img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
}

.product__category {
  margin: 0 0 8px;
  font-size: 14px;
  text-transform: capitalize;
}

.product__content h1 {
  margin: 0 0 16px;
  font-size: 36px;
}

.product__description {
  margin: 0 0 24px;
  line-height: 1.6;
}

.product__price {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .product {
    grid-template-columns: 1fr;
  }

  .product__content h1 {
    font-size: 28px;
  }
}
</style>
