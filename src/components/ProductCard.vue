<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { formatCurrency } from '@/utils/currency'
import { useCart } from '@/composables/useCart'
import { useFavorites } from '@/composables/useFavorites'
import { useCompare } from '@/composables/useCompare'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const route = useRoute()

const { addToCart } = useCart()

const { isFavorite, toggleFavorite } = useFavorites()

const { isCompared, toggleCompare, compareLimitReached } = useCompare()

const quantity = ref(1)

function increaseQuantity() {
  quantity.value++
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const originalPrice = computed(() => {
  if (!props.product.discountPercentage) {
    return props.product.price
  }

  return props.product.price / (1 - props.product.discountPercentage / 100)
})
</script>

<template>
  <article class="product-card">
    <button
      class="product-card__favorite"
      :class="{ active: isFavorite(product.id) }"
      type="button"
      :aria-label="isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'"
      @click="toggleFavorite(product.id)"
    >
      {{ isFavorite(product.id) ? '♥' : '♡' }}
    </button>

    <RouterLink
      class="product-card__link"
      :to="{
        path: `/product/${product.id}`,
        query: route.query,
      }"
    >
      <img :src="product.thumbnail" :alt="product.title" />

      <span class="product-card__category">
        {{ product.category }}
      </span>

      <h2>{{ product.title }}</h2>

      <div class="product-card__prices">
        <span class="product-card__price">
          {{ formatCurrency(product.price) }}
        </span>

        <span v-if="product.discountPercentage > 0" class="product-card__old-price">
          {{ formatCurrency(originalPrice) }}
        </span>

        <span v-if="product.discountPercentage > 0" class="product-card__discount">
          -{{ product.discountPercentage.toFixed(0) }}%
        </span>
      </div>
    </RouterLink>

    <div class="product-card__actions">
      <div class="product-card__quantity">
        <button type="button" aria-label="Decrease quantity" @click="decreaseQuantity">−</button>

        <span>{{ quantity }}</span>

        <button type="button" aria-label="Increase quantity" @click="increaseQuantity">+</button>
      </div>

      <button class="product-card__button" @click="addToCart(product, quantity)">
        Add to cart
      </button>
    </div>

    <button
      class="product-card__compare"
      :class="{ active: isCompared(product.id) }"
      type="button"
      :disabled="compareLimitReached && !isCompared(product.id)"
      @click="toggleCompare(product.id)"
    >
      {{
        isCompared(product.id)
          ? 'Remove from compare'
          : compareLimitReached
            ? 'Compare limit reached'
            : 'Compare'
      }}
    </button>
  </article>
</template>

<style scoped>
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.product-card:hover {
  transform: translateY(-6px);
  border-color: #dfc2d1;
  box-shadow: 0 18px 45px rgba(63, 37, 51, 0.08);
}

.product-card__link {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 10px 10px 0;
  color: inherit;
  text-decoration: none;
}

.product-card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 13px;
  background: var(--color-image-bg);
  object-fit: cover;
}

.product-card h2 {
  margin: 10px 8px 7px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.02em;
}

.product-card__prices {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  margin: auto 8px 0;
  padding-top: 12px;
}

.product-card__price {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 700;
}

.product-card__old-price {
  color: var(--color-muted);
  font-size: 13px;
  text-decoration: line-through;
}

.product-card__discount {
  padding: 4px 7px;
  border-radius: 999px;
  color: var(--color-accent);
  background: var(--color-accent-light);
  font-size: 11px;
  font-weight: 700;
}

.product-card__button:hover {
  transform: translateY(-2px);
  background: var(--color-accent-hover);
}

.product-card__category {
  display: inline-flex;
  align-self: flex-start;
  margin: 16px 8px 0;
  padding: 6px 10px;
  border-radius: 999px;
  color: var(--color-accent);
  background: var(--color-accent-light);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.product-card__actions {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  padding: 16px 10px 10px;
  align-items: center;
}

.product-card__quantity {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  height: 45px;
}

.product-card__quantity button {
  width: 36px;
  height: 42px;
  border: 0;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.product-card__quantity button:hover {
  background: var(--color-accent-light);
}

.product-card__quantity span {
  min-width: 28px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}

.product-card__button {
  padding: 12px 16px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.product-card__button:hover {
  transform: translateY(-2px);
  background: var(--color-accent-hover);
}

.product-card__favorite {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;

  color: var(--color-text);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);

  font-size: 21px;
  line-height: 1;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.product-card__favorite:hover {
  color: var(--color-accent);
  transform: scale(1.08);
}

.product-card__favorite.active {
  color: var(--color-accent);
  background: var(--color-accent-light);
}

.product-card__compare {
  width: calc(100% - 20px);
  margin: 0 10px 10px;
  padding: 10px 14px;

  border: 1px solid var(--color-accent);
  border-radius: 10px;

  color: var(--color-accent);
  background: transparent;

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.product-card__compare:hover:not(:disabled) {
  color: #fff;
  background: var(--color-accent);
}

.product-card__compare:disabled {
  color: var(--color-muted);
  border-color: var(--color-border);
  background: var(--color-image-bg);

  cursor: not-allowed;
  opacity: 0.6;
}

.product-card__compare.active {
  color: #fff;
  border-color: var(--color-accent);
  background: var(--color-accent);
}

.product-card__compare.active:hover {
  background: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
}
</style>
