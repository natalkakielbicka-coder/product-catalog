<script setup>
import { RouterLink } from 'vue-router'
import { formatCurrency } from '@/utils/currency'

defineProps({
  product: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="product-card">
    <RouterLink class="product-card__link" :to="`/product/${product.id}`">
      <img :src="product.thumbnail" :alt="product.title" />

      <h2>{{ product.title }}</h2>

      <p>{{ formatCurrency(product.price) }}</p>
    </RouterLink>
  </article>
</template>

<style scoped>
.product-card {
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
  display: block;
  padding: 10px 10px 20px;
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

.product-card p {
  margin: 0 8px;
  color: var(--color-accent);
  font-size: 16px;
  font-weight: 700;
}
</style>
