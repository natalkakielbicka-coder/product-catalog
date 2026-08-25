import { watchEffect } from 'vue'

export function useDocumentTitle(title) {
  watchEffect(() => {
    document.title = title.value
  })
}
