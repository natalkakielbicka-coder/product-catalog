<script setup>
import { computed } from 'vue'

const props = defineProps({
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

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }

  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, '...', current - 1, current, current + 1, '...', total]
})
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

    <template v-for="(page, index) in visiblePages" :key="`${page}-${index}`">
      <span v-if="page === '...'" class="pagination__dots"> ... </span>

      <button
        v-else
        type="button"
        :class="{ active: page === currentPage }"
        @click="emit('change-page', page)"
      >
        {{ page }}
      </button>
    </template>

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

.pagination__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 42px;
  color: var(--color-muted);
}
</style>
