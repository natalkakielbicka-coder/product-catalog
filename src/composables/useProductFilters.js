import { computed, ref, watch } from 'vue'

export function useProductFilters(products) {
  const searchInput = ref('')
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const sortBy = ref('')
  const minPrice = ref(0)
  const maxPrice = ref(0)
  const inStockOnly = ref(false)

  const priceLimit = computed(() => {
    if (products.value.length === 0) {
      return 0
    }

    return Math.ceil(Math.max(...products.value.map((product) => product.price)))
  })

  watch(
    priceLimit,
    (newLimit) => {
      if (maxPrice.value === 0) {
        maxPrice.value = newLimit
      }
    },
    { immediate: true },
  )

  const categories = computed(() => {
    return [...new Set(products.value.map((product) => product.category))]
  })

  function applySearch() {
    searchQuery.value = searchInput.value
  }

  const filteredProducts = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    const result = products.value.filter((product) => {
      const matchesSearch = !query || product.title.toLowerCase().includes(query)

      const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value

      const matchesMinPrice = minPrice.value === '' || product.price >= minPrice.value

      const matchesMaxPrice = maxPrice.value === '' || product.price <= maxPrice.value

      const matchesStock = !inStockOnly.value || product.stock > 0

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesStock
    })

    if (sortBy.value === 'price-asc') {
      return [...result].sort((a, b) => a.price - b.price)
    }

    if (sortBy.value === 'price-desc') {
      return [...result].sort((a, b) => b.price - a.price)
    }

    if (sortBy.value === 'name-asc') {
      return [...result].sort((a, b) => a.title.localeCompare(b.title))
    }

    if (sortBy.value === 'name-desc') {
      return [...result].sort((a, b) => b.title.localeCompare(a.title))
    }

    return result
  })

  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value !== '' ||
      selectedCategory.value !== '' ||
      sortBy.value !== '' ||
      minPrice.value > 0 ||
      maxPrice.value < priceLimit.value ||
      inStockOnly.value
    )
  })

  function clearFilters() {
    searchInput.value = ''
    searchQuery.value = ''
    selectedCategory.value = ''
    sortBy.value = ''
    minPrice.value = 0
    maxPrice.value = priceLimit.value
    inStockOnly.value = false
  }

  return {
    searchInput,
    searchQuery,
    filteredProducts,
    applySearch,
    selectedCategory,
    categories,
    sortBy,
    hasActiveFilters,
    clearFilters,
    minPrice,
    maxPrice,
    priceLimit,
    inStockOnly,
  }
}
