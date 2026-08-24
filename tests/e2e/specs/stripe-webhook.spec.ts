import { expect, test, type APIRequestContext } from '@playwright/test';
import { Stripe } from 'stripe';
import {
  cleanupE2EUsers,
  getE2EUserState,
  loginByForm,
  registerE2EUser,
  updateE2EUser,
} from '../fixtures/auth';

const webhookSecret =
  process.env.E2E_STRIPE_WEBHOOK_SECRET ?? 'whsec_subtitleops_e2e';
const stripe = new Stripe(
  process.env.E2E_STRIPE_SECRET_KEY ?? 'sk_test_subtitleops_e2e'
);

async function postWebhook(
  request: APIRequestContext,
  type: string,
  object: Record<string, unknown>,
  options: {
    eventId?: string;
    validSignature?: boolean;
    livemode?: boolean;
  } = {}
) {
  const payload = JSON.stringify({
    id: options.eventId ?? `evt_${crypto.randomUUID()}`,
    object: 'event',
    api_version: '2025-02-24.acacia',
    created: Math.floor(Date.now() / 1000),
    livemode: options.livemode ?? false,
    pending_webhooks: 1,
    request: null,
    type,
    data: { object },
  });
  const signature =
    options.validSignature === false
      ? 't=0,v1=invalid'
      : stripe.webhooks.generateTestHeaderString({
          payload,
          secret: webhookSecret,
        });
  return request.post('/api/webhooks/stripe', {
    data: payload,
    headers: {
      'content-type': 'application/json',
      'stripe-signature': signature,
    },
  });
}

async function sendWebhook(
  request: APIRequestContext,
  type: string,
  object: Record<string, unknown>,
  options: { eventId?: string } = {}
) {
  const response = await postWebhook(request, type, object, options);
  expect(response.ok(), await response.text()).toBeTruthy();
  return response;
}

