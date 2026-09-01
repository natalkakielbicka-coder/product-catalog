import { useLocalStorage } from '@/composables/useLocalStorage'

const orders = useLocalStorage('orders', [])

export function useOrders() {
  function addOrder(order) {
    orders.value = [order, ...orders.value]
  }

  function getOrderByNumber(number) {
    return orders.value.find((order) => order.number === number)
  }

  function updateOrderStatus(number, status) {
    orders.value = orders.value.map((order) => {
      if (order.number === number) {
        return {
          ...order,
          status,
        }
      }

      return order
    })
  }

  return {
    orders,
    addOrder,
    getOrderByNumber,
    updateOrderStatus,
  }
}
