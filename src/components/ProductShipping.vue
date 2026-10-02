<script setup>
defineProps({
  isInStock: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <div class="product-tab-content">
    <p v-if="isInStock">This product is currently available and ready for shipping.</p>

    <p v-else>This product is currently out of stock.</p>
  </div>
</template>
