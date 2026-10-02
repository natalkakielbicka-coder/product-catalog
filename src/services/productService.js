const API_URL = '/wp-json/wc/store/v1/products'

function decodeHtmlEntities(value = '') {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = value

  return textarea.value
}

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
    isInStock: product.is_in_stock ?? false,
    stockQuantity: product.extensions?.product_catalog?.stock_quantity ?? null,
    manageStock: product.extensions?.product_catalog?.manage_stock ?? false,
    backordersAllowed: product.extensions?.product_catalog?.backorders_allowed ?? false,
    reviews: [],
    currency: {
      code: product.prices?.currency_code ?? 'PLN',
      symbol: product.prices?.currency_symbol ?? 'zł',
      minorUnit: product.prices?.currency_minor_unit ?? 2,
      decimalSeparator: product.prices?.currency_decimal_separator ?? ',',
      thousandSeparator: product.prices?.currency_thousand_separator ?? ' ',
      prefix: product.prices?.currency_prefix ?? '',
      suffix: product.prices?.currency_suffix ?? '',
    },
  }
}

function normalizeVariation(variation) {
  return {
    id: variation.id,
    label: decodeHtmlEntities(variation.variation ?? ''),
    price: Number(variation.prices?.price ?? 0) / 100,
    regularPrice: Number(variation.prices?.regular_price ?? 0) / 100,
    salePrice: Number(variation.prices?.sale_price ?? 0) / 100,
    attributes: variation.attributes ?? [],
    isInStock: variation.is_in_stock ?? false,
    stockQuantity: variation.extensions?.product_catalog?.stock_quantity ?? null,
    manageStock: variation.extensions?.product_catalog?.manage_stock ?? false,
    backordersAllowed: variation.extensions?.product_catalog?.backorders_allowed ?? false,
    image: variation.images?.[0]?.src ?? '',
    currency: {
      code: variation.prices?.currency_code ?? 'PLN',
      symbol: variation.prices?.currency_symbol ?? 'zł',
      minorUnit: variation.prices?.currency_minor_unit ?? 2,
      decimalSeparator: variation.prices?.currency_decimal_separator ?? ',',
      thousandSeparator: variation.prices?.currency_thousand_separator ?? ' ',
      prefix: variation.prices?.currency_prefix ?? '',
      suffix: variation.prices?.currency_suffix ?? '',
    },
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
