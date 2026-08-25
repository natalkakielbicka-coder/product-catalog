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
    <p>{{ description }}</p>
  </div>
</template>
