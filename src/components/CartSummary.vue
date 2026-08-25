<script setup>
import { formatCurrency } from '@/utils/currency'

defineProps({
  total: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <aside class="cart-summary">
    <h2>Order summary</h2>

    <div class="cart-summary__row">
      <span>Total</span>

      <strong>
        {{ formatCurrency(total) }}
      </strong>
    </div>

    <RouterLink to="/checkout" class="cart-summary__checkout"> Proceed to checkout </RouterLink>
  </aside>
</template>

<style scoped>
.cart-summary {
  width: min(100%, 380px);
  margin-left: auto;
  margin-top: 20px;
  padding: 24px;

  border: 1px solid var(--color-border);
  border-radius: 18px;

  background: var(--color-surface);
}

.cart-summary h2 {
  margin: 0 0 22px;

  color: var(--color-text);

  font-size: 20px;
  font-weight: 600;
}

.cart-summary__row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 18px 0;
  border-top: 1px solid var(--color-border);

  color: var(--color-muted);
  font-size: 15px;
}

.cart-summary__row strong {
  color: var(--color-text);
  font-size: 22px;
}

.cart-summary__checkout {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  margin-top: 6px;
  padding: 14px 20px;

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

.cart-summary__checkout:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

@media (max-width: 767px) {
  .cart-summary {
    width: 100%;
  }
}
</style>
