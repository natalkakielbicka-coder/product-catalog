<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/composables/useCart'
import { formatCurrency } from '@/utils/currency'

const route = useRoute()

const { product, loading, error, fetchProduct } = useProducts()
const { addToCart } = useCart()

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

        <p class="product__price">{{ formatCurrency(product.price) }}</p>

        <button class="product__button" @click="addToCart(product)">Add to cart</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  width: min(var(--container), calc(100% - 40px));
  margin: 0 auto;
  padding: 72px 0 96px;
}

.product {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: clamp(48px, 8vw, 110px);
  align-items: center;
}

.product__image {
  overflow: hidden;
  border-radius: 24px;
  background: var(--color-image-bg);
}

.product__image img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.product__category {
  display: inline-block;
  margin: 0 0 18px;
  padding: 7px 12px;
  border-radius: 999px;
  color: var(--color-accent);
  background: var(--color-accent-light);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.product__content h1 {
  margin: 0 0 24px;
  font-size: clamp(38px, 5vw, 62px);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: -0.055em;
}

.product__description {
  max-width: 520px;
  margin: 0 0 30px;
  color: var(--color-muted);
  font-size: 16px;
  line-height: 1.75;
}

.product__price {
  margin: 0;
  color: var(--color-text);
  font-size: 28px;
  font-weight: 700;
}

.product__button {
  width: 100%;
  margin-top: 30px;
  padding: 17px 24px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.product__button:hover {
  transform: translateY(-2px);
  background: var(--color-accent-hover);
}

@media (max-width: 767px) {
  .product {
    grid-template-columns: 1fr;
  }
}
</style>
