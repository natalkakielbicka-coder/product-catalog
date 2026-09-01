<script setup>
import { ref, computed } from 'vue'
import { useCart } from '@/composables/useCart'
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import CartItem from '@/components/CartItem.vue'
import CartSummary from '@/components/CartSummary.vue'
import BaseModal from '@/components/BaseModal.vue'
import { FREE_DELIVERY_THRESHOLD } from '@/composables/useCheckoutPricing'
import { formatCurrency } from '@/utils/currency'

const { cartItems, cartCount, cartTotal, clearCart } = useCart()

const freeShippingRemaining = computed(() => {
  return Math.max(FREE_DELIVERY_THRESHOLD - cartTotal.value, 0)
})

const freeShippingProgress = computed(() => {
  return Math.min((cartTotal.value / FREE_DELIVERY_THRESHOLD) * 100, 100)
})

const pageTitle = ref('Cart | Product Catalog')

useDocumentTitle(pageTitle)

const clearCartModalOpen = ref(false)

function confirmClearCart() {
  clearCart()
  clearCartModalOpen.value = false
}
</script>

<template>
  <main>
    <div class="cart-header">
      <h1>Cart</h1>

      <button
        v-if="cartItems.length"
        class="cart-clear"
        type="button"
        @click="clearCartModalOpen = true"
      >
        Clear cart
      </button>
    </div>

    <div v-if="cartItems.length === 0" class="cart-empty">
      <div class="cart-empty__icon">🛍</div>

      <h2>Your cart is empty</h2>

      <p>You haven't added any products yet. Explore the catalog and find something you like.</p>

      <RouterLink to="/" class="cart-empty__button"> Continue shopping </RouterLink>
    </div>

    <div v-else>
      <div class="shipping-progress">
        <p v-if="freeShippingRemaining > 0">
          Add
          <strong>
            {{ formatCurrency(freeShippingRemaining) }}
          </strong>
          more for free standard shipping.
        </p>

        <p v-else>
          <strong>You've unlocked free standard shipping!</strong>
        </p>

        <div
          class="shipping-progress__track"
          role="progressbar"
          aria-label="Free shipping progress"
          :aria-valuenow="freeShippingProgress"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            class="shipping-progress__bar"
            :style="{
              width: `${freeShippingProgress}%`,
            }"
          ></div>
        </div>
      </div>

      <TransitionGroup name="cart-list" tag="div" class="cart-items">
        <CartItem v-for="item in cartItems" :key="item.id" :item="item" />
      </TransitionGroup>

      <CartSummary :total="cartTotal" />
    </div>

    <BaseModal :open="clearCartModalOpen" @close="clearCartModalOpen = false">
      <div class="clear-cart-modal">
        <h2>Clear your cart?</h2>

        <p>This will remove all products from your cart.</p>

        <div class="clear-cart-modal__actions">
          <button
            class="clear-cart-modal__cancel"
            type="button"
            @click="clearCartModalOpen = false"
          >
            Cancel
          </button>

          <button class="clear-cart-modal__confirm" type="button" @click="confirmClearCart">
            Clear cart
          </button>
        </div>
      </div>
    </BaseModal>
  </main>
</template>

<style scoped>
main {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  padding: 48px 0;
}

h1 {
  margin: 0 0 32px;
}

.cart-empty {
  display: flex;
  align-items: center;
  flex-direction: column;

  max-width: 620px;
  margin: 48px auto 0;
  padding: 64px 40px;

  border: 1px solid var(--color-border);
  border-radius: 24px;

  background: linear-gradient(145deg, var(--color-surface), var(--color-image-bg));

  text-align: center;
}

.cart-empty__icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 72px;
  height: 72px;
  margin-bottom: 24px;

  border-radius: 50%;

  background: var(--color-accent-light);

  font-size: 30px;
}

.cart-empty h2 {
  margin: 0 0 12px;

  color: var(--color-text);

  font-size: clamp(26px, 4vw, 36px);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.cart-empty p {
  max-width: 430px;
  margin: 0 0 28px;

  color: var(--color-muted);

  font-size: 15px;
  line-height: 1.7;
}

.cart-empty__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 14px 22px;

  border-radius: 12px;

  color: #fff;
  background: var(--color-accent);

  font-size: 14px;
  font-weight: 700;
  text-decoration: none;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.cart-empty__button:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
}

.cart-header h1 {
  margin: 0;
}

.cart-clear {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;

  color: var(--color-muted);
  background: var(--color-surface);

  font-weight: 600;
  cursor: pointer;
}

.cart-clear:hover {
  color: #a33d4a;
  border-color: #a33d4a;
}

.clear-cart-modal h2 {
  margin: 0 0 12px;
  font-size: 24px;
}

.clear-cart-modal p {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.6;
}

.clear-cart-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 28px;
}

.clear-cart-modal__actions button {
  padding: 11px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.clear-cart-modal__cancel {
  border: 1px solid var(--color-border);
  color: var(--color-text);
  background: var(--color-surface);
}

.clear-cart-modal__confirm {
  border: 0;
  color: #fff;
  background: #a33d4a;
}

.cart-items {
  position: relative;
}

.cart-list-enter-active,
.cart-list-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.cart-list-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.cart-list-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.cart-list-move {
  transition: transform 0.3s ease;
}

.shipping-progress {
  margin-bottom: 28px;
  padding: 18px 20px;

  border: 1px solid var(--color-border);
  border-radius: 14px;

  background: var(--color-surface);
}

.shipping-progress p {
  margin: 0 0 12px;

  color: var(--color-muted);

  font-size: 13px;
}

.shipping-progress strong {
  color: var(--color-accent);
}

.shipping-progress__track {
  overflow: hidden;

  width: 100%;
  height: 8px;

  border-radius: 999px;

  background: var(--color-accent-light);
}

.shipping-progress__bar {
  height: 100%;

  border-radius: inherit;

  background: var(--color-accent);

  transition: width 0.3s ease;
}

@media (max-width: 767px) {
  .cart-empty {
    margin-top: 32px;
    padding: 48px 24px;
  }
}
</style>
