<script setup>
import { reactive, ref, computed } from 'vue'
import { useCart } from '@/composables/useCart'
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import { formatCurrency } from '@/utils/currency'
import { vFocus } from '@/directives/vFocus'

const orderPlaced = ref(false)

const selectedDelivery = ref('standard')

const deliveryMethods = [
  {
    id: 'standard',
    name: 'Standard delivery',
    description: '3–5 business days',
    price: 6.99,
  },
  {
    id: 'express',
    name: 'Express delivery',
    description: '1–2 business days',
    price: 14.99,
  },
]

const FREE_DELIVERY_THRESHOLD = 100

const selectedPayment = ref('card')

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit / debit card',
    description: 'Visa, Mastercard',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
  },
  {
    id: 'cash',
    name: 'Cash on delivery',
    description: 'Pay when your order arrives',
    price: 4.99,
  },
]

const CASH_ON_DELIVERY_FEE = 4.99

const paymentFee = computed(() => {
  if (selectedPayment.value === 'cash') {
    return CASH_ON_DELIVERY_FEE
  }

  return 0
})

function formatCardNumber(event) {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 16)

  form.cardNumber = digits.match(/.{1,4}/g)?.join(' ') ?? ''

  errors.cardNumber = ''
}

function formatCardExpiry(event) {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 4)

  if (digits.length <= 2) {
    form.cardExpiry = digits
    return
  }

  form.cardExpiry = `${digits.slice(0, 2)}/${digits.slice(2)}`

  errors.cardExpiry = ''
}

function formatCardCvc(event) {
  form.cardCvc = event.target.value.replace(/\D/g, '').slice(0, 4)

  errors.cardCvc = ''
}

const pageTitle = ref('Checkout | Product Catalog')

useDocumentTitle(pageTitle)

const form = reactive({
  name: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
})

const errors = reactive({
  name: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
})

const { cartItems, cartTotal, clearCart } = useCart()

const selectedDeliveryMethod = computed(() => {
  return deliveryMethods.find((method) => method.id === selectedDelivery.value)
})

const deliveryCost = computed(() => {
  if (selectedDelivery.value === 'standard' && cartTotal.value >= FREE_DELIVERY_THRESHOLD) {
    return 0
  }

  return selectedDeliveryMethod.value?.price ?? 0
})

const orderTotal = computed(() => {
  return cartTotal.value + deliveryCost.value + paymentFee.value
})

function validateForm() {
  errors.name = ''
  errors.email = ''
  errors.address = ''
  errors.city = ''
  errors.postalCode = ''
  errors.cardNumber = ''
  errors.cardExpiry = ''
  errors.cardCvc = ''

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

  if (selectedPayment.value === 'card') {
    const cardNumber = form.cardNumber.replace(/\s/g, '')

    if (!/^\d{16}$/.test(cardNumber)) {
      errors.cardNumber = 'Enter a valid 16-digit card number.'
    }

    const expiryMatch = form.cardExpiry.match(/^(\d{2})\/(\d{2})$/)

    if (!expiryMatch) {
      errors.cardExpiry = 'Use format MM/YY.'
    } else {
      const month = Number(expiryMatch[1])
      const year = Number(expiryMatch[2])

      if (month < 1 || month > 12) {
        errors.cardExpiry = 'Enter a valid month.'
      } else {
        const now = new Date()

        const currentMonth = now.getMonth() + 1
        const currentYear = now.getFullYear() % 100

        const cardExpired = year < currentYear || (year === currentYear && month < currentMonth)

        if (cardExpired) {
          errors.cardExpiry = 'This card has expired.'
        }
      }
    }

    if (!/^\d{3,4}$/.test(form.cardCvc)) {
      errors.cardCvc = 'Enter a valid CVC.'
    }
  }

  return (
    errors.name === '' &&
    errors.email === '' &&
    errors.address === '' &&
    errors.city === '' &&
    errors.postalCode === '' &&
    errors.cardNumber === '' &&
    errors.cardExpiry === '' &&
    errors.cardCvc === ''
  )
}

