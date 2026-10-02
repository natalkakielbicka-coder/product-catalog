<script setup>
import { computed, onMounted, ref, watch, defineAsyncComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ProductReviews from '@/components/ProductReviews.vue'
import ProductGrid from '@/components/ProductGrid.vue'
import ProductDescription from '@/components/ProductDescription.vue'
import ProductShipping from '@/components/ProductShipping.vue'
import ProductDetailsSkeleton from '@/components/ProductDetailsSkeleton.vue'
import ErrorState from '@/components/ErrorState.vue'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/composables/useCart'
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import { useFavorites } from '@/composables/useFavorites'
import { useRecentlyViewed } from '@/composables/useRecentlyViewed'
import { useCompare } from '@/composables/useCompare'
import { formatCurrency } from '@/utils/currency'
const VueEasyLightbox = defineAsyncComponent(() => import('vue-easy-lightbox'))

const route = useRoute()

const relatedSection = ref(null)
const relatedVisible = ref(false)

const { product, variations, loading, error, fetchProduct, fetchProductVariations } = useProducts()
const pageTitle = computed(() => {
  if (!product.value) {
    return 'Product | Product Catalog'
  }

  return `${product.value.title} | Product Catalog`
})
useDocumentTitle(pageTitle)
const { products: relatedSource, fetchProducts: fetchRelatedProducts } = useProducts()
const { cartItems, addToCart } = useCart()
const { isFavorite, toggleFavorite } = useFavorites()
const { isCompared, toggleCompare, compareLimitReached } = useCompare()
const { recentlyViewedIds, addRecentlyViewed } = useRecentlyViewed()

const selectedImage = ref('')
const quantity = ref(1)
const selectedVariation = ref(null)

function setInitialVariation() {
  const variationId = Number(route.query.variation)

  selectedVariation.value =
    variations.value.find((variation) => variation.id === variationId && variation.isInStock) ??
    variations.value.find((variation) => variation.isInStock) ??
    variations.value[0] ??
    null

  selectedImage.value =
    selectedVariation.value?.image || product.value?.images[0] || product.value?.thumbnail || ''
}

onMounted(async () => {
  await fetchProduct(route.params.id)

  if (product.value) {
    await fetchProductVariations(product.value.id)
    setInitialVariation()

    addRecentlyViewed(product.value.id)
  }

  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0]

    if (entry.isIntersecting) {
      await fetchRelatedProducts()

      relatedVisible.value = true

      observer.disconnect()
    }
  })

  if (relatedSection.value) {
    observer.observe(relatedSection.value)
  }
})

const cartQuantity = computed(() => {
  const currentId = selectedVariation.value?.id ?? product.value?.id

  const cartItem = cartItems.value.find((item) => item.id === currentId)

  return cartItem?.quantity ?? 0
})

const remainingStock = computed(() => {
  if (!product.value || !isCurrentProductInStock.value) {
    return 0
  }

  if (selectedVariation.value) {
    return Infinity
  }

  return Math.max(product.value.stock - cartQuantity.value, 0)
})

const isCurrentProductInStock = computed(() => {
  if (!product.value) {
    return false
  }

  if (selectedVariation.value) {
    return selectedVariation.value.isInStock
  }

  return product.value.stock > 0
})

const activeTab = ref('description')

const tabComponents = {
  description: ProductDescription,
  reviews: ProductReviews,
  shipping: ProductShipping,
}

const activeTabComponent = computed(() => {
  return tabComponents[activeTab.value]
})

const activeTabProps = computed(() => {
  if (!product.value) return {}

  if (activeTab.value === 'description') {
    return {
      description: product.value.description,
    }
  }

  if (activeTab.value === 'reviews') {
    return {
      reviews: product.value.reviews,
    }
  }

  if (activeTab.value === 'shipping') {
    return {
      isInStock: isCurrentProductInStock.value,
    }
  }

  return {}
})

function selectImage(image) {
  selectedImage.value = image
}

function selectVariation(variation) {
  if (!variation.isInStock) {
    return
  }

  selectedVariation.value = variation
  quantity.value = 1

  if (variation.image) {
    selectedImage.value = variation.image
  }
}

const lightboxImages = computed(() => {
  if (!product.value) {
    return []
  }

  const images = [...product.value.images]

  if (selectedVariation.value?.image && !images.includes(selectedVariation.value.image)) {
    images.unshift(selectedVariation.value.image)
  }

  return images
})

