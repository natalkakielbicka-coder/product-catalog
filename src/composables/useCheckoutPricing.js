import { computed, ref } from 'vue'

export const FREE_DELIVERY_THRESHOLD = 100
const CASH_ON_DELIVERY_FEE = 4.99

export function useCheckoutPricing(cartTotal) {
  const selectedDelivery = ref('standard')
  const selectedPayment = ref('card')

  const couponInput = ref('')
  const appliedCoupon = ref(null)
  const couponError = ref('')

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
      price: CASH_ON_DELIVERY_FEE,
    },
  ]

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

  const selectedDeliveryMethod = computed(() => {
    return deliveryMethods.find((method) => method.id === selectedDelivery.value)
  })

  const selectedPaymentMethod = computed(() => {
    return paymentMethods.find((method) => method.id === selectedPayment.value)
  })

  const discount = computed(() => {
    if (appliedCoupon.value?.type !== 'percentage') {
      return 0
    }

    return cartTotal.value * (appliedCoupon.value.value / 100)
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

  const paymentFee = computed(() => {
    if (selectedPayment.value === 'cash') {
      return CASH_ON_DELIVERY_FEE
    }

    return 0
  })

  const orderTotal = computed(() => {
    return cartTotal.value - discount.value + deliveryCost.value + paymentFee.value
  })

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
      couponError.value = `Minimum order value is $${coupon.minSubtotal.toFixed(2)}.`

      return
    }

    appliedCoupon.value = coupon
    couponInput.value = ''
  }

  function removeCoupon() {
    appliedCoupon.value = null
    couponError.value = ''
  }

  return {
    selectedDelivery,
    selectedPayment,

    deliveryMethods,
    paymentMethods,

    FREE_DELIVERY_THRESHOLD,

    selectedDeliveryMethod,
    selectedPaymentMethod,

    deliveryCost,
    paymentFee,
    discount,
    orderTotal,

    couponInput,
    appliedCoupon,
    couponError,

    applyCoupon,
    removeCoupon,
  }
}