function submitForm() {
  const isValid = validateForm()

  if (!isValid) return

  if (cartItems.value.length === 0) return

  orderPlaced.value = true
  clearCart()
}
</script>

<template>
  <main class="checkout">
    <div class="checkout__header">
      <p class="checkout__eyebrow">Delivery details</p>
      <h1>Checkout</h1>

      <p v-if="cartItems.length > 0 && !orderPlaced" class="checkout__intro">
        Enter your details to complete your order.
      </p>
    </div>

    <div v-if="cartItems.length === 0 && !orderPlaced" class="checkout-empty">
      <div class="checkout-empty__icon">🛍</div>

      <h2>Your cart is empty</h2>

      <p>
        Looks like you haven't added anything to your cart yet. Browse our products and find
        something you like.
      </p>

      <RouterLink class="checkout-empty__button" to="/"> Continue shopping </RouterLink>
    </div>

    <div v-else-if="orderPlaced" class="order-success">
      <div class="order-success__icon">✓</div>

      <h2>Thank you for your order!</h2>

      <p>Your order has been placed successfully.</p>

      <RouterLink to="/" class="order-success__button"> Continue shopping </RouterLink>
    </div>

    <div v-else class="checkout__layout">
      <form class="checkout-form" novalidate @submit.prevent="submitForm">
        <div class="checkout-form__grid">
          <label class="checkout-form__field checkout-form__field--full">
            <span>Name</span>

            <input
              v-model="form.name"
              v-focus
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

        <div class="checkout-section">
          <div class="checkout-section__header">
            <h2>Delivery method</h2>

            <span v-if="cartTotal < FREE_DELIVERY_THRESHOLD">
              Spend
              {{ formatCurrency(FREE_DELIVERY_THRESHOLD - cartTotal) }}
              more for free standard delivery
            </span>

            <span v-else> Free standard delivery available </span>
          </div>

          <div class="delivery-methods">
            <label
              v-for="method in deliveryMethods"
              :key="method.id"
              class="delivery-method"
              :class="{
                active: selectedDelivery === method.id,
              }"
            >
              <input v-model="selectedDelivery" type="radio" name="delivery" :value="method.id" />

              <div>
                <strong>{{ method.name }}</strong>

                <span>{{ method.description }}</span>
              </div>

              <strong class="delivery-method__price">
                {{
                  method.id === 'standard' && cartTotal >= FREE_DELIVERY_THRESHOLD
                    ? 'Free'
                    : formatCurrency(method.price)
                }}
              </strong>
            </label>
          </div>
        </div>

        <div class="checkout-section">
          <div class="checkout-section__header">
            <h2>Payment method</h2>
          </div>

          <div class="payment-methods">
            <label
              v-for="method in paymentMethods"
              :key="method.id"
              class="payment-method"
              :class="{ active: selectedPayment === method.id }"
            >
              <input v-model="selectedPayment" type="radio" name="payment" :value="method.id" />

              <div>
                <strong>{{ method.name }}</strong>
                <span>{{ method.description }}</span>
              </div>

              <strong v-if="method.price" class="payment-method__price">
                +{{ formatCurrency(method.price) }}
              </strong>
            </label>
          </div>

          <div v-if="selectedPayment === 'card'" class="card-fields">
            <label class="checkout-form__field checkout-form__field--full">
              <span>Card number</span>

              <input
                :value="form.cardNumber"
                type="text"
                inputmode="numeric"
                autocomplete="cc-number"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
                :class="{ error: errors.cardNumber }"
                @input="formatCardNumber"
              />

              <small v-if="errors.cardNumber" class="form-error">
                {{ errors.cardNumber }}
              </small>
            </label>

            <label class="checkout-form__field">
              <span>Expiry date</span>

              <input
                :value="form.cardExpiry"
                type="text"
                inputmode="numeric"
                autocomplete="cc-exp"
                placeholder="MM/YY"
                maxlength="5"
                :class="{ error: errors.cardExpiry }"
                @input="formatCardExpiry"
              />

              <small v-if="errors.cardExpiry" class="form-error">
                {{ errors.cardExpiry }}
              </small>
            </label>

            <label class="checkout-form__field">
              <span>CVC</span>

              <input
                :value="form.cardCvc"
                type="text"
                inputmode="numeric"
                autocomplete="cc-csc"
                placeholder="123"
                maxlength="4"
                :class="{ error: errors.cardCvc }"
                @input="formatCardCvc"
              />

              <small v-if="errors.cardCvc" class="form-error">
                {{ errors.cardCvc }}
              </small>
            </label>
          </div>
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
            {{ formatCurrency(orderTotal) }}
          </strong>
        </div>

        <div class="order-summary__row">
          <span>Subtotal</span>

          <strong>
            {{ formatCurrency(cartTotal) }}
          </strong>
        </div>

        <div class="order-summary__row">
          <span>Delivery</span>

          <strong>
            {{ deliveryCost === 0 ? 'Free' : formatCurrency(deliveryCost) }}
          </strong>
        </div>

        <div v-if="paymentFee > 0" class="order-summary__row">
          <span>Payment fee</span>

          <strong>
            {{ formatCurrency(paymentFee) }}
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

