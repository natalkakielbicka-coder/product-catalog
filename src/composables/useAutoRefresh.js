import { onMounted, onUnmounted } from 'vue'

export function useAutoRefresh(callback, interval = 30000) {
  let refreshInterval

  function handleWindowFocus() {
    callback()
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      callback()
    }
  }

  onMounted(() => {
    callback()

    window.addEventListener('focus', handleWindowFocus)

    document.addEventListener('visibilitychange', handleVisibilityChange)

    refreshInterval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        callback()
      }
    }, interval)
  })

  onUnmounted(() => {
    window.removeEventListener('focus', handleWindowFocus)

    document.removeEventListener('visibilitychange', handleVisibilityChange)

    window.clearInterval(refreshInterval)
  })
}
