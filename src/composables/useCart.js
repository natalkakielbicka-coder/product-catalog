import { ref, computed } from 'vue'

const cartItems = ref([])

export function useCart() {
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + item.quantity
    }, 0)
  })

  function addToCart(product) {
    const existingItem = cartItems.value.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity++
      return
    }

    cartItems.value.push({
      ...product,
      quantity: 1,
    })
  }

  return {
    cartItems,
    cartCount,
    addToCart,
  }
}
