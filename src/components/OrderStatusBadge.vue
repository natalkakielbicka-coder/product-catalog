<script setup>
import { getOrderStatusClass } from '@/utils/orderStatusClass'

defineProps({
  status: {
    type: String,
    required: true,
  },

  statusName: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <span class="order-status" :class="getOrderStatusClass(status)">
    {{ statusName || status }}
  </span>
</template>

<style scoped>
.order-status {
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  border-radius: 999px;
  color: var(--color-accent);
  background: var(--color-accent-light);
  font-size: 11px;
  font-weight: 700;
}

.order-status--pending {
  color: #92400e;
  background: #fef3c7;
}

.order-status--on-hold {
  color: #9a3412;
  background: #ffedd5;
}

.order-status--processing {
  color: #1d4ed8;
  background: #dbeafe;
}

.order-status--completed {
  color: #166534;
  background: #dcfce7;
}

.order-status--cancelled {
  color: #475569;
  background: #e2e8f0;
}

.order-status--refunded {
  color: #6b21a8;
  background: #f3e8ff;
}

.order-status--failed {
  color: #991b1b;
  background: #fee2e2;
}
</style>
