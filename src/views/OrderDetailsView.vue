<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useOrders } from '@/composables/useOrders'
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import { formatCurrency } from '@/utils/currency'

const route = useRoute()

const { getOrderByNumber } = useOrders()

const order = computed(() => {
  return getOrderByNumber(route.params.number)
})

const pageTitle = computed(() => {
  if (!order.value) {
    return 'Order not found | Product Catalog'
  }

  return `${order.value.number} | Product Catalog`
})

useDocumentTitle(pageTitle)

function formatOrderDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}
</script>

<template>
  <main class="order-details">
    <RouterLink to="/orders" class="order-details__back"> ← Back to orders </RouterLink>

    <div v-if="!order" class="order-details__empty">
      <h1>Order not found</h1>

      <p>This order does not exist in your order history.</p>
    </div>

    <template v-else>
      <header class="order-details__header">
        <div>
          <p>Order</p>

          <h1>
            {{ order.number }}
          </h1>
        </div>

        <span class="order-details__status">
          {{ order.status ?? 'Processing' }}
        </span>

        <time :datetime="order.createdAt">
          {{ formatOrderDate(order.createdAt) }}
        </time>
      </header>

      <section class="order-details__section">
        <h2>Products</h2>

        <div v-for="item in order.items" :key="item.id" class="order-item">
          <img :src="item.thumbnail" :alt="item.title" />

          <div class="order-item__content">
            <strong>
              {{ item.title }}
            </strong>

            <span>
              {{ item.quantity }}
              ×
              {{ formatCurrency(item.price) }}
            </span>
          </div>

          <strong>
            {{ formatCurrency(item.price * item.quantity) }}
          </strong>
        </div>
      </section>

      <div class="order-details__grid">
        <section class="order-details__section">
          <h2>Shipping address</h2>

          <p>
            {{ order.customer.name }}<br />
            {{ order.customer.address }}<br />
            {{ order.customer.postalCode }}
            {{ order.customer.city }}
          </p>

          <p>
            {{ order.customer.email }}
          </p>
        </section>

        <section class="order-details__section">
          <h2>Delivery & payment</h2>

          <p>
            Delivery:
            <strong>
              {{ order.delivery.name }}
            </strong>
          </p>

          <p>
            Payment:
            <strong>
              {{ order.payment }}
            </strong>
          </p>
        </section>
      </div>

      <section class="order-details__summary">
        <div>
          <span>Subtotal</span>

          <strong>
            {{ formatCurrency(order.subtotal) }}
          </strong>
        </div>

        <div v-if="order.discount > 0">
          <span>Discount</span>

          <strong> -{{ formatCurrency(order.discount) }} </strong>
        </div>

        <div>
          <span>Delivery</span>

          <strong>
            {{ order.delivery.cost === 0 ? 'Free' : formatCurrency(order.delivery.cost) }}
          </strong>
        </div>

        <div v-if="order.paymentFee > 0">
          <span>Payment fee</span>

          <strong>
            {{ formatCurrency(order.paymentFee) }}
          </strong>
        </div>

        <div class="order-details__total">
          <span>Total</span>

          <strong>
            {{ formatCurrency(order.total) }}
          </strong>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.order-details {
  width: min(900px, calc(100% - 40px));

  margin: 0 auto;
  padding: 64px 0 96px;
}

.order-details__back {
  display: inline-flex;

  margin-bottom: 28px;

  color: var(--color-accent);

  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.order-details__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 24px;
  margin-bottom: 32px;
}

.order-details__header p {
  margin: 0 0 5px;

  color: var(--color-muted);

  font-size: 12px;
}

.order-details__header h1 {
  margin: 0;

  font-size: clamp(28px, 5vw, 44px);
}

.order-details__header time {
  color: var(--color-muted);

  font-size: 13px;
}

.order-details__section,
.order-details__summary {
  padding: 24px;

  border: 1px solid var(--color-border);
  border-radius: 18px;

  background: var(--color-surface);
}

.order-details__section h2 {
  margin: 0 0 20px;

  font-size: 18px;
}

.order-item {
  display: grid;
  grid-template-columns: 70px 1fr auto;

  align-items: center;

  gap: 16px;
  padding: 12px 0;

  border-bottom: 1px solid var(--color-border);
}

.order-item:last-child {
  border-bottom: 0;
}

.order-item img {
  width: 70px;
  height: 70px;

  border-radius: 10px;

  object-fit: contain;

  background: var(--color-image-bg);
}

.order-item__content {
  display: flex;
  flex-direction: column;

  gap: 5px;
}

.order-item__content span {
  color: var(--color-muted);

  font-size: 12px;
}

.order-details__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 18px;
  margin: 18px 0;
}

.order-details__section p {
  color: var(--color-muted);

  font-size: 13px;
  line-height: 1.7;
}

.order-details__summary {
  margin-top: 18px;
}

.order-details__summary > div {
  display: flex;
  justify-content: space-between;

  padding: 8px 0;
}

.order-details__summary span {
  color: var(--color-muted);
}

.order-details__total {
  margin-top: 12px;
  padding-top: 18px !important;

  border-top: 1px solid var(--color-border);

  font-size: 18px;
}

.order-details__total strong {
  color: var(--color-accent);
}

.order-details__status {
  display: inline-flex;

  margin-top: 10px;
  padding: 6px 10px;

  border-radius: 999px;

  color: var(--color-accent);
  background: var(--color-accent-light);

  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 767px) {
  .order-details__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .order-details__grid {
    grid-template-columns: 1fr;
  }

  .order-item {
    grid-template-columns: 55px 1fr;
  }

  .order-item > strong {
    grid-column: 2;
  }
}
</style>
