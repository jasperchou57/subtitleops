import { websiteConfig } from '../config/website';
import { serverEnv } from '../env/server';
import { Stripe } from 'stripe';

/**
 * Removes the user's external billing profile before the local account is
 * deleted. Stripe customer deletion also immediately cancels subscriptions.
 */
export async function deletePaymentCustomer(
  customerId: string | null | undefined
) {
  if (!customerId || websiteConfig.payment?.provider !== 'stripe') return;

  const apiKey = serverEnv.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }

  const stripe = new Stripe(apiKey);
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if ('deleted' in customer && customer.deleted) return;

    await stripe.customers.del(customerId);
  } catch (error) {
    if (
      error instanceof Stripe.errors.StripeInvalidRequestError &&
      error.code === 'resource_missing'
    ) {
      return;
    }
    throw error;
  }
}
