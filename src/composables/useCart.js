import { computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { getProduct, getProductVariations } from '@/services/productService'

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

  async function getFreshCartProduct(item) {
    if (item.parentId) {
      const variations = await getProductVariations(item.parentId)

      return variations.find((variation) => variation.id === item.id) ?? null
    }

    return getProduct(item.id)
  }

  async function refreshCartStock() {
    const changes = []

    for (const item of cartItems.value) {
      try {
        const freshProduct = await getFreshCartProduct(item)

        if (!freshProduct) {
          continue
        }

        const previousQuantity = item.quantity
        item.isInStock = freshProduct.isInStock
        item.stockQuantity = freshProduct.stockQuantity
        item.manageStock = freshProduct.manageStock
        item.backordersAllowed = freshProduct.backordersAllowed
        const maximumQuantity = getMaximumQuantity(item)

        if (!item.isInStock || maximumQuantity <= 0) {
          removeFromCart(item.id)

          changes.push({
            title: item.title,
            variationLabel: item.variationLabel ?? '',
            previousQuantity,
            quantity: 0,
            removed: true,
          })

          continue
        }

        if (Number.isFinite(maximumQuantity) && item.quantity > maximumQuantity) {
          item.quantity = maximumQuantity

          changes.push({
            title: item.title,
            variationLabel: item.variationLabel ?? '',
            previousQuantity,
            quantity: item.quantity,
            removed: false,
          })
        }
      } catch {
        // Nie zmieniamy pozycji,
        // jeśli nie udało się pobrać
        // aktualnego produktu.
      }
    }

    return changes
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
    getMaximumQuantity,
    refreshCartStock,
  }
}
