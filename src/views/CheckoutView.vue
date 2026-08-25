<script setup>
import { reactive, ref } from 'vue'
import { useCart } from '@/composables/useCart'
import { formatCurrency } from '@/utils/currency'

const orderPlaced = ref(false)

const form = reactive({
  name: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
})

const errors = reactive({
  name: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
})

const { cartItems, cartTotal } = useCart()

function validateForm() {
  errors.name = ''
  errors.email = ''
  errors.address = ''
  errors.city = ''
  errors.postalCode = ''

  if (!form.name.trim()) {
    errors.name = 'Name is required.'
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!form.email.includes('@')) {
    errors.email = 'Enter a valid email address.'
  }

  if (!form.address.trim()) {
    errors.address = 'Address is required.'
  }

  if (!form.city.trim()) {
    errors.city = 'City is required.'
  }

  if (!form.postalCode.trim()) {
    errors.postalCode = 'Postal code is required.'
  } else if (!/^\d{2}-\d{3}$/.test(form.postalCode)) {
    errors.postalCode = 'Use format 00-000.'
  }

  return (
    errors.name === '' &&
    errors.email === '' &&
    errors.address === '' &&
    errors.city === '' &&
    errors.postalCode === ''
  )
}

function submitForm() {
  const isValid = validateForm()

  if (!isValid) return

  if (cartItems.value.length === 0) return

  orderPlaced.value = true
}
</script>

<template>
  <main class="checkout">
    <div class="checkout__header">
      <p class="checkout__eyebrow">Delivery details</p>
      <h1>Checkout</h1>

      <p v-if="cartItems.length > 0" class="checkout__intro">
        Enter your details to complete your order.
      </p>
    </div>

    <div v-if="cartItems.length === 0" class="checkout-empty">
      <div class="checkout-empty__icon">🛍</div>

      <h2>Your cart is empty</h2>

      <p>
        Looks like you haven't added anything to your cart yet. Browse our products and find
        something you like.
      </p>

      <RouterLink class="checkout-empty__button" to="/"> Continue shopping </RouterLink>
    </div>

    <div v-else class="checkout__layout">
      <form class="checkout-form" novalidate @submit.prevent="submitForm">
        <div class="checkout-form__grid">
          <label class="checkout-form__field checkout-form__field--full">
            <span>Name</span>

            <input
              v-model="form.name"
              type="text"
              placeholder="Your name"
              :class="{ error: errors.name }"
              @input="errors.name = ''"
            />

            <small v-if="errors.name" class="form-error">
              {{ errors.name }}
            </small>
          </label>

          <label class="checkout-form__field checkout-form__field--full">
            <span>Email</span>

            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              :class="{ error: errors.email }"
              @input="errors.email = ''"
            />

            <small v-if="errors.email" class="form-error">
              {{ errors.email }}
            </small>
          </label>

          <label class="checkout-form__field checkout-form__field--full">
            <span>Address</span>

            <input
              v-model="form.address"
              type="text"
              placeholder="Street and number"
              :class="{ error: errors.address }"
              @input="errors.address = ''"
            />

            <small v-if="errors.address" class="form-error">
              {{ errors.address }}
            </small>
          </label>

          <label class="checkout-form__field">
            <span>City</span>

            <input
              v-model="form.city"
              type="text"
              placeholder="City"
              :class="{ error: errors.city }"
              @input="errors.city = ''"
            />

            <small v-if="errors.city" class="form-error">
              {{ errors.city }}
            </small>
          </label>

          <label class="checkout-form__field">
            <span>Postal code</span>

            <input
              v-model="form.postalCode"
              type="text"
              placeholder="00-000"
              :class="{ error: errors.postalCode }"
              @input="errors.postalCode = ''"
            />

            <small v-if="errors.postalCode" class="form-error">
              {{ errors.postalCode }}
            </small>
          </label>
        </div>

        <button class="checkout-form__button" type="submit">Place order</button>
      </form>

      <aside class="order-summary">
        <h2>Order summary</h2>

        <div class="order-summary__items">
          <div v-for="item in cartItems" :key="item.id" class="order-summary__item">
            <div>
              <strong>{{ item.title }}</strong>

              <span> {{ item.quantity }} × {{ formatCurrency(item.price) }} </span>
            </div>

            <strong>
              {{ formatCurrency(item.price * item.quantity) }}
            </strong>
          </div>
        </div>

        <div class="order-summary__total">
          <span>Total</span>

          <strong>
            {{ formatCurrency(cartTotal) }}
          </strong>
        </div>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.checkout {
  width: min(1100px, calc(100% - 40px));
  margin: 0 auto;
  padding: 72px 0 96px;
}

