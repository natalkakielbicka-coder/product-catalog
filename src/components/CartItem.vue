<script setup>
import { useCart } from '@/composables/useCart'
import { formatCurrency } from '@/utils/currency'
import { RouterLink } from 'vue-router'

const { increaseQuantity, decreaseQuantity, removeFromCart, getMaximumQuantity } = useCart()

defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="cart-item">
    <RouterLink
      class="cart-item__image-link"
      :to="{
        path: `/product/${item.parentId ?? item.id}`,
        query: item.parentId
          ? {
              variation: item.id,
            }
          : {},
      }"
    >
      <img :src="item.thumbnail" :alt="item.title" />
    </RouterLink>

    <div>
      <RouterLink
        class="cart-item__title"
        :to="{
          path: `/product/${item.parentId ?? item.id}`,
          query: item.parentId
            ? {
                variation: item.id,
              }
            : {},
        }"
      >
        <h2>{{ item.title }}</h2>
      </RouterLink>

      <p v-if="item.variationLabel" class="cart-item__variation">
        {{ item.variationLabel }}
      </p>

      <p>{{ formatCurrency(item.price) }}</p>

      <div class="cart-item__quantity">
        <button @click="decreaseQuantity(item.id)">-</button>

        <span>{{ item.quantity }}</span>

        <button
          :disabled="item.quantity >= getMaximumQuantity(item)"
          @click="increaseQuantity(item.id)"
        >
          +
        </button>
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
  align-items: start;
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border);
}

.cart-item img {
  display: block;
  width: 120px;
  height: 120px;
  border-radius: 14px;
  background: transparent;
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

.cart-item__quantity button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
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

.cart-item__image-link {
  display: block;
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 14px;
}

.cart-item__title {
  color: inherit;
  text-decoration: none;
}

.cart-item__title:hover {
  color: var(--color-accent);
}

.cart-item__title h2 {
  transition: color 0.2s ease;
}

.cart-item__variation {
  margin: 2px 0 6px;
  color: var(--color-muted);
  font-size: 13px;
}

@media (max-width: 640px) {
  .cart-item {
    grid-template-columns: 90px 1fr;
  }

  .cart-item__image-link,
  .cart-item img {
    width: 90px;
    height: 90px;
  }
}
</style>
