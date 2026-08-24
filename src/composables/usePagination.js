import { computed, ref, watch } from 'vue'

export function usePagination(items, itemsPerPage = 12) {
  const currentPage = ref(1)

  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage)
  })

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage

    return items.value.slice(start, end)
  })

  function goToPage(page) {
    if (totalPages.value === 0) {
      currentPage.value = 1
      return
    }

    currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
  }

  watch(items, () => {
    currentPage.value = 1
  })

  const firstItem = computed(() => {
    if (items.value.length === 0) return 0

    return (currentPage.value - 1) * itemsPerPage + 1
  })

  const lastItem = computed(() => {
    return Math.min(currentPage.value * itemsPerPage, items.value.length)
  })

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    firstItem,
    lastItem,
  }
}