.order-success {
  display: flex;
  align-items: center;
  flex-direction: column;

  max-width: 680px;
  margin: 0 auto;
  padding: 72px 40px;

  border: 1px solid var(--color-border);
  border-radius: 24px;

  background: var(--color-surface);

  text-align: center;
}

.order-success__icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 72px;
  height: 72px;
  margin-bottom: 24px;

  border-radius: 50%;

  color: #fff;
  background: #39734d;

  font-size: 30px;
  font-weight: 700;
}

.order-success h2 {
  margin: 0 0 12px;
  font-size: clamp(28px, 4vw, 38px);
}

.order-success p {
  margin: 0 0 28px;
  color: var(--color-muted);
}

.order-success__button {
  padding: 14px 22px;
  border-radius: 12px;

  color: #fff;
  background: var(--color-accent);

  font-weight: 700;
  text-decoration: none;
}

.checkout-section {
  margin-top: 32px;
  padding-top: 28px;
  border-top: 1px solid var(--color-border);
}

.checkout-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.checkout-section__header h2 {
  margin: 0;
  font-size: 18px;
}

.checkout-section__header span {
  display: inline-flex;
  align-items: center;

  max-width: none;
  padding: 7px 10px;

  border-radius: 999px;

  color: var(--color-accent);
  background: var(--color-accent-light);

  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;

  white-space: nowrap;
  text-align: left;
}

.delivery-methods {
  display: grid;
  gap: 10px;
}

.delivery-method {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;

  padding: 16px;

  border: 1px solid var(--color-border);
  border-radius: 12px;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.delivery-method:hover {
  border-color: var(--color-accent);
}

.delivery-method.active {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}

.delivery-method input {
  width: auto;
  accent-color: var(--color-accent);
}

.delivery-method > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.delivery-method > div strong {
  font-size: 14px;
}

.delivery-method > div span {
  color: var(--color-muted);
  font-size: 12px;
}

.delivery-method__price {
  font-size: 14px;
}

.order-summary__row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding-top: 16px;
  font-size: 14px;
}

.order-summary__row span {
  color: var(--color-muted);
}

.payment-methods {
  display: grid;
  gap: 10px;
}

.payment-method {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;

  padding: 16px;

  border: 1px solid var(--color-border);
  border-radius: 12px;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.payment-method:hover {
  border-color: var(--color-accent);
}

.payment-method.active {
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}

.payment-method input {
  width: auto;
  accent-color: var(--color-accent);
}

.payment-method > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.payment-method strong {
  font-size: 14px;
}

.payment-method span {
  color: var(--color-muted);
  font-size: 12px;
}

.payment-method__price {
  color: var(--color-accent);
  font-size: 13px;
  white-space: nowrap;
}

.card-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 16px;

  margin-top: 18px;
  padding: 20px;

  border: 1px solid var(--color-border);
  border-radius: 12px;

  background: var(--color-image-bg);
}

@media (max-width: 600px) {
  .card-fields {
    grid-template-columns: 1fr;
  }
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

  .checkout-section__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .checkout-section__header span {
    white-space: normal;
  }
}
</style>
