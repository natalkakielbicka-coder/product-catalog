const API_URL = '/wp-json/wc/store/v1/products'

function normalizeProduct(product) {
  const price = Number(product.prices?.price ?? 0)
  const regularPrice = Number(product.prices?.regular_price ?? price)
  const salePrice = Number(product.prices?.sale_price ?? price)

  const discountPercentage =
    regularPrice > 0 && salePrice < regularPrice
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : 0

  return {
    id: product.id,
    title: product.name,
    description: product.description,
    price: price / 100,
    discountPercentage,
    category: product.categories?.[0]?.name ?? '',
    categoryId: product.categories?.[0]?.id ?? null,
    categorySlug: product.categories?.[0]?.slug ?? '',
    thumbnail: product.images?.[0]?.src ?? '',
    images: product.images?.map((image) => image.src) ?? [],
    brand: '',
    rating: product.average_rating ? Number(product.average_rating) : 0,
    stock: product.is_in_stock ? 1 : 0,
    reviews: [],
  }
}

function normalizeVariation(variation) {
  return {
    id: variation.id,
    label: variation.variation ?? '',
    price: Number(variation.prices?.price ?? 0) / 100,
    regularPrice: Number(variation.prices?.regular_price ?? 0) / 100,
    salePrice: Number(variation.prices?.sale_price ?? 0) / 100,
    attributes: variation.attributes ?? [],
    stock: variation.is_in_stock ? 1 : 0,
    image: variation.images?.[0]?.src ?? '',
  }
}

export async function getProducts() {
  const response = await fetch(`${API_URL}?per_page=100`)

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  const data = await response.json()

  return data.map(normalizeProduct)
}

export async function getProductVariations(productId) {
  const url = `${API_URL}?type=variation&parent=${productId}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch product variations')
  }

  const data = await response.json()
  return data.map(normalizeVariation)
}

export async function getProduct(id) {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  const data = await response.json()

  return normalizeProduct(data)
}
