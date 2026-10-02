import { useLocalStorage } from '@/composables/useLocalStorage'

const orders = useLocalStorage('orders', [])

export function useOrders() {
  function addOrder(order) {
    orders.value = [order, ...orders.value]
  }

  function getOrderByNumber(number) {
    return orders.value.find((order) => order.number === number)
  }

  return {
    orders,
    addOrder,
    getOrderByNumber,
  }
}
