const API_URL = 'https://dummyjson.com/products'

function normalizeProduct(product) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    categoryId: null,
    categorySlug: product.category,
    thumbnail: product.thumbnail,
    images: product.images ?? [],
  }
}

export async function getProducts() {
  const response = await fetch(`${API_URL}?limit=0`)

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  const data = await response.json()

  return data.products.map(normalizeProduct)
}

export async function getProduct(id) {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  const data = await response.json()

  return normalizeProduct(data)
}
