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
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  padding: 20px 0;
}

.header__logo,
.header__cart {
  color: inherit;
  text-decoration: none;
}

.header__logo {
  font-size: 20px;
  font-weight: 700;
}

.header__cart {
  font-weight: 600;
}
</style>
