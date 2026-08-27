<script setup>
import { reactive, ref, computed } from 'vue'
import { useCart } from '@/composables/useCart'
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import { formatCurrency } from '@/utils/currency'
import { vFocus } from '@/directives/vFocus'

const orderPlaced = ref(false)
const placedOrder = ref(null)
const currentStep = ref(1)

const couponInput = ref('')
const appliedCoupon = ref(null)
const couponError = ref('')

const coupons = {
  SAVE10: {
    code: 'SAVE10',
    type: 'percentage',
    value: 10,
    minSubtotal: 100,
    expiresAt: '2026-12-31',
  },

  FREESHIPPING: {
    code: 'FREESHIPPING',
    type: 'free-delivery',
    minSubtotal: 50,
    expiresAt: '2026-12-31',
  },
}

function isCouponExpired(coupon) {
  const expiresAt = new Date(`${coupon.expiresAt}T23:59:59`)

  return new Date() > expiresAt
}

function applyCoupon() {
  const code = couponInput.value.trim().toUpperCase()

  couponError.value = ''

  if (!code) {
    couponError.value = 'Enter a coupon code.'
    return
  }

  const coupon = coupons[code]

  if (!coupon) {
    couponError.value = 'Invalid coupon code.'
    return
  }

  if (isCouponExpired(coupon)) {
    couponError.value = 'This coupon has expired.'
    return
  }

  if (cartTotal.value < coupon.minSubtotal) {
    couponError.value = `Minimum order value is ${formatCurrency(coupon.minSubtotal)}.`

    return
  }

  appliedCoupon.value = coupon
  couponInput.value = ''
}

function removeCoupon() {
  appliedCoupon.value = null
  couponError.value = ''
}

const discount = computed(() => {
  if (appliedCoupon.value?.type !== 'percentage') {
    return 0
  }

  return cartTotal.value * (appliedCoupon.value.value / 100)
})

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
  if (appliedCoupon.value?.type === 'free-delivery') {
    return 0
  }

  if (selectedDelivery.value === 'standard' && cartTotal.value >= FREE_DELIVERY_THRESHOLD) {
    return 0
  }

  return selectedDeliveryMethod.value?.price ?? 0
})

const orderTotal = computed(() => {
  return cartTotal.value - discount.value + deliveryCost.value + paymentFee.value
})

function validateCustomerDetails() {
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

function validatePayment() {
  errors.cardNumber = ''
  errors.cardExpiry = ''
  errors.cardCvc = ''

  if (selectedPayment.value !== 'card') {
    return true
  }

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

      const expired = year < currentYear || (year === currentYear && month < currentMonth)

      if (expired) {
        errors.cardExpiry = 'This card has expired.'
      }
    }
  }

  if (!/^\d{3,4}$/.test(form.cardCvc)) {
    errors.cardCvc = 'Enter a valid CVC.'
  }

  return errors.cardNumber === '' && errors.cardExpiry === '' && errors.cardCvc === ''
}

function goToStep2() {
  if (!validateCustomerDetails()) {
    return
  }

  currentStep.value = 2
}

function goToStep3() {
  if (!validatePayment()) {
    return
  }

  currentStep.value = 3
}

function goBack() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function validateForm() {
  const customerValid = validateCustomerDetails()
  const paymentValid = validatePayment()

  return customerValid && paymentValid
}

