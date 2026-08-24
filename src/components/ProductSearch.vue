<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'search'])
</script>

<template>
  <form class="product-search" @submit.prevent="emit('search')">
    <input
      type="search"
      :value="modelValue"
      placeholder="Search products..."
      @input="emit('update:modelValue', $event.target.value)"
    />

    <button type="submit">Search</button>
  </form>
</template>

<style scoped>
.product-search {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  margin-bottom: 32px;
}

.product-search input {
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  outline: none;
  transition: border-color 0.2s ease;
}

.product-search input:focus {
  border-color: var(--color-accent);
}

.product-search button {
  padding: 14px 24px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 600;
  cursor: pointer;
}

.product-search button:hover {
  background: var(--color-accent-hover);
}

@media (max-width: 480px) {
  .product-search {
    grid-template-columns: 1fr;
  }
}
</style>
