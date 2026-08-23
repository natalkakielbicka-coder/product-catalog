const API_URL = 'https://dummyjson.com'

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`)

  const data = await response.json()

  return data.products
}
