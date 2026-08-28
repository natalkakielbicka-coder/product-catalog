<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },

  products: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'search', 'select'])

const focused = ref(false)
const activeIndex = ref(-1)
const activeRecentIndex = ref(-1)

const recentSearches = useLocalStorage('recent-searches', [])

function saveSearch(query) {
  const value = query.trim()

  if (value.length < 2) {
    return
  }

  recentSearches.value = [
    value,
    ...recentSearches.value.filter((item) => item.toLowerCase() !== value.toLowerCase()),
  ].slice(0, 5)
}

function submitSearch() {
  saveSearch(props.modelValue)

  emit('search')

  focused.value = false
  activeIndex.value = -1
}

const matchingProducts = computed(() => {
  const query = props.modelValue.trim().toLowerCase()

  if (query.length < 2) {
    return []
  }

  return props.products.filter((product) => product.title.toLowerCase().includes(query))
})

const suggestions = computed(() => {
  return matchingProducts.value.slice(0, 5)
})

const showSuggestions = computed(() => {
  return focused.value && props.modelValue.trim().length >= 2
})

const showRecentSearches = computed(() => {
  return focused.value && props.modelValue.trim() === '' && recentSearches.value.length > 0
})

function showAllResults() {
  saveSearch(props.modelValue)

  emit('search')

  focused.value = false
  activeIndex.value = -1
}

function selectRecentSearch(query) {
  emit('update:modelValue', query)
  emit('search')

  focused.value = false
  activeIndex.value = -1
  activeRecentIndex.value = -1
}

function selectSuggestion(product) {
  emit('select', product)

  focused.value = false
  activeIndex.value = -1
}

function handleInput(event) {
  activeIndex.value = -1
  activeRecentIndex.value = -1

  emit('update:modelValue', event.target.value)
}
function handleKeydown(event) {
  if (event.key === 'Escape') {
    focused.value = false
    activeIndex.value = -1
    activeRecentIndex.value = -1
    return
  }

  if (showRecentSearches.value) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()

      activeRecentIndex.value++

      if (activeRecentIndex.value >= recentSearches.value.length) {
        activeRecentIndex.value = 0
      }
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()

      activeRecentIndex.value--

      if (activeRecentIndex.value < 0) {
        activeRecentIndex.value = recentSearches.value.length - 1
      }
    }

    if (event.key === 'Enter' && activeRecentIndex.value >= 0) {
      event.preventDefault()

      selectRecentSearch(recentSearches.value[activeRecentIndex.value])
    }

    return
  }

  if (suggestions.value.length === 0) {
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()

    activeIndex.value++

    if (activeIndex.value >= suggestions.value.length) {
      activeIndex.value = 0
    }
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()

    activeIndex.value--

    if (activeIndex.value < 0) {
      activeIndex.value = suggestions.value.length - 1
    }
  }

  if (event.key === 'Enter' && activeIndex.value >= 0) {
    event.preventDefault()

    selectSuggestion(suggestions.value[activeIndex.value])
  }
}

