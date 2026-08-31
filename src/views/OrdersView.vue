<script setup>
import { ref } from 'vue'
import { useOrders } from '@/composables/useOrders'
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import { formatCurrency } from '@/utils/currency'

const { orders } = useOrders()

const pageTitle = ref('Orders | Product Catalog')

useDocumentTitle(pageTitle)

function formatOrderDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function getItemsCount(items) {
  return items.reduce((total, item) => total + item.quantity, 0)
}
</script>

<template>
  <main class="orders">
    <div class="orders__header">
      <p class="orders__eyebrow">Your purchases</p>

      <h1>Order history</h1>

      <p>Review your previous orders and purchase details.</p>
    </div>

    <div v-if="orders.length === 0" class="orders-empty">
      <h2>No orders yet</h2>

      <p>Your completed orders will appear here.</p>

      <RouterLink to="/"> Browse products </RouterLink>
    </div>

    <div v-else class="orders-list">
      <article v-for="order in orders" :key="order.number" class="order-card">
        <div class="order-card__header">
          <div>
            <span>Order</span>

            <strong>
              {{ order.number }}
            </strong>
          </div>

          <div class="order-card__meta">
            <span class="order-status">
              {{ order.status ?? 'Processing' }}
            </span>

            <time :datetime="order.createdAt">
              {{ formatOrderDate(order.createdAt) }}
            </time>
          </div>
        </div>

        <div class="order-card__products">
          <div v-for="item in order.items.slice(0, 3)" :key="item.id" class="order-product">
            <img :src="item.thumbnail" :alt="item.title" />

            <div>
              <strong>
                {{ item.title }}
              </strong>

              <span>
                {{ item.quantity }}
                ×
                {{ formatCurrency(item.price) }}
              </span>
            </div>
          </div>

          <p v-if="order.items.length > 3" class="order-card__more">
            +{{ order.items.length - 3 }}
            more products
          </p>
        </div>

        <div class="order-card__footer">
          <div>
            <span>Items</span>

            <strong>
              {{ getItemsCount(order.items) }}
            </strong>
          </div>

          <div>
            <span>Delivery</span>

            <strong>
              {{ order.delivery.name }}
            </strong>
          </div>

          <div>
            <span>Payment</span>

            <strong>
              {{ order.payment }}
            </strong>
          </div>

          <div class="order-card__total">
            <span>Total</span>

            <strong>
              {{ formatCurrency(order.total) }}
            </strong>
          </div>
        </div>

        <RouterLink
          class="order-card__link"
          :to="{
            name: 'order-details',
            params: {
              number: order.number,
            },
          }"
        >
          View order →
        </RouterLink>
      </article>
    </div>
  </main>
</template>

<style scoped>
.orders {
  width: min(var(--container), calc(100% - 40px));

  margin: 0 auto;
  padding: 64px 0 96px;
}

.orders__header {
  margin-bottom: 36px;
}

.orders__eyebrow {
  margin: 0 0 8px;

  color: var(--color-accent);

  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.orders h1 {
  margin: 0;

  color: var(--color-text);

  font-size: clamp(36px, 6vw, 54px);
  font-weight: 500;
  letter-spacing: -0.04em;
}

.orders__header > p:last-child {
  margin: 12px 0 0;

  color: var(--color-muted);
}

.orders-list {
  display: grid;
  gap: 18px;
}

.order-card {
  overflow: hidden;

  border: 1px solid var(--color-border);
  border-radius: 20px;

  background: var(--color-surface);
}

.order-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;
  padding: 20px 24px;

  border-bottom: 1px solid var(--color-border);

  background: var(--color-image-bg);
}

.order-card__header > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-card__header span,
.order-card__header time {
  color: var(--color-muted);

  font-size: 12px;
}

.order-card__header strong {
  font-size: 14px;
}

.order-card__products {
  display: grid;
  gap: 12px;

  padding: 20px 24px;
}

.order-product {
  display: grid;
  grid-template-columns: 60px 1fr;

  align-items: center;

  gap: 14px;
}

.order-product img {
  width: 60px;
  height: 60px;

  border-radius: 10px;

  object-fit: contain;

  background: var(--color-image-bg);
}

.order-product > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-product strong {
  font-size: 13px;
}

.order-product span {
  color: var(--color-muted);

  font-size: 12px;
}

.order-card__more {
  margin: 4px 0 0;

  color: var(--color-accent);

  font-size: 12px;
  font-weight: 600;
}

.order-card__footer {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 18px;
  padding: 18px 24px;

  border-top: 1px solid var(--color-border);
}

.order-card__footer > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-card__footer span {
  color: var(--color-muted);

  font-size: 11px;
}

.order-card__footer strong {
  font-size: 13px;
}

.order-card__total {
  text-align: right;
}

.order-card__total strong {
  color: var(--color-accent);

  font-size: 16px;
}

.orders-empty {
  padding: 60px 30px;

  border: 1px solid var(--color-border);
  border-radius: 20px;

  background: var(--color-surface);

  text-align: center;
}

.orders-empty h2 {
  margin: 0 0 10px;
}

.orders-empty p {
  margin: 0 0 24px;

  color: var(--color-muted);
}

.orders-empty a {
  display: inline-flex;

  padding: 12px 18px;

  border-radius: 10px;

  color: #fff;
  background: var(--color-accent);

  font-weight: 700;
  text-decoration: none;
}

.order-card__link {
  display: flex;
  justify-content: flex-end;

  padding: 0 24px 20px;

  color: var(--color-accent);

  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.order-card__link:hover {
  text-decoration: underline;
}

.order-card__meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-status {
  display: inline-flex;
  align-items: center;

  padding: 6px 10px;

  border-radius: 999px;

  color: var(--color-accent);
  background: var(--color-accent-light);

  font-size: 11px;
  font-weight: 700;
  margin-bottom: 5px;
}

@media (max-width: 767px) {
  .order-card__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .order-card__footer {
    grid-template-columns: 1fr 1fr;
  }

  .order-card__total {
    text-align: left;
  }
}
</style>