const lightboxVisible = ref(false)
const lightboxIndex = ref(0)

function openLightbox() {
  const index = lightboxImages.value.indexOf(selectedImage.value)

  lightboxIndex.value = index >= 0 ? index : 0
  lightboxVisible.value = true
}

function closeLightbox() {
  lightboxVisible.value = false
}

function increaseQuantity() {
  if (quantity.value < remainingStock.value) {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function handleAddToCart() {
  if (!product.value || !isCurrentProductInStock.value) {
    return
  }

  if (selectedVariation.value) {
    addToCart(
      {
        ...product.value,
        id: selectedVariation.value.id,
        parentId: product.value.id,
        title: product.value.title,
        variationLabel: selectedVariation.value.label,
        price: selectedVariation.value.price,
        variation: selectedVariation.value,
        thumbnail: selectedVariation.value.image || product.value.thumbnail,
      },
      quantity.value,
    )

    return
  }

  addToCart(product.value, quantity.value)
}

const originalPrice = computed(() => {
  if (!product.value) return 0

  return product.value.price / (1 - product.value.discountPercentage / 100)
})

const currentOriginalPrice = computed(() => {
  if (selectedVariation.value) {
    return selectedVariation.value.regularPrice
  }

  return originalPrice.value
})

const currentDiscountPercentage = computed(() => {
  if (selectedVariation.value) {
    const regularPrice = selectedVariation.value.regularPrice
    const price = selectedVariation.value.price

    if (regularPrice <= 0 || price >= regularPrice) {
      return 0
    }

    return Math.round(((regularPrice - price) / regularPrice) * 100)
  }

  return product.value?.discountPercentage ?? 0
})

const relatedProducts = computed(() => {
  if (!product.value) return []

  return relatedSource.value
    .filter((item) => {
      return item.category === product.value.category && item.id !== product.value.id
    })
    .slice(0, 4)
})

const recentlyViewedProducts = computed(() => {
  if (!product.value) return []

  return recentlyViewedIds.value
    .filter((id) => id !== product.value.id)
    .map((id) => {
      return relatedSource.value.find((item) => item.id === id)
    })
    .filter(Boolean)
    .slice(0, 4)
})

watch(
  () => route.params.id,
  async (newId) => {
    await fetchProduct(newId)
    await fetchProductVariations(product.value.id)
    setInitialVariation()

    if (product.value) {
      quantity.value = 1
      activeTab.value = 'description'
      addRecentlyViewed(product.value.id)
    }
  },
)

watch(
  () => route.query.variation,
  (newVariationId) => {
    if (!variations.value.length) {
      return
    }

    const variationId = Number(newVariationId)

    const variation = variations.value.find((item) => item.id === variationId && item.isInStock)

    if (!variation) {
      return
    }

    selectedVariation.value = variation
    quantity.value = 1

    selectedImage.value =
      variation.image || product.value?.images[0] || product.value?.thumbnail || ''
  },
)
</script>

<template>
  <main>
    <ProductDetailsSkeleton v-if="loading" />

    <ErrorState v-else-if="error" @retry="fetchProduct(route.params.id)" />

    <div v-else-if="product">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <RouterLink to="/">Products</RouterLink>

        <span>/</span>

        <RouterLink
          :to="{
            path: '/',
            query: {
              category: product.category,
            },
          }"
        >
          {{ product.category }}
        </RouterLink>

        <span>/</span>

        <span class="breadcrumbs__current">
          {{ product.title }}
        </span>
      </nav>

      <RouterLink
        class="product-back"
        :to="{
          path: '/',
          query: route.query,
        }"
      >
        ← Back to products
      </RouterLink>

      <div class="product">
        <div
          class="product__gallery"
          :class="{ 'product__gallery--single': product.images.length <= 1 }"
        >
          <div v-if="product.images.length > 1" class="product__thumbnails">
            <button
              v-for="image in product.images"
              :key="image"
              type="button"
              class="product__thumbnail"
              :class="{
                'product__thumbnail--active': selectedImage === image,
              }"
              @click="selectImage(image)"
            >
              <img :src="image" :alt="product.title" />
            </button>
          </div>

          <button class="product__image" type="button" @click="openLightbox">
            <img
              :src="selectedImage || product.images[0] || product.thumbnail"
              :alt="product.title"
            />

            <span class="product__zoom"> View image </span>
          </button>
        </div>

        <div class="product__content">
          <p class="product__category">
            {{ product.category }}
          </p>

          <div class="product__meta">
            <span v-if="product.brand">
              {{ product.brand }}
            </span>

            <span class="product__rating">
              <span class="product__star">★</span>
              {{ product.rating }}
            </span>

            <span
              :class="{
                'product__stock--available': isCurrentProductInStock,
                'product__stock--unavailable': !isCurrentProductInStock,
              }"
            >
              {{ isCurrentProductInStock ? 'In stock' : 'Out of stock' }}
            </span>
          </div>

          <h1>
            {{ product.title }}
          </h1>

          <button
            class="product__favorite"
            type="button"
            :class="{ 'product__favorite--active': isFavorite(product.id) }"
            :aria-label="isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'"
            @click="toggleFavorite(product.id)"
          >
            {{ isFavorite(product.id) ? '♥' : '♡' }}
            {{ isFavorite(product.id) ? 'Saved' : 'Add to favorites' }}
          </button>

          <button
            class="product__compare"
            :class="{ active: isCompared(product.id) }"
            type="button"
            :disabled="compareLimitReached && !isCompared(product.id)"
            @click="toggleCompare(product.id)"
          >
            {{
              isCompared(product.id)
                ? 'Remove from compare'
                : compareLimitReached
                  ? 'Compare limit reached'
                  : 'Compare product'
            }}
          </button>

          <div class="product__description" v-html="product.description"></div>

          <div v-if="variations.length" class="product__variations">
            <button
              v-for="variation in variations"
              :key="variation.id"
              type="button"
              class="product__variation"
              :class="{
                'product__variation--active': selectedVariation?.id === variation.id,
                'product__variation--unavailable': !variation.isInStock,
              }"
              :disabled="!variation.isInStock"
              @click="selectVariation(variation)"
            >
              {{ variation.label }}
            </button>
          </div>

          <div class="product__prices">
            <span class="product__price">
              {{ formatCurrency(selectedVariation?.price ?? product.price) }}
            </span>

            <span v-if="currentDiscountPercentage > 0" class="product__old-price">
              {{ formatCurrency(currentOriginalPrice) }}
            </span>

            <span v-if="currentDiscountPercentage > 0" class="product__discount">
              -{{ currentDiscountPercentage }}%
            </span>
          </div>

          <div class="product__actions">
            <div v-if="remainingStock > 0" class="product__quantity">
              <button type="button" aria-label="Decrease quantity" @click="decreaseQuantity">
                −
              </button>

              <span>{{ quantity }}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                :disabled="quantity >= remainingStock"
                @click="increaseQuantity"
              >
                +
              </button>
            </div>

            <button
              class="product__button"
              type="button"
              :disabled="!isCurrentProductInStock"
              @click="handleAddToCart"
            >
              {{ isCurrentProductInStock ? 'Add to cart' : 'Out of stock' }}
            </button>
          </div>
        </div>
      </div>

      <section class="product-tabs">
        <div class="product-tabs__nav">
          <button
            type="button"
            :class="{ active: activeTab === 'description' }"
            @click="activeTab = 'description'"
          >
            Description
          </button>

          <button
            type="button"
            :class="{ active: activeTab === 'reviews' }"
            @click="activeTab = 'reviews'"
          >
            Reviews
          </button>

          <button
            type="button"
            :class="{ active: activeTab === 'shipping' }"
            @click="activeTab = 'shipping'"
          >
            Shipping
          </button>
        </div>

        <div class="product-tabs__content">
          <KeepAlive>
            <component :is="activeTabComponent" v-bind="activeTabProps" />
          </KeepAlive>
        </div>
      </section>

      <section ref="relatedSection" class="related-products">
        <template v-if="relatedVisible">
          <div class="related-products__header">
            <h2>You may also like</h2>

            <RouterLink
              :to="{
                path: '/',
                query: {
                  category: product.category,
                },
              }"
            >
              View category
            </RouterLink>
          </div>

          <ProductGrid :products="relatedProducts" />
        </template>
      </section>

      <section v-if="relatedVisible && recentlyViewedProducts.length" class="recently-viewed">
        <div class="recently-viewed__header">
          <h2>Recently viewed</h2>
        </div>

        <ProductGrid :products="recentlyViewedProducts" />
      </section>
    </div>
  </main>

  <VueEasyLightbox
    v-if="lightboxVisible"
    :visible="lightboxVisible"
    :imgs="lightboxImages"
    :index="lightboxIndex"
    loop
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

