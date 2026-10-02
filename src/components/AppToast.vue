<script setup>
import { useToast } from '@/composables/useToast'

const { message, visible } = useToast()
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="toast">
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2000;
  padding: 14px 18px;
  border-radius: 12px;
  color: #fff;
  background: var(--color-text);
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.18);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
