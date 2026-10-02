const ORDERS_API_URL = '/wp-json/product-catalog/v1/orders'

export async function createOrder(orderData) {
  const response = await fetch(ORDERS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create order')
  }

  return data
}
