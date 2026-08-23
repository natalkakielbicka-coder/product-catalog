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
  padding: 72px 0;
}

.product {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: clamp(40px, 7vw, 100px);
  align-items: center;
}

.product__image {
  padding: clamp(30px, 6vw, 72px);
  border-radius: 20px;
  background: var(--color-image-bg);
}

.product__image img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
}

.product__category {
  margin: 0 0 14px;
  color: var(--color-muted);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product__content h1 {
  margin: 0 0 22px;
  font-size: clamp(36px, 5vw, 58px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.05em;
}

.product__description {
  max-width: 540px;
  margin: 0 0 28px;
  color: var(--color-muted);
  font-size: 17px;
  line-height: 1.7;
}

.product__price {
  margin: 0;
  color: var(--color-text);
  font-size: 28px;
  font-weight: 700;
}

.product__button {
  width: 100%;
  margin-top: 28px;
  padding: 16px 24px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.product__button:hover {
  background: var(--color-accent-hover);
}

@media (max-width: 767px) {
  .product {
    grid-template-columns: 1fr;
  }
}
</style>
