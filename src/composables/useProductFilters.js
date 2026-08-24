import { computed, ref } from 'vue'

export function useProductFilters(products) {
  const searchInput = ref('')
  const searchQuery = ref('')

  function applySearch() {
    searchQuery.value = searchInput.value
  }

  const filteredProducts = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    if (!query) {
      return products.value
    }

    return products.value.filter((product) => {
      return product.title.toLowerCase().includes(query)
    })
  })

  return {
    searchInput,
    searchQuery,
    filteredProducts,
    applySearch,
  }
}
