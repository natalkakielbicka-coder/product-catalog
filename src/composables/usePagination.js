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
    if (page < 1 || page > totalPages.value) return

    currentPage.value = page
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
