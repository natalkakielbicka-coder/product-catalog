<script setup>
import { RouterLink } from 'vue-router'
import { formatCurrency } from '@/utils/currency'
import { useCart } from '@/composables/useCart'

defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const { addToCart } = useCart()
</script>

<template>
  <article class="product-card">
    <RouterLink class="product-card__link" :to="`/product/${product.id}`">
      <img :src="product.thumbnail" :alt="product.title" />

      <h2>{{ product.title }}</h2>

      <p class="product-card__price">
        {{ formatCurrency(product.price) }}
      </p>
    </RouterLink>

    <button class="product-card__button" @click="addToCart(product)">Add to cart</button>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.product-card:hover {
  transform: translateY(-6px);
  border-color: #dfc2d1;
  box-shadow: 0 18px 45px rgba(63, 37, 51, 0.08);
}

.product-card__link {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 10px 10px 0;
  color: inherit;
  text-decoration: none;
}

.product-card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 13px;
  background: var(--color-image-bg);
  object-fit: cover;
}

.product-card h2 {
  margin: 18px 8px 7px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.02em;
}

.product-card__price {
  margin: 0 8px;
  color: var(--color-accent);
  font-size: 16px;
  font-weight: 700;
}

.product-card__price {
  margin: 0 8px;
  color: var(--color-accent);
  font-size: 16px;
  font-weight: 700;
}

.product-card__button {
  width: calc(100% - 20px);
  margin: 14px 10px 10px;
  padding: 12px 16px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.product-card__button:hover {
  transform: translateY(-2px);
  background: var(--color-accent-hover);
}
</style>
