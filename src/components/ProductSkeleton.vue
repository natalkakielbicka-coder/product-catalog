<template>
  <article class="product-skeleton">
    <div class="product-skeleton__image skeleton"></div>

    <div class="product-skeleton__content">
      <div class="product-skeleton__category skeleton"></div>
      <div class="product-skeleton__title skeleton"></div>
      <div class="product-skeleton__title product-skeleton__title--short skeleton"></div>
      <div class="product-skeleton__price skeleton"></div>
    </div>
  </article>
</template>

<style scoped>
.product-skeleton {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.product-skeleton__image {
  width: 100%;
  aspect-ratio: 1 / 1;
}

.product-skeleton__content {
  padding: 18px;
}

.product-skeleton__category {
  width: 34%;
  height: 12px;
  margin-bottom: 16px;
  border-radius: 6px;
}

.product-skeleton__title {
  width: 85%;
  height: 16px;
  margin-bottom: 10px;
  border-radius: 6px;
}

.product-skeleton__title--short {
  width: 55%;
}

.product-skeleton__price {
  width: 30%;
  height: 18px;
  margin-top: 20px;
  border-radius: 6px;
}

.skeleton {
  position: relative;
  overflow: hidden;
  background: var(--color-image-bg);
}

.skeleton::after {
  content: '';

  position: absolute;
  inset: 0;

  transform: translateX(-100%);

  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.65), transparent);

  animation: skeleton-loading 1.4s infinite;
}

@keyframes skeleton-loading {
  100% {
    transform: translateX(100%);
  }
}
</style>
