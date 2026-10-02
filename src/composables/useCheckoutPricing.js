import { computed, ref, watch } from 'vue'
import { validateCoupon } from '@/services/orderService'

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

  const selectedDeliveryMethod = computed(() => {
    return deliveryMethods.find((method) => method.id === selectedDelivery.value)
  })

  const selectedPaymentMethod = computed(() => {
    return paymentMethods.find((method) => method.id === selectedPayment.value)
  })

  const discount = computed(() => {
    return appliedCoupon.value?.discount ?? 0
  })

  const deliveryCost = computed(() => {
    if (appliedCoupon.value?.freeShipping) {
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

  async function applyCoupon() {
    const code = couponInput.value.trim().toUpperCase()

    couponError.value = ''

    if (!code) {
      couponError.value = 'Enter a coupon code.'
      return
    }

    try {
      appliedCoupon.value = await validateCoupon(code, cartTotal.value)

      couponInput.value = ''
    } catch (error) {
      appliedCoupon.value = null
      couponError.value = error.message
    }
  }

  async function revalidateAppliedCoupon() {
    if (!appliedCoupon.value?.code) {
      return
    }

    try {
      appliedCoupon.value = await validateCoupon(appliedCoupon.value.code, cartTotal.value)
      couponError.value = ''
    } catch {
      appliedCoupon.value = null
      couponError.value = 'Coupon is no longer valid for the current cart.'
    }
  }

  watch(cartTotal, async (newTotal) => {
    if (newTotal <= 0) {
      appliedCoupon.value = null
      couponError.value = ''
      return
    }

    await revalidateAppliedCoupon()
  })

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
