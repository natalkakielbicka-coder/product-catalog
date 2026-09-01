import { computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

const cartItems = useLocalStorage('cart', [])

export function useCart() {
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + item.quantity
    }, 0)
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  })

  function addToCart(product, quantity = 1) {
    const existingItem = cartItems.value.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock)

      return
    }

    cartItems.value.push({
      ...product,
      quantity,
    })
  }

  function increaseQuantity(id) {
    const item = cartItems.value.find((item) => item.id === id)

    if (!item) return

    if (item.quantity < item.stock) {
      item.quantity++
    }
  }

  function decreaseQuantity(id) {
    const item = cartItems.value.find((item) => item.id === id)

    if (!item) {
      return
    }

    if (item.quantity > 1) {
      item.quantity--
    }
  }

  function removeFromCart(id) {
    cartItems.value = cartItems.value.filter((item) => item.id !== id)
  }

  function clearCart() {
    cartItems.value = []
  }

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  }
}
