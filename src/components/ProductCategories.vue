<script setup>
defineProps({
  categories: {
    type: Array,
    required: true,
  },

  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="product-categories">
    <button
      type="button"
      :class="{ active: modelValue === '' }"
      @click="emit('update:modelValue', '')"
    >
      All
    </button>

    <button
      v-for="category in categories"
      :key="category"
      type="button"
      :class="{ active: modelValue === category }"
      @click="emit('update:modelValue', modelValue === category ? '' : category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<style scoped>
.product-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.product-categories button {
  padding: 9px 14px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-muted);
  background: var(--color-surface);
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.product-categories button:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.product-categories button.active {
  color: #fff;
  border-color: var(--color-accent);
  background: var(--color-accent);
}
</style>
