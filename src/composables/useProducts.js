import { ref } from 'vue'
import { getProducts } from '@/services/productService'

export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchProducts() {
    loading.value = true

    try {
      products.value = await getProducts()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
  }
}
