<script setup>
import { useCart } from '@/composables/useCart'
import { formatCurrency } from '@/utils/currency'

const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart()

defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="cart-item">
    <img :src="item.thumbnail" :alt="item.title" />

    <div>
      <h2>{{ item.title }}</h2>

      <p>{{ formatCurrency(item.price) }}</p>

      <p>Quantity: {{ item.quantity }}</p>

      <div class="cart-item__quantity">
        <button @click="decreaseQuantity(item.id)">-</button>

        <span>{{ item.quantity }}</span>

        <button @click="increaseQuantity(item.id)">+</button>
      </div>

      <button class="cart-item__remove" @click="removeFromCart(item.id)">Remove</button>
    </div>
  </article>
</template>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 24px;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border);
}

.cart-item img {
  width: 120px;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  background: var(--color-image-bg);
  object-fit: cover;
}

.cart-item h2 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 600;
}

.cart-item p {
  margin: 4px 0;
  color: var(--color-muted);
}

.cart-item__quantity {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}

.cart-item__quantity button {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  cursor: pointer;
  transition: border-color 0.2s;
}

.cart-item__quantity button:hover {
  border-color: var(--color-accent);
}

.cart-item__remove {
  margin-top: 14px;
  padding: 0;
  border: 0;
  color: var(--color-accent);
  background: transparent;
  cursor: pointer;
  font-size: 13px;
}

@media (max-width: 640px) {
  .cart-item {
    grid-template-columns: 90px 1fr;
  }

  .cart-item img {
    width: 90px;
  }
}
</style>
