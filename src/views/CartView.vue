<script setup>
import { useCart } from '@/composables/useCart'
import CartItem from '@/components/CartItem.vue'
const { cartItems, cartCount, cartTotal } = useCart()
</script>

<template>
  <main>
    <h1>Cart</h1>

    <p v-if="cartCount === 0">Your cart is empty.</p>

    <div v-else>
      <CartItem v-for="item in cartItems" :key="item.id" :item="item" />

      <div class="cart-summary">
        <p>
          Total:
          <strong>{{ cartTotal.toFixed(2) }} $</strong>
        </p>
      </div>
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

.cart-summary {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  font-size: 20px;
}
</style>