function highlightMatch(title) {
  const query = props.modelValue.trim()

  if (!query) {
    return title
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const regex = new RegExp(`(${escapedQuery})`, 'gi')

  return title.replace(regex, '<mark>$1</mark>')
}

const searchWrapper = ref(null)

function handleClickOutside(event) {
  if (!searchWrapper.value) {
    return
  }

  if (!searchWrapper.value.contains(event.target)) {
    focused.value = false
    activeIndex.value = -1
    activeRecentIndex.value = -1
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div ref="searchWrapper" class="product-search-wrapper">
    <form class="product-search" @submit.prevent="submitSearch">
      <input
        type="search"
        :value="modelValue"
        placeholder="Search products..."
        autocomplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-controls="product-search-suggestions"
        :aria-expanded="showSuggestions || showRecentSearches"
        :aria-activedescendant="
          activeIndex >= 0
            ? `search-suggestion-${suggestions[activeIndex]?.id}`
            : activeRecentIndex >= 0
              ? `recent-search-${activeRecentIndex}`
              : undefined
        "
        @focus="focused = true"
        @blur="focused = false"
        @input="handleInput"
        @keydown="handleKeydown"
      />

      <button type="submit">Search</button>
    </form>

    <div
      v-if="showSuggestions"
      id="product-search-suggestions"
      class="search-suggestions"
      role="listbox"
    >
      <button
        v-for="(product, index) in suggestions"
        :id="`search-suggestion-${product.id}`"
        :key="product.id"
        class="search-suggestion"
        :class="{ active: activeIndex === index }"
        type="button"
        role="option"
        :aria-selected="activeIndex === index"
        @mousedown.prevent="selectSuggestion(product)"
        @mouseenter="activeIndex = index"
      >
        <img :src="product.thumbnail" :alt="product.title" />

        <span class="search-suggestion__content">
          <strong>
            <strong v-html="highlightMatch(product.title)"></strong>
          </strong>

          <small>
            {{ product.category }}
          </small>
        </span>
      </button>

      <div v-if="matchingProducts.length === 0" class="search-suggestions__empty">
        No products found for
        <strong>"{{ modelValue }}"</strong>
      </div>

      <button
        v-if="matchingProducts.length > 0"
        class="search-suggestions__all"
        type="button"
        @mousedown.prevent="showAllResults"
      >
        See all {{ matchingProducts.length }}
        {{ matchingProducts.length === 1 ? 'result' : 'results' }}
        →
      </button>
    </div>

    <div v-if="showRecentSearches" class="search-suggestions recent-searches">
      <div class="recent-searches__header">
        <span>Recent searches</span>

        <button type="button" @mousedown.prevent="recentSearches = []">Clear</button>
      </div>

      <button
        v-for="(query, index) in recentSearches"
        :id="`recent-search-${index}`"
        :key="query"
        class="recent-search"
        :class="{ active: activeRecentIndex === index }"
        type="button"
        @mouseenter="activeRecentIndex = index"
        @mousedown.prevent="selectRecentSearch(query)"
      >
        <span>↻</span>

        {{ query }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-search-wrapper {
  position: relative;

  margin-bottom: 32px;
}

.product-search {
  display: grid;

  grid-template-columns: 1fr auto;

  gap: 10px;
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

.search-suggestions {
  position: absolute;
  z-index: 20;
  top: calc(100% + 8px);
  left: 0;

  width: calc(100% - 100px);
  max-height: 380px;

  overflow-y: auto;

  padding: 8px;

  border: 1px solid var(--color-border);
  border-radius: 14px;

  background: var(--color-surface);

  box-shadow: 0 18px 50px rgba(33, 28, 36, 0.12);
}

.search-suggestion {
  display: grid;

  grid-template-columns: 50px 1fr;

  align-items: center;

  width: 100%;

  gap: 12px;
  padding: 8px;

  border: 0;
  border-radius: 10px;

  color: var(--color-text);
  background: transparent;

  text-align: left;

  cursor: pointer;
}

.search-suggestion:hover,
.search-suggestion.active {
  background: var(--color-accent-light);
}

.search-suggestion img {
  width: 50px;
  height: 50px;

  border-radius: 9px;

  object-fit: contain;

  background: var(--color-image-bg);
}

.search-suggestion__content {
  display: flex;

  flex-direction: column;

  gap: 4px;

  min-width: 0;
}

.search-suggestion__content strong {
  overflow: hidden;

  font-size: 13px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-suggestion__content small {
  color: var(--color-muted);

  font-size: 11px;
}

.search-suggestions__empty {
  padding: 18px 14px;

  color: var(--color-muted);

  font-size: 13px;
  text-align: center;
}

.search-suggestions__empty strong {
  color: var(--color-text);
}

.search-suggestions__all {
  width: 100%;
  margin-top: 6px;
  padding: 12px;

  border: 0;
  border-top: 1px solid var(--color-border);

  color: var(--color-accent);
  background: transparent;

  font-size: 12px;
  font-weight: 700;
  text-align: left;

  cursor: pointer;
}

.search-suggestions__all:hover {
  background: var(--color-accent-light);
}

.recent-searches__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 8px 10px 10px;
}

.recent-searches__header span {
  color: var(--color-muted);

  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.recent-searches__header button {
  padding: 0;

  border: 0;

  color: var(--color-accent);
  background: transparent;

  font-size: 11px;
  font-weight: 600;

  cursor: pointer;
}

.recent-search {
  display: flex;
  align-items: center;
  gap: 9px;

  width: 100%;

  padding: 10px;

  border: 0;
  border-radius: 9px;

  color: var(--color-text);
  background: transparent;

  font-size: 13px;
  text-align: left;

  cursor: pointer;
}

.recent-search:hover,
.recent-search.active {
  background: var(--color-accent-light);
}

.recent-search span {
  color: var(--color-muted);
}

.search-suggestion__content strong :deep(mark) {
  padding: 0;

  color: var(--color-accent);
  background: transparent;

  font-weight: 700;
}

@media (max-width: 479px) {
  .product-search {
    grid-template-columns: 1fr;
  }

  .search-suggestions {
    width: 100%;
  }
}
</style>
