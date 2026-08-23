<script setup>
import { RouterLink } from 'vue-router'
import { useCart } from '@/composables/useCart'

const { cartCount } = useCart()
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="header__logo"> Product Catalog </RouterLink>

    <RouterLink to="/cart" class="header__cart"> Cart ({{ cartCount }}) </RouterLink>
  </header>
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

.header__cart {
  padding: 11px 20px;
  border: 0;
  border-radius: 999px;
  color: var(--color-accent);
  background: var(--color-accent-light);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.header__cart:hover {
  color: #fff;
  background: var(--color-accent);
}
</style>
