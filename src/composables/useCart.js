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

  function getMaximumQuantity(item) {
    if (!item.manageStock || item.backordersAllowed) {
      return Infinity
    }

    return item.stockQuantity ?? 0
  }

  function addToCart(product, quantity = 1) {
    const existingItem = cartItems.value.find((item) => item.id === product.id)
    const maximumQuantity = getMaximumQuantity(product)

    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, maximumQuantity)

      return
    }

    const initialQuantity = Math.min(quantity, maximumQuantity)

    if (initialQuantity <= 0) {
      return
    }

    cartItems.value.push({
      ...product,
      quantity: initialQuantity,
    })
  }

  function increaseQuantity(id) {
    const item = cartItems.value.find((item) => item.id === id)

    if (!item) {
      return
    }

    const maximumQuantity = getMaximumQuantity(item)

    if (item.quantity >= maximumQuantity) {
      return
    }

    item.quantity++
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
