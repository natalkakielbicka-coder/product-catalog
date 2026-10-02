import { ref } from 'vue'

const message = ref('')
const visible = ref(false)

let timeoutId

export function useToast() {
  function showToast(text) {
    message.value = text
    visible.value = true

    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      visible.value = false
    }, 2500)
  }

  return {
    message,
    visible,
    showToast,
  }
}
