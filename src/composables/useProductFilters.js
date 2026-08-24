import { computed, ref, watch } from 'vue'

export function useProductFilters(products) {
  const searchInput = ref('')
  const searchQuery = ref('')
  const selectedCategory = ref('')

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

    return products.value.filter((product) => {
      const matchesSearch = !query || product.title.toLowerCase().includes(query)

      const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value

      return matchesSearch && matchesCategory
    })
  })

  return {
    searchInput,
    searchQuery,
    filteredProducts,
    applySearch,
    selectedCategory,
    categories,
  }
}
