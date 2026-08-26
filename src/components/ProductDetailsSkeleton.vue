<template>
  <div class="product-skeleton">
    <div class="product-skeleton__gallery skeleton"></div>

    <div class="product-skeleton__content">
      <div class="product-skeleton__category skeleton"></div>

      <div class="product-skeleton__meta skeleton"></div>

      <div class="product-skeleton__title skeleton"></div>
      <div class="product-skeleton__title product-skeleton__title--short skeleton"></div>

      <div class="product-skeleton__description skeleton"></div>
      <div class="product-skeleton__description skeleton"></div>
      <div
        class="product-skeleton__description product-skeleton__description--short skeleton"
      ></div>

      <div class="product-skeleton__price skeleton"></div>

      <div class="product-skeleton__actions">
        <div class="product-skeleton__quantity skeleton"></div>
        <div class="product-skeleton__button skeleton"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-skeleton {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: clamp(48px, 8vw, 110px);
  align-items: center;
}

.product-skeleton__gallery {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 20px;
}

.product-skeleton__category {
  width: 110px;
  height: 28px;
  margin-bottom: 20px;
  border-radius: 999px;
}

.product-skeleton__meta {
  width: 220px;
  height: 14px;
  margin-bottom: 24px;
  border-radius: 6px;
}

.product-skeleton__title {
  width: 90%;
  height: 48px;
  margin-bottom: 12px;
  border-radius: 8px;
}

.product-skeleton__title--short {
  width: 60%;
  margin-bottom: 30px;
}

.product-skeleton__description {
  width: 100%;
  height: 14px;
  margin-bottom: 10px;
  border-radius: 6px;
}

.product-skeleton__description--short {
  width: 70%;
  margin-bottom: 30px;
}

.product-skeleton__price {
  width: 120px;
  height: 30px;
  margin-bottom: 30px;
  border-radius: 6px;
}

.product-skeleton__actions {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 12px;
}

.product-skeleton__quantity,
.product-skeleton__button {
  height: 52px;
  border-radius: 12px;
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

  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent);

  animation: skeleton-loading 1.3s infinite;
}

@keyframes skeleton-loading {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 767px) {
  .product-skeleton {
    grid-template-columns: 1fr;
  }
}
</style>
