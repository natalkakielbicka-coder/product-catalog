<script setup>
defineProps({
  description: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="product-tab-content">
    <div v-html="description"></div>
  </div>
</template>