.product__gallery--single {
  grid-template-columns: 1fr;
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

.product__actions {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  margin-top: 30px;
}

.product__actions:has(.product__button:disabled) {
  grid-template-columns: 1fr;
}

.product__quantity {
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
}

.product__quantity button {
  width: 44px;
  height: 52px;
  border: 0;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.product__quantity button:hover {
  background: var(--color-accent-light);
}

.product__quantity span {
  min-width: 38px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
}

.product__button {
  padding: 16px 24px;
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

.product__zoom {
  position: absolute;
  right: 16px;
  bottom: 16px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 9px 14px;

  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 999px;

  color: var(--color-text);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(8px);

  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;

  pointer-events: none;

  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.product__image:hover .product__zoom {
  color: #fff;
  background: var(--color-accent);
  transform: translateY(-2px);
}

.product__button:hover {
  transform: translateY(-2px);
  background: var(--color-accent-hover);
}

.product-back {
  display: inline-flex;
  margin-bottom: 32px;
  color: var(--color-muted);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.product-back:hover {
  color: var(--color-accent);
}

.product__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: 20px;
  color: var(--color-muted);
  font-size: 14px;
}

.product__meta span:not(:last-child) {
  position: relative;
}

.product__stock--available {
  color: #39734d;
}

.product__stock--unavailable {
  color: #a33d4a;
}

.product__rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.product__star {
  color: #f5b301;
  font-size: 16px;
}

.product__quantity button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.product__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.product__prices {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.product__price {
  color: var(--color-text);
  font-size: 28px;
  font-weight: 700;
}

.product__old-price {
  color: var(--color-muted);
  font-size: 17px;
  text-decoration: line-through;
}

.product__discount {
  padding: 5px 8px;
  border-radius: 999px;
  color: var(--color-accent);
  background: var(--color-accent-light);
  font-size: 12px;
  font-weight: 700;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
  color: var(--color-muted);
  font-size: 13px;
}

.breadcrumbs a {
  color: var(--color-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumbs a:hover {
  color: var(--color-accent);
}

.breadcrumbs__current {
  color: var(--color-text);
}

.related-products {
  margin-top: 80px;
  padding-top: 48px;
  border-top: 1px solid var(--color-border);
}

.related-products__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.related-products__header h2 {
  margin: 0;
  font-size: 28px;
}

.related-products__header a {
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.product-tabs {
  margin-top: 80px;
  padding-top: 32px;
  border-top: 1px solid var(--color-border);
}

.product-tabs__nav {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--color-border);
}

.product-tabs__nav button {
  position: relative;
  padding: 14px 18px;

  border: 0;

  color: var(--color-muted);
  background: transparent;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
}

.product-tabs__nav button:hover {
  color: var(--color-accent);
}

.product-tabs__nav button.active {
  color: var(--color-accent);
}

.product-tabs__nav button.active::after {
  content: '';

  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;

  height: 2px;

  background: var(--color-accent);
}

.product-tabs__content {
  min-height: 120px;
}

.product__favorite {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  padding: 10px 14px;

  border: 1px solid var(--color-border);
  border-radius: 999px;

  color: var(--color-text);
  background: var(--color-surface);

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.product__favorite:hover,
.product__favorite--active {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}

.recently-viewed {
  margin-top: 72px;
}

.recently-viewed__header {
  margin-bottom: 24px;
}

.recently-viewed__header h2 {
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 500;
  letter-spacing: -0.04em;
}

.product__compare {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-left: 10px;
  padding: 10px 14px;

  border: 1px solid var(--color-border);
  border-radius: 999px;

  color: var(--color-text);
  background: var(--color-surface);

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.product__compare:hover:not(:disabled) {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-light);

  transform: translateY(-1px);
}

.product__compare.active {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}

.product__compare:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.product__variations {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.product__variation {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  color: var(--color-text);
  background: var(--color-surface);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.product__variation:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-light);
  transform: translateY(-1px);
}

.product__variation--active {
  color: #fff;
  border-color: var(--color-accent);
  background: var(--color-accent);
}

.product__variation--unavailable,
.product__variation:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  text-decoration: line-through;
  transform: none;
}

.product__variation--unavailable:hover,
.product__variation:disabled:hover {
  color: var(--color-text);
  border-color: var(--color-border);
  background: var(--color-surface);
  transform: none;
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

@media (max-width: 480px) {
  .product__actions {
    grid-template-columns: 1fr;
  }

  .product__quantity {
    justify-content: space-between;
  }
}
</style>
