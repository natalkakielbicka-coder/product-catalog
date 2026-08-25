<script setup>
import { reactive } from 'vue'

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

  console.log('Order:', form)
}
</script>

<template>
  <main class="checkout">
    <div class="checkout__header">
      <p class="checkout__eyebrow">Delivery details</p>
      <h1>Checkout</h1>

      <p class="checkout__intro">Enter your details to complete your order.</p>
    </div>

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
  </main>
</template>

<style scoped>
.checkout {
  width: min(720px, calc(100% - 40px));
  margin: 0 auto;
  padding: 72px 0 96px;
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

@media (max-width: 600px) {
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
}
</style>
