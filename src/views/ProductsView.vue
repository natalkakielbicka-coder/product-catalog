<script setup>
import { onMounted } from 'vue'
import ProductGrid from '@/components/ProductGrid.vue'
import { useProducts } from '@/composables/useProducts'
import ProductSearch from '@/components/ProductSearch.vue'
import { useProductFilters } from '@/composables/useProductFilters'
import ProductCategories from '@/components/ProductCategories.vue'
import ProductSort from '@/components/ProductSort.vue'
import ProductPagination from '@/components/ProductPagination.vue'
import { usePagination } from '@/composables/usePagination'

const { products, loading, error, fetchProducts } = useProducts()

const {
  searchInput,
  selectedCategory,
  categories,
  sortBy,
  filteredProducts,
  hasActiveFilters,
  applySearch,
  clearFilters,
} = useProductFilters(products)

const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(filteredProducts, 12)

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <main>
    <h1>Products</h1>

    <ProductSearch v-model="searchInput" @search="applySearch" />

    <ProductCategories v-model="selectedCategory" :categories="categories" />

    <p v-if="loading">Loading products...</p>

    <p v-else-if="error">Something went wrong.</p>

    <template v-else>
      <div class="products-toolbar">
        <p class="products-count">
          {{ filteredProducts.length }}
          {{ filteredProducts.length === 1 ? 'product' : 'products' }}
        </p>

        <div class="products-toolbar__actions">
          <button v-if="hasActiveFilters" class="clear-filters" type="button" @click="clearFilters">
            Clear filters
          </button>

          <ProductSort v-model="sortBy" />
        </div>
      </div>

      <div v-if="filteredProducts.length === 0" class="empty-state">
        <p>No products found.</p>

        <button v-if="hasActiveFilters" type="button" @click="clearFilters">Clear filters</button>
      </div>

      <template v-else>
        <ProductGrid :products="paginatedItems" />

        <ProductPagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change-page="goToPage"
        />
      </template>
    </template>
  </main>
</template>

<style scoped>
main {
  width: min(var(--container), calc(100% - 40px));
  margin: 0 auto;
  padding: 72px 0 96px;
}

h1 {
  margin: 0 0 48px;
  font-size: clamp(42px, 6vw, 72px);
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.products-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.products-count {
  margin: 0;
  color: var(--color-muted);
  font-size: 14px;
}

.products-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.clear-filters {
  padding: 10px 14px;
  border: 0;
  color: var(--color-accent);
  background: transparent;
  font-weight: 600;
  cursor: pointer;
}

.clear-filters:hover {
  text-decoration: underline;
}

.empty-state {
  padding: 64px 24px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  text-align: center;
  background: var(--color-surface);
}

.empty-state p {
  margin: 0 0 16px;
  font-size: 18px;
}

.empty-state button {
  padding: 12px 18px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 600;
  cursor: pointer;
}

.empty-state button:hover {
  background: var(--color-accent-hover);
}

@media (max-width: 767px) {
  .products-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
