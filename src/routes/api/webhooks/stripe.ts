import { createFileRoute } from '@tanstack/react-router';
import { handleWebhookEvent, isPaymentEnabled } from '@/payment';
import { PaymentWebhookRequestError } from '@/payment/errors';

/**
 * Stripe webhook endpoint
 * Configure in Stripe Dashboard: Webhooks -> Add endpoint
 * Endpoint URL: https://your-domain.com/api/webhooks/stripe
 * Events: checkout.session.*, customer.subscription.*, invoice.paid,
 * invoice.payment_failed, refund.created, charge.refunded, charge.dispute.*
 */
export const Route = createFileRoute('/api/webhooks/stripe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isPaymentEnabled()) {
          return Response.json({ received: true }, { status: 200 });
        }
        const payload = await request.text();
        const signature = request.headers.get('stripe-signature') ?? '';
        if (!payload || !signature) {
          console.warn('Stripe webhook: missing payload or signature');
          return Response.json(
            { error: 'Missing payload or signature' },
            { status: 400 }
          );
        }
        try {
          await handleWebhookEvent(payload, signature);
          return Response.json({ received: true }, { status: 200 });
        } catch (err) {
          if (err instanceof PaymentWebhookRequestError) {
            console.warn(`Stripe webhook request rejected: ${err.message}`);
            return Response.json(
              { error: 'Invalid webhook request' },
              { status: 400 }
            );
          }
          console.error('Stripe webhook error:', err);
          return Response.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
          );
        }
      },
    },
  },
});
