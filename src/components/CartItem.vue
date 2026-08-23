<script setup>
import { useCart } from '@/composables/useCart'

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

      <p>{{ item.price }} $</p>

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
  grid-template-columns: 140px 1fr auto;
  gap: 28px;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border);
}

.cart-item img {
  width: 140px;
  aspect-ratio: 1 / 1;
  padding: 12px;
  border-radius: 12px;
  background: var(--color-image-bg);
  object-fit: contain;
}

.cart-item h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.cart-item p {
  margin: 4px 0;
  color: var(--color-muted);
}

.cart-item__quantity {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
}

.cart-item__quantity button {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.cart-item__remove {
  margin-top: 16px;
  padding: 0;
  border: 0;
  color: var(--color-muted);
  background: transparent;
  cursor: pointer;
  text-decoration: underline;
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
