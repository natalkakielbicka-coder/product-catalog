<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
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

const expanded = ref(false)

const VISIBLE_CATEGORIES = 5

const visibleCategories = computed(() => {
  if (expanded.value) {
    return props.categories
  }

  const firstCategories = props.categories.slice(0, VISIBLE_CATEGORIES)

  if (props.modelValue && !firstCategories.includes(props.modelValue)) {
    return [...firstCategories.slice(0, VISIBLE_CATEGORIES - 1), props.modelValue]
  }

  return firstCategories
})

const hiddenCategoriesCount = computed(() => {
  return Math.max(props.categories.length - VISIBLE_CATEGORIES, 0)
})

function selectCategory(category) {
  emit('update:modelValue', props.modelValue === category ? '' : category)
}
</script>

<template>
  <section class="product-categories">
    <div class="product-categories__header">
      <div>
        <span class="product-categories__eyebrow"> Browse products </span>

        <h2>Shop by category</h2>
      </div>

      <button
        v-if="modelValue"
        class="product-categories__clear"
        type="button"
        @click="emit('update:modelValue', '')"
      >
        Clear category
      </button>
    </div>

    <div class="product-categories__grid">
      <button
        class="category-card category-card--all"
        type="button"
        :class="{ active: modelValue === '' }"
        @click="emit('update:modelValue', '')"
      >
        <span>All products</span>
      </button>

      <button
        v-for="category in visibleCategories"
        :key="category"
        class="category-card"
        type="button"
        :class="{ active: modelValue === category }"
        @click="selectCategory(category)"
      >
        <span>
          {{ category }}
        </span>
      </button>
    </div>

    <button
      v-if="hiddenCategoriesCount > 0"
      class="product-categories__toggle"
      type="button"
      @click="expanded = !expanded"
    >
      <template v-if="!expanded">
        Show all categories
        <span>+{{ hiddenCategoriesCount }}</span>
      </template>

      <template v-else>
        Show fewer categories
        <span>↑</span>
      </template>
    </button>
  </section>
</template>

<style scoped>
.product-categories {
  margin-bottom: 38px;
}

.product-categories__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;

  margin-bottom: 18px;
}

.product-categories__eyebrow {
  display: block;

  margin-bottom: 5px;

  color: var(--color-accent);

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-categories h2 {
  margin: 0;

  color: var(--color-text);

  font-size: clamp(22px, 3vw, 28px);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.product-categories__clear {
  padding: 0;

  border: 0;

  color: var(--color-accent);
  background: transparent;

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
}

.product-categories__grid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));

  gap: 10px;
}

.category-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  padding: 12px 14px;

  border: 1px solid var(--color-border);
  border-radius: 14px;

  color: var(--color-text);
  background: var(--color-surface);

  font-size: 13px;
  font-weight: 600;
  text-align: left;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.category-card:hover {
  transform: translateY(-2px);

  border-color: var(--color-accent);

  color: var(--color-accent);
}

.category-card.active {
  border-color: var(--color-accent);

  color: var(--color-accent);
  background: var(--color-accent-light);
}

.product-categories__toggle {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  margin-top: 14px;
  padding: 0;

  border: 0;

  color: var(--color-accent);
  background: transparent;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;
}

.product-categories__toggle span {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 26px;
  height: 22px;
  padding: 0 6px;

  border-radius: 999px;

  background: var(--color-accent-light);

  font-size: 11px;
}

@media (max-width: 767px) {
  .product-categories__header {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .product-categories__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .category-card {
    min-height: 58px;
    padding: 10px;
  }
}
</style>
