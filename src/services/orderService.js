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

const COUPON_API_URL = '/wp-json/product-catalog/v1/coupon'

export async function validateCoupon(code, subtotal) {
  const response = await fetch(COUPON_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      subtotal,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Invalid coupon code')
  }

  return data
}

const ORDER_STATUS_API_URL = '/wp-json/product-catalog/v1/order-status'

export async function getOrderStatus(id, orderKey) {
  const response = await fetch(ORDER_STATUS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      orderKey,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch order status')
  }

  return data
}
