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
  <div class="cart-summary">
    <p>
      Total:
      <strong>{{ formatCurrency(total) }}</strong>
    </p>
  </div>
</template>

<style scoped>
.cart-summary {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.cart-summary p {
  margin: 0;
  font-size: 20px;
}

.cart-summary strong {
  margin-left: 8px;
  font-size: 24px;
}
</style>
