import { expect, test, type APIRequestContext } from '@playwright/test';
import { Stripe } from 'stripe';
import {
  cleanupE2EUsers,
  getE2EUserState,
  registerE2EUser,
  updateE2EUser,
} from '../fixtures/auth';

const webhookSecret =
  process.env.E2E_STRIPE_WEBHOOK_SECRET ?? 'whsec_subtitleops_e2e';
const stripe = new Stripe(
  process.env.E2E_STRIPE_SECRET_KEY ?? 'sk_test_subtitleops_e2e'
);

async function sendWebhook(
  request: APIRequestContext,
  type: 'customer.subscription.updated' | 'customer.subscription.deleted',
  object: Record<string, unknown>
) {
  const payload = JSON.stringify({
    id: `evt_${crypto.randomUUID()}`,
    object: 'event',
    api_version: '2025-02-24.acacia',
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    pending_webhooks: 1,
    request: null,
    type,
    data: { object },
  });
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: webhookSecret,
  });
  const response = await request.post('/api/webhooks/stripe', {
    data: payload,
    headers: {
      'content-type': 'application/json',
      'stripe-signature': signature,
    },
  });
  expect(response.ok(), await response.text()).toBeTruthy();
}

function subscriptionObject({
  id,
  priceId,
  cancelAtPeriodEnd,
}: {
  id: string;
  priceId: string;
  cancelAtPeriodEnd: boolean;
}) {
  const now = Math.floor(Date.now() / 1000);
  return {
    id,
    object: 'subscription',
    status: 'active',
    cancel_at_period_end: cancelAtPeriodEnd,
    current_period_start: now,
    current_period_end: now + 30 * 24 * 60 * 60,
    trial_start: null,
    trial_end: null,
    items: {
      data: [
        {
          current_period_start: now,
          current_period_end: now + 30 * 24 * 60 * 60,
          price: { id: priceId },
          plan: { interval: 'month' },
        },
      ],
    },
  };
}

test.describe('Stripe signed webhook lifecycle', () => {
  test.skip(
    process.env.E2E_PAYMENT_PROVIDER !== 'stripe',
    'Run with E2E_PAYMENT_PROVIDER=stripe'
  );

  test.beforeEach(async ({ request }) => cleanupE2EUsers(request));
  test.afterEach(async ({ request }) => cleanupE2EUsers(request));

  test('upgrades, schedules cancellation, and revokes access on deletion', async ({
    request,
  }) => {
    const user = await registerE2EUser(request);
    await updateE2EUser(request, { email: user.email, planId: 'pro' });
    const initial = await getE2EUserState(request, user.email);
    const subscriptionId = `e2e_subscription_${initial.user.id}`;

    await sendWebhook(
      request,
      'customer.subscription.updated',
      subscriptionObject({
        id: subscriptionId,
        priceId: 'e2e_studio_monthly',
        cancelAtPeriodEnd: false,
      })
    );
    const upgraded = await getE2EUserState(request, user.email);
    expect(upgraded.payment).toMatchObject({
      planId: 'studio',
      priceId: 'e2e_studio_monthly',
      status: 'active',
      cancelAtPeriodEnd: false,
    });
    expect(upgraded.entitlement.planId).toBe('studio');

    await sendWebhook(
      request,
      'customer.subscription.updated',
      subscriptionObject({
        id: subscriptionId,
        priceId: 'e2e_studio_monthly',
        cancelAtPeriodEnd: true,
      })
    );
    const cancelScheduled = await getE2EUserState(request, user.email);
    expect(cancelScheduled.payment?.cancelAtPeriodEnd).toBe(true);
    expect(cancelScheduled.entitlement.planId).toBe('studio');

    await sendWebhook(request, 'customer.subscription.deleted', {
      id: subscriptionId,
      object: 'subscription',
      status: 'canceled',
    });
    const canceled = await getE2EUserState(request, user.email);
    expect(canceled.payment?.status).toBe('canceled');
    expect(canceled.entitlement.planId).toBe('free');
  });
});
