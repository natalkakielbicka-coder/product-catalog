<script setup>
import { RouterLink } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { formatCurrency } from '@/utils/currency'

const emit = defineEmits(['close'])

const { cartItems, cartTotal, removeFromCart, increaseQuantity, decreaseQuantity } = useCart()
</script>

<template>
  <div class="mini-cart-overlay" @click.self="emit('close')">
    <aside class="mini-cart">
      <div class="mini-cart__header">
        <h2>Your cart</h2>

        <button
          class="mini-cart__close"
          type="button"
          aria-label="Close cart"
          @click="emit('close')"
        >
          ×
        </button>
      </div>

      <div v-if="cartItems.length === 0" class="mini-cart__empty">Your cart is empty.</div>

      <div v-else class="mini-cart__content">
        <div class="mini-cart__items">
          <article v-for="item in cartItems" :key="item.id" class="mini-cart__item">
            <RouterLink :to="`/product/${item.id}`" class="mini-cart__image" @click="emit('close')">
              <img :src="item.thumbnail" :alt="item.title" />
            </RouterLink>

            <div class="mini-cart__item-content">
              <RouterLink
                :to="`/product/${item.id}`"
                class="mini-cart__title"
                @click="emit('close')"
              >
                {{ item.title }}
              </RouterLink>

              <p class="mini-cart__price">
                {{ formatCurrency(item.price) }}
              </p>

              <div class="mini-cart__quantity">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  @click="decreaseQuantity(item.id)"
                >
                  −
                </button>

                <span>{{ item.quantity }}</span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  :disabled="item.quantity >= item.stock"
                  @click="increaseQuantity(item.id)"
                >
                  +
                </button>
              </div>

              <button class="mini-cart__remove" type="button" @click="removeFromCart(item.id)">
                Remove
              </button>
            </div>
          </article>
        </div>

        <div class="mini-cart__footer">
          <div class="mini-cart__total">
            <span>Total</span>
            <strong>{{ formatCurrency(cartTotal) }}</strong>
          </div>

          <RouterLink to="/cart" class="mini-cart__cart-link" @click="emit('close')">
            View cart
          </RouterLink>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.mini-cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  background: rgba(25, 20, 28, 0.35);
}

.mini-cart {
  display: flex;
  flex-direction: column;
  width: min(420px, 100%);
  height: 100%;
  overflow: hidden;
  padding: 24px;
  background: var(--color-surface);
  box-shadow: -16px 0 40px rgba(30, 20, 32, 0.12);
}

.mini-cart__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.mini-cart__header h2 {
  margin: 0;
  font-size: 22px;
}

.mini-cart__close {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  color: var(--color-text);
  background: var(--color-image-bg);
  font-size: 26px;
  cursor: pointer;
}

.mini-cart__empty {
  padding: 60px 0;
  color: var(--color-muted);
  text-align: center;
}

.mini-cart__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.mini-cart__items {
  flex: 1;
  overflow-y: auto;
}

.mini-cart__item {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 14px;
  padding: 18px 0;
  border-bottom: 1px solid var(--color-border);
}

.mini-cart__image {
  overflow: hidden;
  border-radius: 10px;
  background: var(--color-image-bg);
  display: flex;
  align-items: center;
}

.mini-cart__image img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.mini-cart__item-content {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.mini-cart__title {
  color: var(--color-text);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.mini-cart__title:hover {
  color: var(--color-accent);
}

.mini-cart__details {
  margin: 8px 0;
  color: var(--color-muted);
  font-size: 13px;
}

.mini-cart__remove {
  margin-top: 7px;
  padding: 0;
  border: 0;
  color: var(--color-accent);
  background: transparent;
  font-size: 12px;
  cursor: pointer;
}

.mini-cart__footer {
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.mini-cart__total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
  font-size: 16px;
}

.mini-cart__cart-link {
  display: block;
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}

.mini-cart__cart-link:hover {
  background: var(--color-accent-hover);
}

.mini-cart__price {
  margin: 7px 0 10px;
  color: var(--color-muted);
  font-size: 13px;
}

.mini-cart__quantity {
  display: inline-flex;
  align-items: center;
  overflow: hidden;

  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.mini-cart__quantity button {
  width: 30px;
  height: 30px;

  border: 0;
  background: transparent;

  font-size: 15px;
  cursor: pointer;
}

.mini-cart__quantity button:hover:not(:disabled) {
  background: var(--color-accent-light);
}

.mini-cart__quantity button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.mini-cart__quantity span {
  min-width: 30px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
}
</style>
