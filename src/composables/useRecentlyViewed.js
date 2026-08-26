import { useLocalStorage } from '@/composables/useLocalStorage'

const recentlyViewedIds = useLocalStorage('recently-viewed', [])

export function useRecentlyViewed() {
  function addRecentlyViewed(id) {
    recentlyViewedIds.value = recentlyViewedIds.value.filter((productId) => productId !== id)

    recentlyViewedIds.value.unshift(id)

    recentlyViewedIds.value = recentlyViewedIds.value.slice(0, 8)
  }

  return {
    recentlyViewedIds,
    addRecentlyViewed,
  }
}
