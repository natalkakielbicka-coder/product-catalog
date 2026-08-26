<script setup>
import { RouterLink } from 'vue-router'
import { useCompare } from '@/composables/useCompare'

const { compareCount, clearCompare } = useCompare()
</script>

<template>
  <Transition name="compare-bar">
    <div v-if="compareCount > 0" class="compare-bar">
      <div class="compare-bar__content">
        <span>
          {{ compareCount }}
          {{ compareCount === 1 ? 'product' : 'products' }}
          selected
        </span>

        <div class="compare-bar__actions">
          <button type="button" @click="clearCompare">Clear</button>

          <RouterLink to="/compare"> Compare ({{ compareCount }}) </RouterLink>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.compare-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;

  padding: 14px 20px;

  border-top: 1px solid var(--color-border);
  background: var(--color-surface);

  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.08);
}

.compare-bar__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  width: min(var(--container), 100%);
  margin: 0 auto;
}

.compare-bar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.compare-bar button {
  padding: 10px 14px;

  border: 0;
  background: transparent;

  color: var(--color-muted);
  font-weight: 600;

  cursor: pointer;
}

.compare-bar a {
  padding: 11px 18px;

  border-radius: 10px;

  color: #fff;
  background: var(--color-accent);

  font-weight: 600;
  text-decoration: none;
}

.compare-bar a:hover {
  background: var(--color-accent-hover);
}

.compare-bar-enter-active,
.compare-bar-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.compare-bar-enter-from,
.compare-bar-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
