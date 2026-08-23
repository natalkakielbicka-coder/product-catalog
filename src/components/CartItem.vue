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
  grid-template-columns: 120px 1fr;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid #e5e5e5;
}

.cart-item img {
  width: 120px;
  aspect-ratio: 1 / 1;
  object-fit: contain;
}

.cart-item h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.cart-item p {
  margin: 4px 0;
}
.cart-item__quantity {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.cart-item__quantity button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.cart-item__remove {
  margin-top: 16px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-decoration: underline;
}
</style>
