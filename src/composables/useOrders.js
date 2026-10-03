import { useLocalStorage } from '@/composables/useLocalStorage'
import { getOrderStatus } from '@/services/orderService'

const orders = useLocalStorage('orders', [])

export function useOrders() {
  function addOrder(order) {
    orders.value = [order, ...orders.value]
  }

  function getOrderByNumber(number) {
    return orders.value.find((order) => order.number === number)
  }

  function updateOrderStatus(number, status, statusName) {
    orders.value = orders.value.map((order) => {
      if (order.number !== number) {
        return order
      }

      return {
        ...order,
        status,
        statusName,
      }
    })
  }

  async function refreshOrderStatus(order) {
    if (!order?.id || !order?.orderKey) {
      return null
    }

    const data = await getOrderStatus(order.id, order.orderKey)

    updateOrderStatus(order.number, data.status, data.statusName)

    return data
  }

  async function refreshOrderStatuses() {
    const refreshableOrders = orders.value.filter((order) => order.id && order.orderKey)

    return Promise.allSettled(refreshableOrders.map((order) => refreshOrderStatus(order)))
  }

  return {
    orders,
    addOrder,
    getOrderByNumber,
    updateOrderStatus,
    refreshOrderStatus,
    refreshOrderStatuses,
  }
}
