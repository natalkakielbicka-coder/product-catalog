const API_URL = 'https://api.escuelajs.co/api/v1'

function normalizeProduct(product) {
  const thumbnail = product.images?.find(
    (image) => typeof image === 'string' && image.startsWith('http'),
  )

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,

    category: product.category?.name ?? 'Other',
    categoryId: product.category?.id ?? null,
    categorySlug: product.category?.slug ?? '',

    thumbnail: thumbnail ?? product.category?.image ?? '',
    images: product.images ?? [],
  }
}

function isValidProduct(product) {
  const hasInvalidTitle = product.title?.startsWith('title-')
  const hasInvalidDescription = product.description?.startsWith('desc-')

  const hasValidImage = product.images?.some(
    (image) => typeof image === 'string' && image.startsWith('http'),
  )

  return !hasInvalidTitle && !hasInvalidDescription && hasValidImage
}

export async function getProducts({ offset = 0, limit = 50 } = {}) {
  const response = await fetch(`${API_URL}/products?offset=${offset}&limit=${limit}`)

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  const data = await response.json()

  return data.filter(isValidProduct).map(normalizeProduct)
}

export async function getProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  const data = await response.json()

  return normalizeProduct(data)
}
