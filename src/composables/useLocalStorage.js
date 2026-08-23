import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const savedValue = localStorage.getItem(key)

  const value = ref(savedValue ? JSON.parse(savedValue) : defaultValue)

  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true },
  )

  return value
}
