export function getOrderStatusClass(status) {
  return {
    'order-status--pending': status === 'pending',
    'order-status--on-hold': status === 'on-hold',
    'order-status--processing': status === 'processing',
    'order-status--completed': status === 'completed',
    'order-status--cancelled': status === 'cancelled',
    'order-status--refunded': status === 'refunded',
    'order-status--failed': status === 'failed',
  }
}
