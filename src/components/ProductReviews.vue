<script setup>
defineProps({
  reviews: {
    type: Array,
    required: true,
  },
})

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}
</script>

<template>
  <section class="reviews">
    <div class="reviews__header">
      <h2>Customer reviews</h2>

      <span>
        {{ reviews.length }}
        {{ reviews.length === 1 ? 'review' : 'reviews' }}
      </span>
    </div>

    <p v-if="reviews.length === 0" class="reviews__empty">No reviews yet.</p>

    <div v-else class="reviews__list">
      <article
        v-for="review in reviews"
        :key="`${review.reviewerEmail}-${review.date}`"
        class="review"
      >
        <div class="review__top">
          <div>
            <strong>{{ review.reviewerName }}</strong>

            <p class="review__date">
              {{ formatDate(review.date) }}
            </p>
          </div>

          <div class="review__rating">
            <span v-for="star in 5" :key="star" :class="{ active: star <= review.rating }">
              ★
            </span>
          </div>
        </div>

        <p class="review__comment">
          {{ review.comment }}
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.reviews__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.reviews__header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.reviews__header > span {
  color: var(--color-muted);
  font-size: 14px;
}

.reviews__list {
  display: grid;
  gap: 16px;
}

.review {
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-surface);
}

.review__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.review__top strong {
  font-size: 14px;
}

.review__date {
  margin: 5px 0 0;
  color: var(--color-muted);
  font-size: 12px;
}

.review__rating {
  display: flex;
  gap: 2px;
}

.review__rating span {
  color: var(--color-border);
}

.review__rating span.active {
  color: #f5b301;
}

.review__comment {
  margin: 18px 0 0;
  color: var(--color-muted);
  line-height: 1.6;
}

.reviews__empty {
  color: var(--color-muted);
}
</style>
