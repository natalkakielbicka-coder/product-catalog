import { computed, ref, watch } from 'vue'

export function useProductFilters(products) {
  const searchInput = ref('')
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const sortBy = ref('')

  watch(selectedCategory, () => {
    searchInput.value = ''
    searchQuery.value = ''
  })

  const categories = computed(() => {
    return [...new Set(products.value.map((product) => product.category))]
  })

  function applySearch() {
    selectedCategory.value = ''
    searchQuery.value = searchInput.value
  }

  const filteredProducts = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    const result = products.value.filter((product) => {
      const matchesSearch = !query || product.title.toLowerCase().includes(query)

      const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value

      return matchesSearch && matchesCategory
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

  return {
    searchInput,
    searchQuery,
    filteredProducts,
    applySearch,
    selectedCategory,
    categories,
    sortBy,
  }
}
