export function getOrderStatusLabel(status) {
  const statuses = {
    pending: 'Oczekujące na płatność',
    'on-hold': 'Oczekuje na realizację',
    processing: 'W realizacji',
    completed: 'Zrealizowane',
    cancelled: 'Anulowane',
    refunded: 'Zwrócone',
    failed: 'Nieudane',
  }

  return statuses[status] ?? status
}
