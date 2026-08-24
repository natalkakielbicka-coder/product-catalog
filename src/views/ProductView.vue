<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/composables/useCart'
import { formatCurrency } from '@/utils/currency'
import VueEasyLightbox from 'vue-easy-lightbox'

const route = useRoute()

const { product, loading, error, fetchProduct } = useProducts()
const { addToCart } = useCart()

const selectedImage = ref('')

onMounted(async () => {
  await fetchProduct(route.params.id)

  if (product.value) {
    selectedImage.value = product.value.thumbnail
  }
})

function selectImage(image) {
  selectedImage.value = image
}

const lightboxVisible = ref(false)
const lightboxIndex = ref(0)

function openLightbox() {
  const index = product.value.images.indexOf(selectedImage.value)

  lightboxIndex.value = index >= 0 ? index : 0
  lightboxVisible.value = true
}

function closeLightbox() {
  lightboxVisible.value = false
}
</script>

<template>
  <main>
    <p v-if="loading">Loading product...</p>

    <p v-else-if="error">Something went wrong.</p>

    <div v-else-if="product" class="product">
      <div class="product__gallery">
        <div v-if="product.images.length > 1" class="product__thumbnails">
          <button
            v-for="image in product.images"
            :key="image"
            type="button"
            class="product__thumbnail"
            :class="{ 'product__thumbnail--active': selectedImage === image }"
            @click="selectImage(image)"
          >
            <img :src="image" :alt="product.title" />
          </button>
        </div>

        <button class="product__image" type="button" @click="openLightbox">
          <img :src="selectedImage || product.thumbnail" :alt="product.title" />
        </button>
      </div>

      <div class="product__content">
        <p class="product__category">
          {{ product.category }}
        </p>

        <h1>{{ product.title }}</h1>

        <p class="product__description">
          {{ product.description }}
        </p>

        <p class="product__price">{{ formatCurrency(product.price) }}</p>

        <button class="product__button" @click="addToCart(product)">Add to cart</button>
      </div>
    </div>
  </main>

  <VueEasyLightbox
    :visible="lightboxVisible"
    :imgs="product?.images || []"
    :index="lightboxIndex"
    @hide="closeLightbox"
  />
</template>

<style scoped>
main {
  width: min(var(--container), calc(100% - 40px));
  margin: 0 auto;
  padding: 72px 0 96px;
}

.product {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: clamp(48px, 8vw, 110px);
  align-items: center;
}

.product__image {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 20px;
  background: var(--color-image-bg);
  cursor: zoom-in;
}

.product__image img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.product__image:hover img {
  transform: scale(1.03);
}

.product__gallery {
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr);
  gap: 16px;
}

.product__thumbnails {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product__thumbnail {
  width: 80px;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  cursor: pointer;
  opacity: 0.75;
  transition:
    opacity 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.product__thumbnail:hover {
  opacity: 1;
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.product__thumbnail--active {
  opacity: 1;
  border-color: var(--color-accent);
}

.product__thumbnail img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.product__category {
  display: inline-block;
  margin: 0 0 18px;
  padding: 7px 12px;
  border-radius: 999px;
  color: var(--color-accent);
  background: var(--color-accent-light);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.product__content h1 {
  margin: 0 0 24px;
  font-size: clamp(38px, 5vw, 62px);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: -0.055em;
}

.product__description {
  max-width: 520px;
  margin: 0 0 30px;
  color: var(--color-muted);
  font-size: 16px;
  line-height: 1.75;
}

.product__price {
  margin: 0;
  color: var(--color-text);
  font-size: 28px;
  font-weight: 700;
}

.product__button {
  width: 100%;
  margin-top: 30px;
  padding: 17px 24px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  background: var(--color-accent);
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.product__button:hover {
  transform: translateY(-2px);
  background: var(--color-accent-hover);
}

@media (max-width: 767px) {
  .product {
    grid-template-columns: 1fr;
  }

  .product__gallery {
    grid-template-columns: 1fr;
  }

  .product__thumbnails {
    order: 2;
    flex-direction: row;
    overflow-x: auto;
  }

  .product__thumbnail {
    flex: 0 0 72px;
    width: 72px;
  }
}
</style>
