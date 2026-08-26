<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/currency'

const props = defineProps({
  minPrice: {
    type: Number,
    required: true,
  },
  maxPrice: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:minPrice', 'update:maxPrice'])

const selectedRangeStyle = computed(() => {
  if (props.limit === 0) {
    return {
      left: '0%',
      right: '0%',
    }
  }

  const minPercent = (props.minPrice / props.limit) * 100
  const maxPercent = (props.maxPrice / props.limit) * 100

  return {
    left: `${minPercent}%`,
    right: `${100 - maxPercent}%`,
  }
})

function updateMinPrice(event) {
  const value = Number(event.target.value)

  emit('update:minPrice', Math.min(value, props.maxPrice))
}

function updateMaxPrice(event) {
  const value = Number(event.target.value)

  emit('update:maxPrice', Math.max(value, props.minPrice))
}
</script>

<template>
  <div class="price-range">
    <div class="price-range__header">
      <span>Price</span>

      <strong>
        {{ formatCurrency(minPrice) }}
        –
        {{ formatCurrency(maxPrice) }}
      </strong>
    </div>

    <div class="price-range__slider">
      <div class="price-range__track"></div>

      <div class="price-range__selected" :style="selectedRangeStyle"></div>

      <input
        class="price-range__input"
        type="range"
        min="0"
        :max="limit"
        step="1"
        :value="minPrice"
        aria-label="Minimum price"
        @input="updateMinPrice"
      />

      <input
        class="price-range__input"
        type="range"
        min="0"
        :max="limit"
        step="1"
        :value="maxPrice"
        aria-label="Maximum price"
        @input="updateMaxPrice"
      />
    </div>
  </div>
</template>

<style scoped>
.price-range {
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  margin-bottom: 24px;
}

.price-range__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.price-range__header span {
  font-size: 14px;
  font-weight: 600;
}

.price-range__header strong {
  color: var(--color-accent);
  font-size: 14px;
}

.price-range__slider {
  position: relative;
  height: 22px;
}

.price-range__track,
.price-range__selected {
  position: absolute;
  top: 50%;
  height: 5px;
  border-radius: 999px;
  transform: translateY(-50%);
}

.price-range__track {
  right: 0;
  left: 0;
  background: var(--color-border);
}

.price-range__selected {
  background: var(--color-accent);
}

.price-range__input {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 22px;
  margin: 0;

  appearance: none;
  background: transparent;

  pointer-events: none;
}

.price-range__input::-webkit-slider-thumb {
  width: 20px;
  height: 20px;

  appearance: none;

  border: 3px solid var(--color-surface);
  border-radius: 50%;

  background: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);

  cursor: grab;
  pointer-events: auto;
}

.price-range__input::-moz-range-thumb {
  width: 16px;
  height: 16px;

  border: 3px solid var(--color-surface);
  border-radius: 50%;

  background: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);

  cursor: grab;
  pointer-events: auto;
}

.price-range__input::-webkit-slider-runnable-track {
  background: transparent;
}

.price-range__input::-moz-range-track {
  background: transparent;
}
</style>
