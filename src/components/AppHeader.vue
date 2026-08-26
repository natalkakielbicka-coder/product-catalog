<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useFavorites } from '@/composables/useFavorites'
import MiniCart from '@/components/MiniCart.vue'

const { cartCount } = useCart()
const { favoritesCount } = useFavorites()
const miniCartOpen = ref(false)

watch(miniCartOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="header__logo"> Product Catalog </RouterLink>

    <div class="header__actions">
      <RouterLink to="/favorites" class="header-favorites">
        ♥ Favorites ({{ favoritesCount }})
      </RouterLink>

      <button class="header-cart" type="button" @click="miniCartOpen = true">
        Cart ({{ cartCount }})
      </button>
    </div>
  </header>

  <Transition name="mini-cart">
    <MiniCart v-if="miniCartOpen" @close="miniCartOpen = false" />
  </Transition>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(var(--container), calc(100% - 40px));
  margin: 0 auto;
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border);
}

.header__logo {
  color: var(--color-text);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-decoration: none;
}

.header-cart {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 10px 16px;

  border: 0;
  border-radius: 999px;

  color: var(--color-accent);
  background: var(--color-accent-light);

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.header-cart:hover {
  color: #fff;
  background: var(--color-accent);
  transform: translateY(-1px);
}

.mini-cart-enter-active,
.mini-cart-leave-active {
  transition: opacity 0.25s ease;
}

.mini-cart-enter-active :deep(.mini-cart),
.mini-cart-leave-active :deep(.mini-cart) {
  transition: transform 0.3s ease;
}

.mini-cart-enter-from,
.mini-cart-leave-to {
  opacity: 0;
}

.mini-cart-enter-from :deep(.mini-cart),
.mini-cart-leave-to :deep(.mini-cart) {
  transform: translateX(100%);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-favorites {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 10px 16px;

  border: 1px solid var(--color-border);
  border-radius: 999px;

  color: var(--color-accent);
  background: var(--color-surface);

  font-size: 14px;
  font-weight: 700;
  text-decoration: none;

  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.header-favorites:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}
</style>