function submitForm() {
  const isValid = validateForm()

  if (!isValid) return
  if (cartItems.value.length === 0) return

  placedOrder.value = {
    number: `ORD-${Date.now()}`,

    customer: {
      name: form.name,
      email: form.email,
      address: form.address,
      city: form.city,
      postalCode: form.postalCode,
    },

    items: cartItems.value.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    })),

    delivery: {
      name: selectedDeliveryMethod.value.name,
      cost: deliveryCost.value,
    },

    payment: paymentMethods.find((method) => method.id === selectedPayment.value)?.name ?? '',

    paymentFee: paymentFee.value,
    subtotal: cartTotal.value,
    total: orderTotal.value,

    coupon: appliedCoupon.value?.code ?? null,
    discount: discount.value,
  }

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

    <div v-else-if="orderPlaced && placedOrder" class="order-success">
      <div class="order-success__icon">✓</div>

      <h2>Thank you for your order!</h2>

      <p>
        Order
        <strong>{{ placedOrder.number }}</strong>
        has been placed successfully.
      </p>

      <div class="order-success__details">
        <div class="order-success__section">
          <h3>Products</h3>

          <div v-for="item in placedOrder.items" :key="item.id" class="order-success__item">
            <span> {{ item.title }} × {{ item.quantity }} </span>

            <strong>
              {{ formatCurrency(item.price * item.quantity) }}
            </strong>
          </div>
        </div>

        <div class="order-success__section">
          <h3>Delivery</h3>

          <div class="order-success__row">
            <span>{{ placedOrder.delivery.name }}</span>

            <strong>
              {{
                placedOrder.delivery.cost === 0 ? 'Free' : formatCurrency(placedOrder.delivery.cost)
              }}
            </strong>
          </div>
        </div>

        <div class="order-success__section">
          <h3>Payment</h3>

          <div class="order-success__row">
            <span>{{ placedOrder.payment }}</span>

            <strong v-if="placedOrder.paymentFee > 0">
              +{{ formatCurrency(placedOrder.paymentFee) }}
            </strong>
          </div>
        </div>

        <div class="order-success__section">
          <h3>Shipping address</h3>

          <p class="order-success__address">
            {{ placedOrder.customer.name }}<br />
            {{ placedOrder.customer.address }}<br />
            {{ placedOrder.customer.postalCode }}
            {{ placedOrder.customer.city }}
          </p>
        </div>

        <div v-if="placedOrder.coupon" class="order-success__row">
          <span> Coupon ({{ placedOrder.coupon }}) </span>

          <strong v-if="placedOrder.discount > 0">
            -{{ formatCurrency(placedOrder.discount) }}
          </strong>

          <strong v-else> Applied </strong>
        </div>

        <div class="order-success__total">
          <span>Total</span>

          <strong>
            {{ formatCurrency(placedOrder.total) }}
          </strong>
        </div>
      </div>

      <RouterLink to="/" class="order-success__button"> Continue shopping </RouterLink>
    </div>

    <div v-if="cartItems.length > 0 && !orderPlaced" class="checkout-steps">
      <div class="checkout-step" :class="{ active: currentStep >= 1 }">
        <span>1</span>
        <strong>Details</strong>
      </div>

      <div class="checkout-step" :class="{ active: currentStep >= 2 }">
        <span>2</span>
        <strong>Delivery & payment</strong>
      </div>

      <div class="checkout-step" :class="{ active: currentStep >= 3 }">
        <span>3</span>
        <strong>Review</strong>
      </div>
    </div>

    <div v-if="cartItems.length > 0 && !orderPlaced" class="checkout__layout">
      <form class="checkout-form" novalidate @submit.prevent="submitForm">
        <template v-if="currentStep === 1">
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

          <button class="checkout-form__button" type="button" @click="goToStep2">
            Continue to delivery
          </button>
        </template>

        <template v-else-if="currentStep === 2">
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

            <div class="checkout-form__navigation">
              <button class="checkout-form__back" type="button" @click="goBack">Back</button>

              <button class="checkout-form__button" type="button" @click="goToStep3">
                Review order
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="checkout-review">
            <section>
              <div class="checkout-review__header">
                <h2>Delivery details</h2>

                <button type="button" @click="currentStep = 1">Edit</button>
              </div>

              <p>
                {{ form.name }}<br />
                {{ form.address }}<br />
                {{ form.postalCode }} {{ form.city }}<br />
                {{ form.email }}
              </p>
            </section>

            <section>
              <div class="checkout-review__header">
                <h2>Delivery</h2>

                <button type="button" @click="currentStep = 2">Edit</button>
              </div>

              <p>
                {{ selectedDeliveryMethod.name }}
                —
                {{ deliveryCost === 0 ? 'Free' : formatCurrency(deliveryCost) }}
              </p>
            </section>

            <section>
              <div class="checkout-review__header">
                <h2>Payment</h2>

                <button type="button" @click="currentStep = 2">Edit</button>
              </div>

              <p>
                {{ paymentMethods.find((method) => method.id === selectedPayment)?.name }}
              </p>
            </section>
          </div>

          <div class="checkout-form__navigation">
            <button class="checkout-form__back" type="button" @click="goBack">Back</button>

            <button class="checkout-form__button" type="submit">
              Place order · {{ formatCurrency(orderTotal) }}
            </button>
          </div>
        </template>
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

        <div class="coupon">
          <div v-if="!appliedCoupon" class="coupon__form">
            <input
              v-model="couponInput"
              type="text"
              placeholder="Coupon code"
              @keyup.enter="applyCoupon"
            />

            <button type="button" @click="applyCoupon">Apply</button>
          </div>

          <small v-if="couponError" class="form-error">
            {{ couponError }}
          </small>

          <div v-if="appliedCoupon" class="coupon__applied">
            <div>
              <span>Coupon</span>
              <strong>{{ appliedCoupon.code }}</strong>
            </div>

            <button type="button" @click="removeCoupon">Remove</button>
          </div>
        </div>

        <p v-if="!appliedCoupon" class="coupon__hint">
          Try SAVE10 on orders over $100 or FREESHIPPING over $50.
        </p>

        <div v-if="discount > 0" class="order-summary__row order-summary__row--discount">
          <span>Discount</span>

          <strong> -{{ formatCurrency(discount) }} </strong>
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

        <div class="order-summary__total">
          <span>Total</span>

          <strong>
            {{ formatCurrency(orderTotal) }}
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

