<script setup>
import { nextTick, onMounted, watch, ref } from 'vue'
import ProductGrid from '@/components/ProductGrid.vue'
import { useProducts } from '@/composables/useProducts'
import ProductSearch from '@/components/ProductSearch.vue'
import { useProductFilters } from '@/composables/useProductFilters'
import ProductCategories from '@/components/ProductCategories.vue'
import ProductSort from '@/components/ProductSort.vue'
import ProductSkeleton from '@/components/ProductSkeleton.vue'
import ProductPagination from '@/components/ProductPagination.vue'
import { usePagination } from '@/composables/usePagination'
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import { useRoute, useRouter } from 'vue-router'

const { products, loading, error, fetchProducts } = useProducts()

const pageTitle = ref('Products | Product Catalog')

useDocumentTitle(pageTitle)

const {
  searchInput,
  searchQuery,
  selectedCategory,
  categories,
  sortBy,
  filteredProducts,
  hasActiveFilters,
  applySearch,
  clearFilters,
} = useProductFilters(products)

const itemsPerPage = ref(12)
const isInitializing = ref(true)

watch([searchQuery, selectedCategory, sortBy], () => {
  if (isInitializing.value) return

  currentPage.value = 1

  const query = {}

  if (searchQuery.value) {
    query.search = searchQuery.value
  }

  if (selectedCategory.value) {
    query.category = selectedCategory.value
  }

  if (sortBy.value) {
    query.sort = sortBy.value
  }

  router.replace({ query })
})

const { currentPage, totalPages, paginatedItems, goToPage, firstItem, lastItem } = usePagination(
  filteredProducts,
  itemsPerPage,
)

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  await fetchProducts()

  searchInput.value = route.query.search ?? ''
  searchQuery.value = route.query.search ?? ''
  selectedCategory.value = route.query.category ?? ''
  sortBy.value = route.query.sort ?? ''

  const page = Number(route.query.page) || 1
  goToPage(page)

  await nextTick()

  isInitializing.value = false
})

function handlePageChange(page) {
  goToPage(page)

  const query = { ...route.query }

  if (page === 1) {
    delete query.page
  } else {
    query.page = page
  }

  router.push({ query })

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

watch(
  () => route.query.page,
  (page) => {
    const pageNumber = Number(page) || 1

    if (pageNumber !== currentPage.value) {
      goToPage(pageNumber)
    }
  },
)

watch(itemsPerPage, () => {
  currentPage.value = 1

  const query = { ...route.query }

  delete query.page

  router.replace({ query })
})
</script>

<template>
  <main>
    <h1>Products</h1>

    <ProductSearch v-model="searchInput" @search="applySearch" />

    <ProductCategories v-model="selectedCategory" :categories="categories" />

    <div v-if="loading" class="products-skeleton">
      <ProductSkeleton v-for="item in 12" :key="item" />
    </div>

    <p v-else-if="error">Something went wrong.</p>

    <template v-else>
      <div class="products-toolbar">
        <p class="products-count">
          Showing {{ firstItem }}–{{ lastItem }} of
          {{ filteredProducts.length }}
          {{ filteredProducts.length === 1 ? 'product' : 'products' }}
        </p>

        <div class="products-toolbar__actions">
          <button v-if="hasActiveFilters" class="clear-filters" type="button" @click="clearFilters">
            Clear filters
          </button>

          <ProductSort v-model="sortBy" />

          <div class="per-page">
            <button
              type="button"
              :class="{ active: itemsPerPage === 12 }"
              @click="itemsPerPage = 12"
            >
              12
            </button>

            <button
              type="button"
              :class="{ active: itemsPerPage === 24 }"
              @click="itemsPerPage = 24"
            >
              24
            </button>

            <button
              type="button"
              :class="{ active: itemsPerPage === 48 }"
              @click="itemsPerPage = 48"
            >
              48
            </button>
          </div>
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
          @change-page="handlePageChange"
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

.per-page {
  display: flex;
  gap: 6px;
}

.per-page button {
  min-width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  color: var(--color-muted);
  background: var(--color-surface);
  cursor: pointer;
}

.per-page button:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.per-page button.active {
  color: #fff;
  border-color: var(--color-accent);
  background: var(--color-accent);
}

.products-skeleton {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  margin-top: 32px;
}

@media (max-width: 1023px) {
  .products-skeleton {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .products-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .products-skeleton {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 479px) {
  .products-skeleton {
    grid-template-columns: 1fr;
  }
}
</style>
