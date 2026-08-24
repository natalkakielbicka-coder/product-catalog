<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="product-sort">
    <label for="product-sort">Sort by</label>

    <select
      id="product-sort"
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option value="">Default</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
      <option value="name-asc">Name: A–Z</option>
      <option value="name-desc">Name: Z–A</option>
    </select>
  </div>
</template>

<style scoped>
.product-sort {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-sort label {
  color: var(--color-muted);
  font-size: 14px;
}

.product-sort select {
  padding: 10px 36px 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  color: var(--color-text);
  background: var(--color-surface);
  cursor: pointer;
  outline: none;
}

.product-sort select:focus {
  border-color: var(--color-accent);
}
</style>
