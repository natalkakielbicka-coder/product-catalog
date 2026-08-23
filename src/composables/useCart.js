import { ref, computed } from 'vue'

const cartItems = ref([])

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

  function increaseQuantity(id) {
    const item = cartItems.value.find((item) => item.id === id)

    if (item) {
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

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  }
}
