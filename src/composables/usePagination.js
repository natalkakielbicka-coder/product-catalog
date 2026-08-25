import { computed, ref, watch } from 'vue'

export function usePagination(items, itemsPerPage) {
  const currentPage = ref(1)

  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage.value)
  })

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value

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

    return (currentPage.value - 1) * itemsPerPage.value + 1
  })

  const lastItem = computed(() => {
    return Math.min(currentPage.value * itemsPerPage.value, items.value.length)
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
