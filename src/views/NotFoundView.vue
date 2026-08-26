<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useDocumentTitle } from '@/composables/useDocumentTitle'

const pageTitle = ref('Page not found | Product Catalog')

useDocumentTitle(pageTitle)
</script>

<template>
  <main class="not-found">
    <span class="not-found__code">404</span>

    <h1>Page not found</h1>

    <p>The page you're looking for doesn't exist or may have been moved.</p>

    <RouterLink to="/" class="not-found__button"> Back to products </RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  flex-direction: column;

  width: min(620px, calc(100% - 40px));
  margin: 0 auto;
  padding: 120px 0;

  text-align: center;
}

.not-found__code {
  margin-bottom: 16px;

  color: var(--color-accent);

  font-size: clamp(72px, 14vw, 140px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.06em;
}

.not-found h1 {
  margin: 0 0 16px;

  font-size: clamp(30px, 5vw, 46px);
}

.not-found p {
  max-width: 460px;
  margin: 0 0 30px;

  color: var(--color-muted);

  line-height: 1.7;
}

.not-found__button {
  display: inline-flex;
  padding: 14px 22px;

  border-radius: 12px;

  color: #fff;
  background: var(--color-accent);

  font-weight: 700;
  text-decoration: none;
}

.not-found__button:hover {
  background: var(--color-accent-hover);
}
</style>
