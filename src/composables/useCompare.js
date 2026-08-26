import { computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

const compareIds = useLocalStorage('compare-products', [])

export function useCompare() {
  const compareCount = computed(() => compareIds.value.length)

  function isCompared(id) {
    return compareIds.value.includes(id)
  }

  function toggleCompare(id) {
    if (isCompared(id)) {
      compareIds.value = compareIds.value.filter((productId) => productId !== id)

      return
    }

    if (compareLimitReached.value) {
      return
    }

    compareIds.value.push(id)
  }

  function clearCompare() {
    compareIds.value = []
  }

  const MAX_COMPARE_PRODUCTS = 3

  const compareLimitReached = computed(() => {
    return compareIds.value.length >= MAX_COMPARE_PRODUCTS
  })

  return {
    compareIds,
    compareCount,
    isCompared,
    toggleCompare,
    clearCompare,
    compareLimitReached,
  }
}
