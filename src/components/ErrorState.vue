<script setup>
defineProps({
  message: {
    type: String,
    default: 'Something went wrong.',
  },
  buttonLabel: {
    type: String,
    default: 'Try again',
  },
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="error-state">
    <p>{{ message }}</p>

    <button type="button" @click="emit('retry')">
      {{ buttonLabel }}
    </button>
  </div>
</template>

<style scoped>
.error-state {
  padding: 64px 24px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  text-align: center;
}

.error-state p {
  margin: 0 0 16px;
  color: var(--color-muted);
  font-size: 18px;
}

.error-state button {
  padding: 12px 18px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 600;
  cursor: pointer;
}

.error-state button:hover {
  background: var(--color-accent-hover);
}
</style>
