const API_URL = 'https://dummyjson.com'

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`)

  const data = await response.json()

  return data.products
}

export async function getProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`)

  const data = await response.json()

  return data
}