.checkout__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 32px;
  align-items: start;
}

.checkout__header {
  margin-bottom: 36px;
}

.checkout__eyebrow {
  margin: 0 0 10px;
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.checkout h1 {
  margin: 0;
  color: var(--color-text);
  font-size: clamp(38px, 6vw, 58px);
  font-weight: 500;
  letter-spacing: -0.04em;
}

.checkout__intro {
  margin: 14px 0 0;
  color: var(--color-muted);
  line-height: 1.6;
}

.checkout-form {
  padding: 32px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-surface);
}

.checkout-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px 16px;
}

.checkout-form__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkout-form__field--full {
  grid-column: 1 / -1;
}

.checkout-form__field > span {
  color: var(--color-text);
  font-size: 13px;
  font-weight: 600;
}

.checkout-form input {
  width: 100%;
  padding: 14px 16px;

  border: 1px solid var(--color-border);
  border-radius: 12px;

  color: var(--color-text);
  background: var(--color-bg);

  font: inherit;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.checkout-form input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-light);
}

.checkout-form input.error {
  border-color: #b94855;
}

.form-error {
  color: #b94855;
  font-size: 12px;
}

.checkout-form__button {
  width: 100%;
  margin-top: 28px;
  padding: 16px 24px;

  border: 0;
  border-radius: 12px;

  color: #fff;
  background: var(--color-accent);

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.checkout-form__button:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.checkout-empty {
  display: flex;
  align-items: center;
  flex-direction: column;

  max-width: 680px;
  margin: 0 auto;
  padding: 72px 40px;

  border: 1px solid var(--color-border);
  border-radius: 24px;

  background: linear-gradient(145deg, var(--color-surface), var(--color-image-bg));

  text-align: center;
}

.checkout-empty__icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 72px;
  height: 72px;
  margin-bottom: 24px;

  border-radius: 50%;

  color: var(--color-accent);
  background: var(--color-accent-light);

  font-size: 30px;
}

.checkout-empty h2 {
  margin: 0 0 12px;

  color: var(--color-text);

  font-size: clamp(28px, 4vw, 38px);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.checkout-empty p {
  max-width: 460px;
  margin: 0 0 28px;

  color: var(--color-muted);

  font-size: 15px;
  line-height: 1.7;
}

.checkout-empty__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 14px 22px;

  border-radius: 12px;

  color: #fff;
  background: var(--color-accent);

  font-size: 14px;
  font-weight: 700;
  text-decoration: none;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.checkout-empty__button:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
}

.order-summary {
  position: sticky;
  top: 24px;
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-surface);
}

.order-summary h2 {
  margin: 0 0 24px;
  font-size: 20px;
}

.order-summary__items {
  display: grid;
}

.order-summary__item {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.order-summary__item > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-summary__item strong {
  font-size: 13px;
}

.order-summary__item span {
  color: var(--color-muted);
  font-size: 12px;
}

.order-summary__total {
  display: flex;
  justify-content: space-between;
  padding-top: 22px;
  font-size: 18px;
}

@media (max-width: 767px) {
  .checkout {
    padding: 48px 0 72px;
  }

  .checkout-form {
    padding: 22px;
  }

  .checkout-form__grid {
    grid-template-columns: 1fr;
  }

  .checkout-form__field--full {
    grid-column: auto;
  }

  .checkout__layout {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}
</style>
