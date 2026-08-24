<script setup>
defineProps({
  currentPage: {
    type: Number,
    required: true,
  },

  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['change-page'])
</script>

<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
      type="button"
      :disabled="currentPage === 1"
      @click="emit('change-page', currentPage - 1)"
    >
      Previous
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      type="button"
      :class="{ active: page === currentPage }"
      @click="emit('change-page', page)"
    >
      {{ page }}
    </button>

    <button
      type="button"
      :disabled="currentPage === totalPages"
      @click="emit('change-page', currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 48px;
}

.pagination button {
  min-width: 42px;
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  color: var(--color-text);
  background: var(--color-surface);
  cursor: pointer;
}

.pagination button:hover:not(:disabled),
.pagination button.active {
  color: #fff;
  border-color: var(--color-accent);
  background: var(--color-accent);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
