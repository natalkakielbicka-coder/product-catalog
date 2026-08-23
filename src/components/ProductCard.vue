<script setup>
import { RouterLink } from 'vue-router'

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

      <p>{{ product.price }} $</p>
    </RouterLink>
  </article>
</template>

<style scoped>
.product-card {
  padding: 20px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #fff;
}

.product-card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  margin-bottom: 16px;
}

.product-card h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.product-card p {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.product-card__link {
  display: block;
  color: inherit;
  text-decoration: none;
}
</style>
