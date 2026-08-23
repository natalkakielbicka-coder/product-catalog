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
  padding: 28px 0;
  border-bottom: 1px solid var(--color-border);
}

.header__logo {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-decoration: none;
}

.header__cart {
  padding: 10px 18px;
  border: 1px solid var(--color-text);
  border-radius: 999px;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.header__cart:hover {
  color: #fff;
  background: var(--color-text);
}
</style>
