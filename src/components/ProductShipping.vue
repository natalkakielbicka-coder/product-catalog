<script setup>
defineProps({
  stock: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="product-tab-content">
    <p v-if="stock > 0">This product is currently available and ready for shipping.</p>

    <p v-else>This product is currently out of stock.</p>
  </div>
</template>
