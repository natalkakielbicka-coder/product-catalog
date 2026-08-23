import { ref } from 'vue'
import { getProduct, getProducts } from '@/services/productService'

export function useProducts() {
  const products = ref([])
  const product = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchProducts() {
    loading.value = true
    error.value = null

    try {
      products.value = await getProducts()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id) {
    loading.value = true
    error.value = null

    try {
      product.value = await getProduct(id)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    product,
    loading,
    error,
    fetchProducts,
    fetchProduct,
  }
}