function subscriptionObject({
  id,
  userId,
  priceId,
  status = 'active',
  cancelAtPeriodEnd = false,
}: {
  id: string;
  userId: string;
  priceId: string;
  status?: string;
  cancelAtPeriodEnd?: boolean;
}) {
  const now = Math.floor(Date.now() / 1000);
  return {
    id,
    object: 'subscription',
    customer: `e2e_customer_${userId}`,
    metadata: { userId },
    status,
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

function invoiceObject({
  id,
  subscription,
  paid,
}: {
  id: string;
  subscription: Record<string, unknown>;
  paid: boolean;
}) {
  const now = Math.floor(Date.now() / 1000);
  return {
    id,
    object: 'invoice',
    subscription,
    payment_intent: `pi_${id}`,
    charge: `ch_${id}`,
    amount_paid: paid ? 999 : 0,
    amount_due: 999,
    currency: 'usd',
    attempted: true,
    paid,
    status: paid ? 'paid' : 'open',
    status_transitions: { paid_at: paid ? now : null },
    lines: { data: [] },
  };
}

function oneTimeSession({
  id,
  userId,
  paid,
}: {
  id: string;
  userId: string;
  paid: boolean;
}) {
  return {
    id,
    object: 'checkout.session',
    mode: 'payment',
    customer: `e2e_customer_${userId}`,
    metadata: {
      userId,
      userName: 'E2E Customer',
      planId: 'lifetime',
      priceId: 'e2e_lifetime',
    },
    payment_status: paid ? 'paid' : 'unpaid',
    payment_intent: `pi_${id}`,
    invoice: null,
    subscription: null,
    amount_total: 4900,
    currency: 'usd',
  };
}

test.describe('Stripe signed webhook lifecycle', () => {
  test.skip(
    process.env.E2E_PAYMENT_PROVIDER !== 'stripe',
    'Run with E2E_PAYMENT_PROVIDER=stripe'
  );

  test.beforeEach(async ({ request }) => cleanupE2EUsers(request));
  test.afterEach(async ({ request }) => cleanupE2EUsers(request));

  test('rejects invalid signatures and Stripe mode mismatches', async ({
    request,
  }) => {
    const user = await registerE2EUser(request);
    const response = await postWebhook(
      request,
      'customer.subscription.updated',
      { id: 'sub_invalid', object: 'subscription' },
      { validSignature: false }
    );
    expect(response.status()).toBe(400);
    const modeMismatch = await postWebhook(
      request,
      'customer.subscription.updated',
      { id: 'sub_live', object: 'subscription' },
      { livemode: true }
    );
    expect(modeMismatch.status()).toBe(400);
    const state = await getE2EUserState(request, user.email);
    expect(state.webhookEvents).toHaveLength(0);
    expect(state.transactions).toHaveLength(0);
  });

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
        userId: initial.user.id,
        priceId: 'e2e_studio_monthly',
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
        userId: initial.user.id,
        priceId: 'e2e_studio_monthly',
        cancelAtPeriodEnd: true,
      })
    );
    const cancelScheduled = await getE2EUserState(request, user.email);
    expect(cancelScheduled.payment?.cancelAtPeriodEnd).toBe(true);
    expect(cancelScheduled.entitlement.planId).toBe('studio');

    await sendWebhook(
      request,
      'customer.subscription.deleted',
      subscriptionObject({
        id: subscriptionId,
        userId: initial.user.id,
        priceId: 'e2e_studio_monthly',
        status: 'canceled',
      })
    );
    const canceled = await getE2EUserState(request, user.email);
    expect(canceled.payment?.status).toBe('canceled');
    expect(canceled.payment?.paid).toBe(false);
    expect(canceled.entitlement.planId).toBe('free');
  });

  test('fulfills an out-of-order invoice once across duplicate events', async ({
    request,
  }) => {
    const user = await registerE2EUser(request);
    const initial = await getE2EUserState(request, user.email);
    const subscription = subscriptionObject({
      id: `sub_out_of_order_${initial.user.id}`,
      userId: initial.user.id,
      priceId: 'e2e_pro_monthly',
    });
    const invoice = invoiceObject({
      id: `in_out_of_order_${initial.user.id}`,
      subscription,
      paid: true,
    });
    const eventId = `evt_invoice_${initial.user.id}`;

    const concurrent = await Promise.all([
      postWebhook(request, 'invoice.paid', invoice, { eventId }),
      postWebhook(request, 'invoice.paid', invoice, { eventId }),
    ]);
    expect(concurrent.some((response) => response.ok())).toBe(true);
    for (let index = 0; index < 3; index++) {
      await sendWebhook(request, 'invoice.paid', invoice, { eventId });
    }

    await sendWebhook(request, 'checkout.session.completed', {
      id: `cs_late_${initial.user.id}`,
      object: 'checkout.session',
      mode: 'subscription',
      customer: `e2e_customer_${initial.user.id}`,
      metadata: { userId: initial.user.id, planId: 'pro' },
      payment_status: 'paid',
      subscription,
      invoice: invoice.id,
    });

    const state = await getE2EUserState(request, user.email);
    expect(state.entitlement.planId).toBe('pro');
    expect(state.transactions).toHaveLength(1);
    expect(state.transactions[0]).toMatchObject({
      businessKey: `subscription_invoice:${invoice.id}`,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      invoiceId: invoice.id,
    });
    expect(
      state.webhookEvents.find((event) => event.id === eventId)
    ).toMatchObject({ status: 'succeeded' });

    const renewal = invoiceObject({
      id: `in_renewal_${initial.user.id}`,
      subscription,
      paid: true,
    });
    await sendWebhook(request, 'invoice.paid', renewal);
    const renewed = await getE2EUserState(request, user.email);
    expect(renewed.entitlement.planId).toBe('pro');
    expect(renewed.transactions).toHaveLength(2);
    expect(
      renewed.transactions.find(
        (transaction) => transaction.invoiceId === renewal.id
      )
    ).toMatchObject({
      businessKey: `subscription_invoice:${renewal.id}`,
      fulfillmentStatus: 'fulfilled',
    });
  });

  test('recovers a failed invoice without granting access twice', async ({
    request,
  }) => {
    const user = await registerE2EUser(request);
    const initial = await getE2EUserState(request, user.email);
    const subscription = subscriptionObject({
      id: `sub_retry_${initial.user.id}`,
      userId: initial.user.id,
      priceId: 'e2e_pro_monthly',
      status: 'past_due',
    });
    const failedInvoice = invoiceObject({
      id: `in_retry_${initial.user.id}`,
      subscription,
      paid: false,
    });

    await sendWebhook(request, 'checkout.session.completed', {
      id: `cs_before_invoice_${initial.user.id}`,
      object: 'checkout.session',
      mode: 'subscription',
      customer: `e2e_customer_${initial.user.id}`,
      metadata: { userId: initial.user.id, planId: 'pro' },
      payment_status: 'paid',
      subscription,
      invoice: failedInvoice.id,
    });
    const checkoutOnly = await getE2EUserState(request, user.email);
    expect(checkoutOnly.entitlement.planId).toBe('free');

    await sendWebhook(request, 'invoice.payment_failed', failedInvoice);
    const failed = await getE2EUserState(request, user.email);
    expect(failed.entitlement.planId).toBe('free');
    expect(failed.transactions[0]).toMatchObject({
      paymentStatus: 'failed',
      fulfillmentStatus: 'not_applicable',
    });

    const activeSubscription = subscriptionObject({
      id: `sub_retry_${initial.user.id}`,
      userId: initial.user.id,
      priceId: 'e2e_pro_monthly',
    });
    await sendWebhook(
      request,
      'invoice.paid',
      invoiceObject({
        id: failedInvoice.id,
        subscription: activeSubscription,
        paid: true,
      })
    );
    const recovered = await getE2EUserState(request, user.email);
    expect(recovered.entitlement.planId).toBe('pro');
    expect(recovered.transactions).toHaveLength(1);
    expect(recovered.transactions[0]).toMatchObject({
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    });
  });

  test('handles asynchronous one-time success and failure', async ({
    request,
  }) => {
    const paidUser = await registerE2EUser(request);
    const paidInitial = await getE2EUserState(request, paidUser.email);
    const paidSession = oneTimeSession({
      id: `cs_async_paid_${paidInitial.user.id}`,
      userId: paidInitial.user.id,
      paid: true,
    });
    await sendWebhook(
      request,
      'checkout.session.async_payment_succeeded',
      paidSession
    );
    const paidState = await getE2EUserState(request, paidUser.email);
    expect(paidState.payment?.paid).toBe(true);
    expect(paidState.transactions[0]).toMatchObject({
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    });
    await sendWebhook(request, 'checkout.session.async_payment_failed', {
      ...paidSession,
      payment_status: 'unpaid',
    });
    const afterLateFailure = await getE2EUserState(request, paidUser.email);
    expect(afterLateFailure.payment?.paid).toBe(true);
    expect(afterLateFailure.transactions[0]).toMatchObject({
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    });

    const failedUser = await registerE2EUser(request);
    const failedInitial = await getE2EUserState(request, failedUser.email);
    const failedSession = oneTimeSession({
      id: `cs_async_failed_${failedInitial.user.id}`,
      userId: failedInitial.user.id,
      paid: false,
    });
    await sendWebhook(
      request,
      'checkout.session.async_payment_failed',
      failedSession
    );
    const failedState = await getE2EUserState(request, failedUser.email);
    expect(failedState.payment?.paid).toBe(false);
    expect(failedState.transactions[0]).toMatchObject({
      paymentStatus: 'failed',
      fulfillmentStatus: 'not_applicable',
    });
  });

  test('revokes and restores access for disputes and full refunds', async ({
    request,
  }) => {
    const user = await registerE2EUser(request);
    const initial = await getE2EUserState(request, user.email);
    const subscription = subscriptionObject({
      id: `sub_risk_${initial.user.id}`,
      userId: initial.user.id,
      priceId: 'e2e_pro_monthly',
    });
    const invoice = invoiceObject({
      id: `in_risk_${initial.user.id}`,
      subscription,
      paid: true,
    });
    await sendWebhook(request, 'invoice.paid', invoice);

    const dispute = {
      id: `du_${initial.user.id}`,
      object: 'dispute',
      payment_intent: invoice.payment_intent,
      charge: invoice.charge,
      status: 'needs_response',
    };
    await sendWebhook(request, 'charge.dispute.created', dispute);
    const disputed = await getE2EUserState(request, user.email);
    expect(disputed.entitlement.planId).toBe('free');
    expect(disputed.transactions[0]).toMatchObject({
      paymentStatus: 'disputed',
      fulfillmentStatus: 'revoked',
    });

    await sendWebhook(request, 'charge.dispute.closed', {
      ...dispute,
      status: 'won',
    });
    const restored = await getE2EUserState(request, user.email);
    expect(restored.entitlement.planId).toBe('pro');

    await sendWebhook(request, 'refund.created', {
      id: `re_partial_${initial.user.id}`,
      object: 'refund',
      amount: 100,
      status: 'succeeded',
      payment_intent: invoice.payment_intent,
      charge: invoice.charge,
    });
    const partial = await getE2EUserState(request, user.email);
    expect(partial.entitlement.planId).toBe('pro');
    expect(partial.transactions[0].paymentStatus).toBe('partially_refunded');

    const renewal = invoiceObject({
      id: `in_risk_renewal_${initial.user.id}`,
      subscription,
      paid: true,
    });
    await sendWebhook(request, 'invoice.paid', renewal);

    await sendWebhook(request, 'charge.refunded', {
      id: invoice.charge,
      object: 'charge',
      payment_intent: invoice.payment_intent,
      amount_refunded: 999,
      refunded: true,
    });
    const oldPeriodRefunded = await getE2EUserState(request, user.email);
    expect(oldPeriodRefunded.entitlement.planId).toBe('pro');
    expect(
      oldPeriodRefunded.transactions.find(
        (transaction) => transaction.invoiceId === invoice.id
      )
    ).toMatchObject({
      paymentStatus: 'refunded',
      fulfillmentStatus: 'revoked',
    });

    await sendWebhook(request, 'charge.refunded', {
      id: renewal.charge,
      object: 'charge',
      payment_intent: renewal.payment_intent,
      amount_refunded: 999,
      refunded: true,
    });
    const refunded = await getE2EUserState(request, user.email);
    expect(refunded.entitlement.planId).toBe('free');
    expect(
      refunded.transactions.find(
        (transaction) => transaction.invoiceId === renewal.id
      )
    ).toMatchObject({
      paymentStatus: 'refunded',
      fulfillmentStatus: 'revoked',
    });
  });

  test('rejects an unknown configured price without granting access', async ({
    request,
  }) => {
    const user = await registerE2EUser(request);
    const initial = await getE2EUserState(request, user.email);
    const subscription = subscriptionObject({
      id: `sub_unknown_${initial.user.id}`,
      userId: initial.user.id,
      priceId: 'price_unknown',
    });
    const eventId = `evt_unknown_${initial.user.id}`;
    const response = await postWebhook(
      request,
      'invoice.paid',
      invoiceObject({
        id: `in_unknown_${initial.user.id}`,
        subscription,
        paid: true,
      }),
      { eventId }
    );
    expect(response.status()).toBe(500);
    const state = await getE2EUserState(request, user.email);
    expect(state.entitlement.planId).toBe('free');
    expect(state.transactions).toHaveLength(0);
    expect(
      state.webhookEvents.find((event) => event.id === eventId)
    ).toMatchObject({ status: 'failed' });
  });

  test('shows auditable transactions and events to an administrator', async ({
    page,
    request,
  }) => {
    const user = await registerE2EUser(request, { role: 'admin' });
    const initial = await getE2EUserState(request, user.email);
    const subscription = subscriptionObject({
      id: `sub_admin_${initial.user.id}`,
      userId: initial.user.id,
      priceId: 'e2e_pro_monthly',
    });
    const invoice = invoiceObject({
      id: `in_admin_${initial.user.id}`,
      subscription,
      paid: true,
    });
    await sendWebhook(request, 'invoice.paid', invoice, {
      eventId: `evt_admin_${initial.user.id}`,
    });

    await loginByForm(page, user);
    await page.goto('/admin/payments');
    await expect(
      page.getByRole('heading', { name: 'Payment transactions' })
    ).toBeVisible();
    await expect(
      page.locator('table').first().getByText(user.email, { exact: true })
    ).toBeVisible();
    await expect(
      page.locator('table').first().locator('div[title^="in_admin_"]').first()
    ).toBeVisible();
    await expect(page.getByText('invoice.paid')).toBeVisible();

    await page.getByLabel('Search payments').fill(invoice.id);
    await expect(
      page.locator('table').first().locator(`div[title="${invoice.id}"]`)
    ).toBeVisible();
  });
});
