import { computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

const favoriteIds = useLocalStorage('favorites', [])

export function useFavorites() {
  const favoritesCount = computed(() => {
    return favoriteIds.value.length
  })

  function isFavorite(id) {
    return favoriteIds.value.includes(id)
  }

  function toggleFavorite(id) {
    if (isFavorite(id)) {
      favoriteIds.value = favoriteIds.value.filter((favoriteId) => favoriteId !== id)

      return
    }

    favoriteIds.value.push(id)
  }

  return {
    favoriteIds,
    favoritesCount,
    isFavorite,
    toggleFavorite,
  }
}