.order-success__details {
  width: 100%;
  margin: 32px 0;
  text-align: left;
}

.order-success__section {
  padding: 18px 0;
  border-bottom: 1px solid var(--color-border);
}

.order-success__section h3 {
  margin: 0 0 12px;
  font-size: 14px;
}

.order-success__item,
.order-success__row,
.order-success__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.order-success__item {
  padding: 6px 0;
  font-size: 13px;
}

.order-success__row {
  font-size: 13px;
  padding: 18px 0;
}

.order-success__address {
  margin: 0;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.7;
}

.order-success__total {
  padding-top: 22px;
  font-size: 20px;
}

.order-success__total strong {
  color: var(--color-accent);
}

.checkout-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 28px;
}

.checkout-step {
  display: flex;
  align-items: center;
  gap: 9px;

  padding: 12px 14px;

  border: 1px solid var(--color-border);
  border-radius: 12px;

  color: var(--color-muted);
  background: var(--color-surface);
}

.checkout-step span {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 26px;

  border-radius: 50%;
  background: var(--color-image-bg);

  font-size: 12px;
  font-weight: 700;
}

.checkout-step strong {
  font-size: 13px;
}

.checkout-step.active {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}

.checkout-step.active span {
  color: #fff;
  background: var(--color-accent);
}

.checkout-review {
  display: grid;
  gap: 16px;
}

.checkout-review section {
  padding: 20px;

  border: 1px solid var(--color-border);
  border-radius: 14px;

  background: var(--color-bg);
}

.checkout-review__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  margin-bottom: 12px;
}

.checkout-review h2 {
  margin: 0;
  font-size: 16px;
}

.checkout-review p {
  margin: 0;

  color: var(--color-muted);

  font-size: 14px;
  line-height: 1.7;
}

.checkout-review__header button {
  padding: 0;

  border: 0;

  color: var(--color-accent);
  background: transparent;

  font-weight: 600;
  cursor: pointer;
}

.checkout-form__navigation {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;

  margin-top: 28px;
}

.checkout-form__navigation .checkout-form__button {
  margin-top: 0;
}

.checkout-form__back {
  padding: 14px 20px;

  border: 1px solid var(--color-border);
  border-radius: 12px;

  color: var(--color-text);
  background: var(--color-surface);

  font-weight: 600;
  cursor: pointer;
}

.coupon {
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border);
}

.coupon__form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.coupon__form input {
  min-width: 0;
  padding: 11px 12px;

  border: 1px solid var(--color-border);
  border-radius: 10px;

  background: var(--color-bg);
  font: inherit;
  font-size: 13px;
}

.coupon__form input:focus {
  border-color: var(--color-accent);
  outline: none;
}

.coupon__form button,
.coupon__applied button {
  border: 0;
  color: var(--color-accent);
  background: transparent;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;
}

.coupon__applied {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.coupon__applied > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.coupon__applied span {
  color: var(--color-muted);
  font-size: 11px;
}

.coupon__applied strong {
  color: var(--color-accent);
  font-size: 13px;
}

.order-summary__row--discount strong {
  color: var(--color-accent);
}

.coupon__hint {
  margin: 8px 0 0;

  color: var(--color-muted);

  font-size: 11px;
  line-height: 1.5;
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

  .card-fields {
    grid-template-columns: 1fr;
  }
}
</style>
