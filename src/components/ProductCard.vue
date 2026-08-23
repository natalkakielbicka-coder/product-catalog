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
    transform 0.25s ease,
    border-color 0.25s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: #d9a8bf;
}

.product-card__link {
  display: block;
  padding: 14px;
  color: inherit;
  text-decoration: none;
}

.product-card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  padding: 24px;
  border-radius: 10px;
  background: var(--color-image-bg);
  object-fit: contain;
}

.product-card h2 {
  margin: 18px 0 8px;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.35;
}

.product-card p {
  margin: 0 0 6px;
  color: var(--color-accent);
  font-size: 17px;
  font-weight: 700;
}
</style>
