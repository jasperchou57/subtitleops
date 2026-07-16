import type { Stripe } from 'stripe';

export function isCheckoutSessionPaid(
  paymentStatus: Stripe.Checkout.Session.PaymentStatus
) {
  return paymentStatus === 'paid' || paymentStatus === 'no_payment_required';
}
