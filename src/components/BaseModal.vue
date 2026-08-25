<script setup>
defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-overlay" @click.self="emit('close')">
        <div class="modal">
          <button
            class="modal__close"
            type="button"
            aria-label="Close modal"
            @click="emit('close')"
          >
            ×
          </button>

          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;

  display: grid;
  place-items: center;

  padding: 24px;

  background: rgba(25, 20, 28, 0.45);
}

.modal {
  position: relative;

  width: min(100%, 460px);
  padding: 32px;

  border-radius: 20px;

  background: var(--color-surface);

  box-shadow: 0 24px 70px rgba(30, 20, 32, 0.2);
}

.modal__close {
  position: absolute;
  top: 16px;
  right: 16px;

  width: 36px;
  height: 36px;

  border: 0;
  border-radius: 50%;

  background: var(--color-image-bg);

  font-size: 22px;
  cursor: pointer;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(12px) scale(0.98);
}
</style>
