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

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
  }
}
