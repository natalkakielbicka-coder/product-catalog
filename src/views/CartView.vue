<script setup>
import { useCart } from '@/composables/useCart'
import CartItem from '@/components/CartItem.vue'
import CartSummary from '@/components/CartSummary.vue'
const { cartItems, cartCount, cartTotal } = useCart()
</script>

<template>
  <main>
    <h1>Cart</h1>

    <div v-if="cartItems.length === 0" class="cart-empty">
      <div class="cart-empty__icon">🛍</div>

      <h2>Your cart is empty</h2>

      <p>You haven't added any products yet. Explore the catalog and find something you like.</p>

      <RouterLink to="/" class="cart-empty__button"> Continue shopping </RouterLink>
    </div>

    <div v-else>
      <CartItem v-for="item in cartItems" :key="item.id" :item="item" />

      <CartSummary :total="cartTotal" />
    </div>
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

@media (max-width: 767px) {
  .cart-empty {
    margin-top: 32px;
    padding: 48px 24px;
  }
}
</style>
