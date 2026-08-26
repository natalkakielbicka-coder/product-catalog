<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCompare } from '@/composables/useCompare'
import { useProducts } from '@/composables/useProducts'
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import { useCart } from '@/composables/useCart'
import { formatCurrency } from '@/utils/currency'
import ErrorState from '@/components/ErrorState.vue'

const { compareIds, toggleCompare } = useCompare()

const { addToCart } = useCart()

const { products, loading, error, fetchProducts } = useProducts()

const pageTitle = ref('Compare products | Product Catalog')

useDocumentTitle(pageTitle)

const compareProducts = computed(() => {
  return compareIds.value
    .map((id) => {
      return products.value.find((product) => product.id === id)
    })
    .filter(Boolean)
})

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <main>
    <div class="compare-header">
      <div>
        <h1>Compare products</h1>

        <p v-if="compareProducts.length">
          Compare {{ compareProducts.length }}
          {{ compareProducts.length === 1 ? 'product' : 'products' }}
        </p>
      </div>

      <RouterLink to="/" class="compare-header__back"> ← Back to products </RouterLink>
    </div>

    <p v-if="loading">Loading products...</p>

    <ErrorState v-else-if="error" @retry="fetchProducts" />

    <div v-else-if="compareProducts.length === 0" class="compare-empty">
      <h2>No products to compare</h2>

      <p>Add products to comparison from the product catalog.</p>

      <RouterLink to="/"> Browse products </RouterLink>
    </div>

    <div v-else class="compare-table-wrapper">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Product</th>

            <th v-for="product in compareProducts" :key="product.id">
              <div class="compare-product">
                <RouterLink :to="`/product/${product.id}`" class="compare-product__image">
                  <img :src="product.thumbnail" :alt="product.title" />
                </RouterLink>

                <RouterLink :to="`/product/${product.id}`" class="compare-product__title">
                  {{ product.title }}
                </RouterLink>

                <button
                  class="compare-product__remove"
                  type="button"
                  @click="toggleCompare(product.id)"
                >
                  Remove
                </button>

                <button
                  class="compare-product__cart"
                  type="button"
                  :disabled="product.stock === 0"
                  @click="addToCart(product)"
                >
                  {{ product.stock > 0 ? 'Add to cart' : 'Out of stock' }}
                </button>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <th>Price</th>

            <td v-for="product in compareProducts" :key="product.id">
              <strong>
                {{ formatCurrency(product.price) }}
              </strong>
            </td>
          </tr>

          <tr>
            <th>Category</th>

            <td v-for="product in compareProducts" :key="product.id">
              {{ product.category }}
            </td>
          </tr>

          <tr>
            <th>Brand</th>

            <td v-for="product in compareProducts" :key="product.id">
              {{ product.brand || '—' }}
            </td>
          </tr>

          <tr>
            <th>Rating</th>

            <td v-for="product in compareProducts" :key="product.id">★ {{ product.rating }}</td>
          </tr>

          <tr>
            <th>Availability</th>

            <td v-for="product in compareProducts" :key="product.id">
              <span
                :class="{
                  available: product.stock > 0,
                  unavailable: product.stock === 0,
                }"
              >
                {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
main {
  width: min(var(--container), calc(100% - 40px));
  margin: 0 auto;
  padding: 72px 0 120px;
}

.compare-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 48px;
}

.compare-header h1 {
  margin: 0 0 12px;
  font-size: clamp(42px, 6vw, 72px);
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.compare-header p {
  margin: 0;
  color: var(--color-muted);
}

.compare-header__back {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
}

.compare-table-wrapper {
  overflow-x: auto;
}

.compare-table {
  width: 100%;
  min-width: 760px;
  border-spacing: 0;
  border-collapse: collapse;
}

.compare-table th,
.compare-table td {
  min-width: 200px;
  padding: 20px;
  border: 1px solid var(--color-border);
  text-align: left;
  vertical-align: middle;
}

.compare-table tbody th,
.compare-table thead th:first-child {
  min-width: 150px;
  color: var(--color-muted);
  background: var(--color-image-bg);
  font-size: 14px;
}

.compare-product {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 12px;
}

.compare-product__image {
  display: block;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: var(--color-image-bg);
}

.compare-product__image img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.compare-product__title {
  color: var(--color-text);
  font-size: 17px;
  font-weight: 600;
  text-decoration: none;
}

.available {
  color: #34834a;
}

.unavailable {
  color: #b33f3f;
}

.compare-empty {
  padding: 72px 24px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  text-align: center;
  background: var(--color-surface);
}

.compare-empty h2 {
  margin: 0 0 12px;
}

.compare-empty p {
  margin: 0 0 24px;
  color: var(--color-muted);
}

.compare-empty a {
  display: inline-block;
  padding: 12px 18px;
  border-radius: 10px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
}

.compare-product__cart {
  width: 100%;
  padding: 11px 16px;

  border: 0;
  border-radius: 10px;

  color: #fff;
  background: var(--color-accent);

  font-weight: 600;
  cursor: pointer;
}

.compare-product__cart:hover:not(:disabled) {
  background: var(--color-accent-hover);
}

.compare-product__cart:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.compare-product__remove {
  padding: 0;
  border: 0;
  color: var(--color-accent);
  background: transparent;
  font-weight: 600;
  cursor: pointer;
}

.compare-product__remove {
  padding: 0;
  border: 0;

  color: var(--color-accent);
  background: transparent;

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  transition:
    color 0.2s ease,
    opacity 0.2s ease;
}

.compare-product__remove:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
}

@media (max-width: 767px) {
  .compare-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
