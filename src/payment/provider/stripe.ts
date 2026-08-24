import { getDb } from '@/db';
import { payment, paymentTransactions } from '@/db/app.schema';
import { user } from '@/db/auth.schema';
import type { Payment, PaymentTransaction } from '@/db/types';
import {
  findPlanByPlanId,
  findPlanByPriceId,
  findPriceInPlan,
} from '@/lib/price-plan';
import { sendPaymentNotification } from '@/notification';
import { and, desc, eq, gt, lt, or } from 'drizzle-orm';
import { Stripe } from 'stripe';
import { PaymentWebhookRequestError } from '../errors';
import {
  beginStripeWebhookEvent,
  completeStripeWebhookEvent,
  failStripeWebhookEvent,
} from '../stripe-webhook-store';
import type {
  CheckoutResult,
  CreateCheckoutParams,
  CreatePortalParams,
  PaymentProvider,
  PaymentStatus,
  PlanInterval,
  PortalResult,
} from '../types';
import { PlanIntervals, PaymentScenes, PaymentTypes } from '../types';
import { isCheckoutSessionPaid } from './stripe-checkout';

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.toLowerCase().includes('unique constraint')
  );
}

/**
 * Stripe payment provider implementation
 */
export class StripeProvider implements PaymentProvider {
  private stripe: Stripe;
  private webhookSecret: string;
  private livemode: boolean;

  /**
   * Initialize Stripe provider with API key
   */
  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set.');
    }

    // Initialize Stripe without specifying apiVersion to use default/latest version
    this.stripe = new Stripe(apiKey);
    this.webhookSecret = webhookSecret;
    this.livemode = apiKey.startsWith('sk_live_');
  }

  getProviderName(): string {
    return 'stripe';
  }

  /**
   * Create a customer in Stripe if not exists
   * @param email Customer email
   * @param name Optional customer name
   * @returns Stripe customer ID
   */
  private async createOrGetCustomer(
    email: string,
    name?: string
  ): Promise<string> {
    try {
      // Search for existing customer
      const customers = await this.stripe.customers.list({
        email,
        limit: 1,
      });

      // Find existing customer
      if (customers.data && customers.data.length > 0) {
        const customerId = customers.data[0].id;

        // Find user id by customer id
        const userId = await this.findUserIdByCustomerId(customerId);
        // If no userId found, it means the user record exists (by email) but lacks customerId
        // This can happen when user was created before Stripe integration or data got out of sync
        // Fix the data inconsistency by updating the user's customerId field
        if (!userId) {
          console.log(
            'User exists but missing customerId, fixing data inconsistency'
          );
          await this.updateUserWithCustomerId(customerId, email);
        }
        return customerId;
      }

      // Create new customer
      const customer = await this.stripe.customers.create({
        email,
        name: name || undefined,
      });

      // Update user record in database with the new customer ID
      await this.updateUserWithCustomerId(customer.id, email);

      return customer.id;
    } catch (error) {
      console.error('Create or get customer error:', error);
      throw new Error('Failed to create or get customer');
    }
  }

  /**
   * Updates a user record with a Stripe customer ID
   * @param customerId Stripe customer ID
   * @param email Customer email
   * @returns Promise that resolves when the update is complete
   */
  private async updateUserWithCustomerId(
    customerId: string,
    email: string
  ): Promise<void> {
    try {
      // Update user record with customer ID if email matches
      const db = getDb();
      const result = await db
        .update(user)
        .set({
          customerId: customerId,
          updatedAt: new Date(),
        })
        .where(eq(user.email, email))
        .returning({ id: user.id });

      if (result.length > 0) {
        console.log('Updated user with customer ID (hidden)');
      } else {
        console.log('No user found with given email');
      }
    } catch (error) {
      console.error('Update user with customer ID error:', error);
      throw new Error('Failed to update user with customer ID');
    }
  }

  /**
   * Finds a user by customerId
   * @param customerId Stripe customer ID
   * @returns User ID or undefined if not found
   */
  private async findUserIdByCustomerId(
    customerId: string
  ): Promise<string | undefined> {
    try {
      // Query the user table for a matching customerId
      const db = getDb();
      const result = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.customerId, customerId))
        .limit(1);

      if (result.length > 0) {
        return result[0].id;
      }
      console.warn('No user found with given customerId');

      return undefined;
    } catch (error) {
      console.error('Find user by customer ID error:', error);
      return undefined;
    }
  }
  /**
   * Validates that a checkout session has required metadata
   * @param session Stripe checkout session
   * @returns Object with userId and customerId
   * @throws Error if required fields are missing
   */
  private validateSessionMetadata(session: Stripe.Checkout.Session): {
    userId: string;
    customerId: string;
  } {
    const userId = session.metadata?.userId;
    if (!userId || userId.trim() === '') {
      throw new Error(
        `Checkout session ${session.id} missing or empty userId in metadata - cannot process`
      );
    }

    const customerId = session.customer;
    if (!customerId || typeof customerId !== 'string') {
      throw new Error(
        `Checkout session ${session.id} missing or invalid customerId - cannot process`
      );
    }

    return { userId, customerId };
  }

  /**
   * Create a checkout session for a plan
   * @param params Parameters for creating the checkout session
   * @returns Checkout result
   */
  public async createCheckout(
    params: CreateCheckoutParams
  ): Promise<CheckoutResult> {
    const {
      planId,
      priceId,
      customerEmail,
      successUrl,
      cancelUrl,
      metadata,
      locale,
    } = params;

    try {
      // Get plan and price
      const plan = findPlanByPlanId(planId);
      if (!plan) {
        throw new Error(`Plan with ID ${planId} not found`);
      }

      // Find price in plan
      const price = findPriceInPlan(planId, priceId);
      if (!price) {
        throw new Error(`Price ID ${priceId} not found in plan ${planId}`);
      }

      // Get userName from metadata if available
      const userName = metadata?.userName;

      // Create or get customer
      const customerId = await this.createOrGetCustomer(
        customerEmail,
        userName
      );

      // Add planId and priceId to metadata, so we can get it in the webhook event
      const customMetadata = {
        ...metadata,
        planId,
        priceId,
      };

      // Set up the line items
      const lineItems = [
        {
          price: priceId,
          quantity: 1,
        },
      ];

      // Create checkout session parameters
      const checkoutParams: Stripe.Checkout.SessionCreateParams = {
        line_items: lineItems,
        mode:
          price.type === PaymentTypes.SUBSCRIPTION ? 'subscription' : 'payment',
        success_url: successUrl ?? '',
        cancel_url: cancelUrl ?? '',
        metadata: customMetadata,
        allow_promotion_codes: price.allowPromotionCode ?? false,
      };

      // Add customer to checkout session
      checkoutParams.customer = customerId;

      if (locale) {
        checkoutParams.locale = this.mapLocaleToStripeLocale(locale);
      }

      // Add payment intent data for one-time payments
      if (price.type === PaymentTypes.ONE_TIME) {
        checkoutParams.payment_intent_data = {
          metadata: customMetadata,
        };
        // Automatically create an invoice for the one-time payment
        checkoutParams.invoice_creation = {
          enabled: true,
        };
      }

      // Add subscription data for recurring payments
      if (price.type === PaymentTypes.SUBSCRIPTION) {
        // Initialize subscription_data with metadata
        checkoutParams.subscription_data = {
          metadata: customMetadata,
        };

        // Add trial period if applicable
        if (price.trialPeriodDays && price.trialPeriodDays > 0) {
          checkoutParams.subscription_data.trial_period_days =
            price.trialPeriodDays;
        }
      }

      // Create the checkout session
      const session =
        await this.stripe.checkout.sessions.create(checkoutParams);

      return {
        url: session.url!,
        id: session.id,
      };
    } catch (error) {
      console.error('Create checkout session error:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Create a customer portal session
   * @param params Parameters for creating the portal
   * @returns Portal result
   */
  public async createCustomerPortal(
    params: CreatePortalParams
  ): Promise<PortalResult> {
    const { customerId, returnUrl, locale } = params;

    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl ?? '',
        locale: locale ? this.mapLocaleToStripeLocale(locale) : undefined,
      });

      return {
        url: session.url,
      };
    } catch (error) {
      console.error('Create customer portal error:', error);
      throw new Error('Failed to create customer portal');
    }
  }

  /**
   * Handle webhook event
   * @param payload Raw webhook payload
   * @param signature Webhook signature
   */
  public async handleWebhookEvent(
    payload: string,
    signature: string
  ): Promise<void> {
    let event: Stripe.Event;
    try {
      event = await this.stripe.webhooks.constructEventAsync(
        payload,
        signature,
        this.webhookSecret
      );
    } catch (_error) {
      throw new PaymentWebhookRequestError('Invalid Stripe webhook signature');
    }

    if (event.livemode !== this.livemode) {
      throw new PaymentWebhookRequestError(
        'Stripe event mode does not match the configured API key'
      );
    }

    const shouldProcess = await beginStripeWebhookEvent(event);
    if (!shouldProcess) {
      console.log(`Stripe event already completed: ${event.id}`);
      return;
    }

    try {
      console.log(`Handle Stripe event ${event.id}: ${event.type}`);
      await this.dispatchWebhookEvent(event);
      await completeStripeWebhookEvent(event.id);
    } catch (error) {
      await failStripeWebhookEvent(event.id, error);
      console.error(`Stripe event ${event.id} failed:`, error);
      throw error;
    }
  }

  private async dispatchWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.onCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        return;
      case 'checkout.session.async_payment_succeeded':
        await this.onAsyncPaymentSucceeded(
          event.data.object as Stripe.Checkout.Session
        );
        return;
      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired':
        await this.onCheckoutPaymentFailed(
          event.data.object as Stripe.Checkout.Session,
          event.type
        );
        return;
      case 'invoice.paid':
        await this.onInvoicePaid(event.data.object as Stripe.Invoice);
        return;
      case 'invoice.payment_failed':
        await this.onInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        return;
      case 'customer.subscription.created':
        await this.onCreateSubscription(
          event.data.object as Stripe.Subscription
        );
        return;
      case 'customer.subscription.updated':
        await this.onUpdateSubscription(
          event.data.object as Stripe.Subscription
        );
        return;
      case 'customer.subscription.deleted':
        await this.onDeleteSubscription(
          event.data.object as Stripe.Subscription
        );
        return;
      case 'refund.created':
        await this.onRefundCreated(event.data.object as Stripe.Refund);
        return;
      case 'charge.refunded':
        await this.onChargeRefunded(event.data.object as Stripe.Charge);
        return;
      case 'charge.dispute.created':
        await this.onDisputeCreated(event.data.object as Stripe.Dispute);
        return;
      case 'charge.dispute.closed':
      case 'charge.dispute.funds_reinstated':
        await this.onDisputeResolved(event.data.object as Stripe.Dispute);
        return;
      default:
        console.log(`Ignoring unhandled Stripe event: ${event.type}`);
    }
  }

  private async findPaymentRecord(
    invoice: Stripe.Invoice
  ): Promise<Payment | null> {
    try {
      const db = getDb();

      // Strategy 1: Find by invoice ID (most reliable)
      if (invoice.id) {
        const paymentsByInvoice = await db
          .select()
          .from(payment)
          .where(eq(payment.invoiceId, invoice.id))
          .orderBy(desc(payment.createdAt))
          .limit(1);

        if (paymentsByInvoice.length > 0) {
          console.log('Found payment record by invoice ID');
          return paymentsByInvoice[0];
        }
      }

      // Strategy 2: For subscription payments, find by subscription ID
      const subscriptionId = this.extractSubscriptionId(invoice);
      if (subscriptionId) {
        const paymentsBySubscription = await db
          .select()
          .from(payment)
          .where(eq(payment.subscriptionId, subscriptionId))
          .orderBy(desc(payment.createdAt))
          .limit(1);

        if (paymentsBySubscription.length > 0) {
          console.log('Found payment record by subscription ID');
          return paymentsBySubscription[0];
        }
      }

      console.warn('No payment record found for invoice:', invoice.id);
      return null;
    } catch (error) {
      console.error('Find payment record error:', error);
      return null;
    }
  }

  /**
   * Handle successful invoice payment
   * Find existing payment record and update all fields appropriately
   *
   * For one-time payments, the order of events may be:
   * checkout.session.completed
   * invoice.paid
   *
   * For subscription payments, the order of events may be:
   * checkout.session.completed
   * customer.subscription.created
   * customer.subscription.updated
   * invoice.paid
   *
   * For subscription renewals, the order of events may be:
   * customer.subscription.updated
   * invoice.paid  (a new invoice, but same payment record is used)
   *
   * User can update the subscription in customer portal,
   * For subscription upgrades, the order of events may be:
   * invoice.paid  (a new invoice, but same payment record is used)
   *
   * @param invoice Stripe invoice
   */
  private async onInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    console.log('>> Handle invoice paid, invoiceId:', invoice.id);
    const subscription = await this.resolveInvoiceSubscription(invoice);
    if (subscription) {
      const paymentRecord = await this.upsertSubscriptionPaymentRecord(
        subscription,
        {
          invoiceId: invoice.id,
          paid: true,
        }
      );
      const priceId = this.getConfiguredSubscriptionPrice(subscription);
      const transaction = await this.ensurePaymentTransaction({
        paymentRecord,
        businessKey: `subscription_invoice:${invoice.id}`,
        paymentIntentId: this.getStripeId(invoice.payment_intent),
        invoiceId: invoice.id,
        chargeId: this.getStripeId(invoice.charge),
        priceId,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        paymentStatus: 'paid',
        fulfillmentStatus: 'pending',
        paidAt: this.getInvoicePaidAt(invoice),
      });
      await this.fulfillPaymentTransaction(transaction, paymentRecord);
      return;
    }

    const paymentRecord = await this.findOrRecoverOneTimePayment(invoice);
    if (!paymentRecord) {
      throw new Error(`No one-time payment found for invoice ${invoice.id}`);
    }
    const paymentIntentId = this.getStripeId(invoice.payment_intent);
    const businessKey = paymentIntentId
      ? `one_time_payment:${paymentIntentId}`
      : `one_time_invoice:${invoice.id}`;
    const transaction = await this.ensurePaymentTransaction({
      paymentRecord,
      businessKey,
      paymentIntentId,
      invoiceId: invoice.id,
      chargeId: this.getStripeId(invoice.charge),
      priceId: paymentRecord.priceId,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      paymentStatus: 'paid',
      fulfillmentStatus: 'pending',
      paidAt: this.getInvoicePaidAt(invoice),
    });
    await this.fulfillPaymentTransaction(transaction, paymentRecord, true);
  }

  private async onInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const subscription = await this.resolveInvoiceSubscription(invoice);
    if (!subscription) return;

    const paymentRecord = await this.upsertSubscriptionPaymentRecord(
      subscription,
      { invoiceId: invoice.id }
    );
    const priceId = this.getConfiguredSubscriptionPrice(subscription);
    await this.ensurePaymentTransaction({
      paymentRecord,
      businessKey: `subscription_invoice:${invoice.id}`,
      paymentIntentId: this.getStripeId(invoice.payment_intent),
      invoiceId: invoice.id,
      chargeId: this.getStripeId(invoice.charge),
      priceId,
      amount: invoice.amount_due,
      currency: invoice.currency,
      paymentStatus: 'failed',
      fulfillmentStatus: 'not_applicable',
      failureMessage: 'Stripe invoice payment failed',
    });
  }

  private async fulfillPaymentTransaction(
    transaction: PaymentTransaction,
    paymentRecord: Payment,
    notify = false
  ) {
    const claimed = await this.claimPaymentTransaction(transaction.businessKey);
    if (!claimed) return;

    try {
      const db = getDb();
      const now = new Date();
      await db
        .update(payment)
        .set({
          paid: true,
          status:
            paymentRecord.type === 'one_time'
              ? 'completed'
              : paymentRecord.status,
          updatedAt: now,
        })
        .where(eq(payment.id, paymentRecord.id));
      await db
        .update(paymentTransactions)
        .set({
          paymentStatus: 'paid',
          fulfillmentStatus: 'fulfilled',
          failureMessage: null,
          fulfilledAt: now,
          paidAt: transaction.paidAt ?? now,
          updatedAt: now,
        })
        .where(eq(paymentTransactions.businessKey, transaction.businessKey));

      if (notify && paymentRecord.sessionId) {
        await sendPaymentNotification({
          sessionId: paymentRecord.sessionId,
          customerId: paymentRecord.customerId,
          userName: 'Customer',
          amount: transaction.amount / 100,
        });
      }
    } catch (error) {
      await getDb()
        .update(paymentTransactions)
        .set({
          fulfillmentStatus: 'failed',
          failureMessage:
            error instanceof Error
              ? error.message.slice(0, 1000)
              : 'Unknown error',
          updatedAt: new Date(),
        })
        .where(eq(paymentTransactions.businessKey, transaction.businessKey));
      throw error;
    }
  }

  private async onCreateSubscription(
    stripeSubscription: Stripe.Subscription
  ): Promise<void> {
    await this.upsertSubscriptionPaymentRecord(stripeSubscription, {
      paid: stripeSubscription.status === 'trialing' ? true : undefined,
    });
  }

  /**
   * Update payment record when subscription is updated
   *
   * When subscription is renewed, the order of events may be:
   * customer.subscription.updated
   * invoice.paid
   *
   * When subscription is cancelled, the order of events may be:
   * customer.subscription.updated
   *
   * In this case, we need to update the payment record.
   *
   * @param stripeSubscription Stripe subscription
   */
  private async onUpdateSubscription(
    stripeSubscription: Stripe.Subscription
  ): Promise<void> {
    await this.upsertSubscriptionPaymentRecord(stripeSubscription, {
      paid: stripeSubscription.status === 'trialing' ? true : undefined,
    });
  }

  /**
   * Update payment record when subscription is deleted
   *
   * When subscription is deleted, the order of events may be:
   * customer.subscription.deleted
   *
   * In this case, we need to update the payment record.
   *
   * @param stripeSubscription Stripe subscription
   */
  private async onDeleteSubscription(
    stripeSubscription: Stripe.Subscription
  ): Promise<void> {
    await this.upsertSubscriptionPaymentRecord(stripeSubscription, {
      paid: false,
    });
  }

  /**
   * Handle checkout session completion
   * Create payment records with paid=false
   * @param session Stripe checkout session
   */
  private async onCheckoutCompleted(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    console.log('>> Handle checkout session completion:', session.id);

    // I have simulated with 10-second delay to test behavior when invoice paid event arrives first
    try {
      if (session.mode === 'subscription') {
        await this.createSubscriptionPaymentRecord(session);
      } else if (session.mode === 'payment') {
        await this.createOneTimePaymentRecord(session);
      } else {
        console.warn('<< Unsupported checkout session mode:', session.mode);
        return;
      }
    } catch (error) {
      console.error('<< Handle checkout session completion error:', error);
      throw error;
    }

    console.log('<< Handle checkout session completion success');
  }

  private async onAsyncPaymentSucceeded(session: Stripe.Checkout.Session) {
    if (session.mode !== 'payment' || session.payment_status !== 'paid') {
      throw new Error(
        `Async success session ${session.id} is not a paid one-time checkout`
      );
    }
    await this.createOneTimePaymentRecord(session);
  }

  private async onCheckoutPaymentFailed(
    session: Stripe.Checkout.Session,
    eventType:
      | 'checkout.session.async_payment_failed'
      | 'checkout.session.expired'
  ) {
    const db = getDb();
    let [paymentRecord] = await db
      .select()
      .from(payment)
      .where(eq(payment.sessionId, session.id))
      .limit(1);

    if (!paymentRecord && session.mode === 'payment') {
      paymentRecord = await this.createOneTimePaymentRecord(session);
    }
    if (!paymentRecord) return;
    if (paymentRecord.paid) {
      console.log(
        `Ignoring ${eventType} for already-paid checkout session ${session.id}`
      );
      return;
    }

    const now = new Date();
    await db
      .update(payment)
      .set({ paid: false, status: 'failed', updatedAt: now })
      .where(eq(payment.id, paymentRecord.id));

    const paymentIntentId = this.getStripeId(session.payment_intent);
    const businessKey = paymentIntentId
      ? `one_time_payment:${paymentIntentId}`
      : `one_time_checkout:${session.id}`;
    await this.ensurePaymentTransaction({
      paymentRecord,
      businessKey,
      checkoutSessionId: session.id,
      paymentIntentId,
      invoiceId: this.getStripeId(session.invoice),
      priceId: paymentRecord.priceId,
      amount: session.amount_total ?? 0,
      currency: session.currency ?? 'usd',
      paymentStatus: 'failed',
      fulfillmentStatus: 'not_applicable',
      failureMessage: eventType,
    });
  }

  private async fulfillOneTimeCheckout(
    session: Stripe.Checkout.Session,
    paymentRecord: Payment
  ) {
    const paymentIntentId = this.getStripeId(session.payment_intent);
    const businessKey = paymentIntentId
      ? `one_time_payment:${paymentIntentId}`
      : `one_time_checkout:${session.id}`;
    const transaction = await this.ensurePaymentTransaction({
      paymentRecord,
      businessKey,
      checkoutSessionId: session.id,
      paymentIntentId,
      invoiceId: this.getStripeId(session.invoice),
      priceId: paymentRecord.priceId,
      amount: session.amount_total ?? 0,
      currency: session.currency ?? 'usd',
      paymentStatus: 'paid',
      fulfillmentStatus: 'pending',
      paidAt: new Date(),
    });
    await this.fulfillPaymentTransaction(transaction, paymentRecord, true);
  }

  /**
   * Create subscription payment record in checkout.session.completed event
   * @param session Stripe checkout session
   */
  private async createSubscriptionPaymentRecord(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    if (!session.subscription) {
      throw new Error(`Checkout session ${session.id} has no subscription`);
    }
    const { userId, customerId } = this.validateSessionMetadata(session);
    const subscription = await this.resolveCheckoutSubscription(session);
    await this.upsertSubscriptionPaymentRecord(subscription, {
      userId,
      customerId,
      sessionId: session.id,
      invoiceId: this.getStripeId(session.invoice),
    });
  }

  /**
   * Create one-time payment record in checkout.session.completed event
   * @param session Stripe checkout session
   */
  private async createOneTimePaymentRecord(
    session: Stripe.Checkout.Session
  ): Promise<Payment> {
    const priceId = session.metadata?.priceId;
    if (!priceId) {
      throw new Error(`Checkout session ${session.id} has no priceId metadata`);
    }
    const configured = this.requireConfiguredPrice(priceId);
    if (configured.price.type !== PaymentTypes.ONE_TIME) {
      throw new Error(`Stripe price ${priceId} is not a one-time price`);
    }
    const { userId, customerId } = this.validateSessionMetadata(session);
    const paymentRecord = await this.insertPaymentRecord(
      {
        planId: configured.plan.id,
        priceId,
        type: PaymentTypes.ONE_TIME,
        scene: PaymentScenes.LIFETIME,
        userId,
        customerId,
        sessionId: session.id,
        invoiceId: this.getStripeId(session.invoice),
        paid: false,
        status: isCheckoutSessionPaid(session.payment_status)
          ? 'processing'
          : 'incomplete',
      },
      'one-time'
    );

    if (isCheckoutSessionPaid(session.payment_status)) {
      await this.fulfillOneTimeCheckout(session, paymentRecord);
    }
    return paymentRecord;
  }

  /**
   * Unified helper for payment record insertion with error handling
   * Eliminates duplicate try-catch logic between subscription and one-time payments
   * Handles duplicate key constraint violations gracefully
   * @param paymentData Payment record data (excluding id, createdAt, updatedAt)
   * @param recordType Type for logging ("subscription" or "one-time")
   */
  private async insertPaymentRecord(
    paymentData: Omit<
      typeof payment.$inferInsert,
      'id' | 'createdAt' | 'updatedAt'
    >,
    recordType: string
  ): Promise<Payment> {
    const currentDate = new Date();
    const db = getDb();

    try {
      const id = crypto.randomUUID();
      await db.insert(payment).values({
        id,
        createdAt: currentDate,
        updatedAt: currentDate,
        ...paymentData,
      });
      console.log(`<< Created ${recordType} payment record success`);
      const [created] = await db
        .select()
        .from(payment)
        .where(eq(payment.id, id))
        .limit(1);
      if (!created) throw new Error(`Unable to read new ${recordType} payment`);
      return created;
    } catch (error) {
      if (!isUniqueConstraintError(error)) throw error;
      const conditions = [
        paymentData.sessionId
          ? eq(payment.sessionId, paymentData.sessionId)
          : undefined,
        paymentData.subscriptionId
          ? eq(payment.subscriptionId, paymentData.subscriptionId)
          : undefined,
        paymentData.invoiceId
          ? eq(payment.invoiceId, paymentData.invoiceId)
          : undefined,
      ].filter((condition) => condition !== undefined);
      const [existing] = await db
        .select()
        .from(payment)
        .where(or(...conditions))
        .limit(1);
      if (!existing) throw error;
      return existing;
    }
  }

  private requireConfiguredPrice(priceId: string) {
    const plan = findPlanByPriceId(priceId);
    if (!plan) throw new Error(`Unknown Stripe price ${priceId}`);
    const price = findPriceInPlan(plan.id, priceId);
    if (!price) throw new Error(`Unknown Stripe price ${priceId}`);
    return { plan, price };
  }

  private getConfiguredSubscriptionPrice(subscription: Stripe.Subscription) {
    const priceId = subscription.items.data[0]?.price.id;
    if (!priceId) {
      throw new Error(`Subscription ${subscription.id} has no price`);
    }
    const configured = this.requireConfiguredPrice(priceId);
    if (configured.price.type !== PaymentTypes.SUBSCRIPTION) {
      throw new Error(`Stripe price ${priceId} is not a subscription price`);
    }
    return priceId;
  }

  private async resolveCheckoutSubscription(session: Stripe.Checkout.Session) {
    if (
      session.subscription &&
      typeof session.subscription === 'object' &&
      !('deleted' in session.subscription)
    ) {
      return session.subscription;
    }
    const subscriptionId = this.getStripeId(session.subscription);
    if (!subscriptionId) {
      throw new Error(`Checkout session ${session.id} has no subscription`);
    }
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  private async resolveInvoiceSubscription(invoice: Stripe.Invoice) {
    if (
      invoice.subscription &&
      typeof invoice.subscription === 'object' &&
      !('deleted' in invoice.subscription)
    ) {
      return invoice.subscription;
    }
    const subscriptionId = this.extractSubscriptionId(invoice);
    return subscriptionId
      ? this.stripe.subscriptions.retrieve(subscriptionId)
      : null;
  }

  private async upsertSubscriptionPaymentRecord(
    subscription: Stripe.Subscription,
    options: {
      userId?: string;
      customerId?: string;
      sessionId?: string;
      invoiceId?: string | null;
      paid?: boolean;
    } = {}
  ): Promise<Payment> {
    const priceId = this.getConfiguredSubscriptionPrice(subscription);
    const configured = this.requireConfiguredPrice(priceId);
    const customerId =
      options.customerId ?? this.getStripeId(subscription.customer);
    if (!customerId) {
      throw new Error(`Subscription ${subscription.id} has no customer`);
    }
    const userId =
      options.userId ??
      subscription.metadata?.userId ??
      (await this.findUserIdByCustomerId(customerId));
    if (!userId) {
      throw new Error(`No user found for subscription ${subscription.id}`);
    }

    const db = getDb();
    const [existing] = await db
      .select()
      .from(payment)
      .where(eq(payment.subscriptionId, subscription.id))
      .limit(1);
    const now = new Date();
    const values = {
      planId: configured.plan.id,
      priceId,
      userId,
      customerId,
      subscriptionId: subscription.id,
      sessionId: options.sessionId ?? existing?.sessionId ?? null,
      invoiceId: existing?.invoiceId ?? options.invoiceId ?? null,
      type: PaymentTypes.SUBSCRIPTION,
      scene: PaymentScenes.SUBSCRIPTION,
      interval: this.mapStripeIntervalToPlanInterval(subscription),
      status: this.mapSubscriptionStatusToPaymentStatus(subscription.status),
      paid: options.paid ?? existing?.paid ?? false,
      periodStart: this.getPeriodStart(subscription),
      periodEnd: this.getPeriodEnd(subscription),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      updatedAt: now,
    };

    if (existing) {
      await db.update(payment).set(values).where(eq(payment.id, existing.id));
      const [updated] = await db
        .select()
        .from(payment)
        .where(eq(payment.id, existing.id))
        .limit(1);
      if (!updated) throw new Error(`Unable to update payment ${existing.id}`);
      return updated;
    }

    const { updatedAt: _updatedAt, ...insertValues } = values;
    return this.insertPaymentRecord(insertValues, 'subscription');
  }

  private async ensurePaymentTransaction(input: {
    paymentRecord: Payment;
    businessKey: string;
    checkoutSessionId?: string | null;
    paymentIntentId?: string | null;
    invoiceId?: string | null;
    chargeId?: string | null;
    priceId: string;
    amount: number;
    currency: string;
    paymentStatus: typeof paymentTransactions.$inferInsert.paymentStatus;
    fulfillmentStatus: typeof paymentTransactions.$inferInsert.fulfillmentStatus;
    failureMessage?: string | null;
    paidAt?: Date | null;
  }): Promise<PaymentTransaction> {
    const db = getDb();
    const now = new Date();
    await db
      .insert(paymentTransactions)
      .values({
        id: crypto.randomUUID(),
        paymentId: input.paymentRecord.id,
        userId: input.paymentRecord.userId,
        businessKey: input.businessKey,
        checkoutSessionId:
          input.checkoutSessionId ?? input.paymentRecord.sessionId,
        paymentIntentId: input.paymentIntentId,
        invoiceId: input.invoiceId,
        chargeId: input.chargeId,
        priceId: input.priceId,
        amount: input.amount,
        currency: input.currency.toLowerCase(),
        paymentStatus: input.paymentStatus,
        fulfillmentStatus: input.fulfillmentStatus,
        failureMessage: input.failureMessage,
        paidAt: input.paidAt,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing({ target: paymentTransactions.businessKey });

    const [transaction] = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.businessKey, input.businessKey))
      .limit(1);
    if (!transaction) {
      throw new Error(`Unable to create transaction ${input.businessKey}`);
    }
    return transaction;
  }

  private async claimPaymentTransaction(businessKey: string) {
    const db = getDb();
    const now = new Date();
    const staleBefore = new Date(now.getTime() - 5 * 60 * 1000);
    const claimed = await db
      .update(paymentTransactions)
      .set({ fulfillmentStatus: 'processing', updatedAt: now })
      .where(
        and(
          eq(paymentTransactions.businessKey, businessKey),
          or(
            eq(paymentTransactions.fulfillmentStatus, 'pending'),
            eq(paymentTransactions.fulfillmentStatus, 'failed'),
            eq(paymentTransactions.fulfillmentStatus, 'not_applicable'),
            eq(paymentTransactions.fulfillmentStatus, 'revoked'),
            and(
              eq(paymentTransactions.fulfillmentStatus, 'processing'),
              lt(paymentTransactions.updatedAt, staleBefore)
            )
          )
        )
      )
      .returning({ id: paymentTransactions.id });
    if (claimed.length > 0) return true;

    const [existing] = await db
      .select({ fulfillmentStatus: paymentTransactions.fulfillmentStatus })
      .from(paymentTransactions)
      .where(eq(paymentTransactions.businessKey, businessKey))
      .limit(1);
    if (existing?.fulfillmentStatus === 'fulfilled') return false;
    throw new Error(`Transaction ${businessKey} is already processing`);
  }

  private async findOrRecoverOneTimePayment(invoice: Stripe.Invoice) {
    const existing = await this.findPaymentRecord(invoice);
    if (existing?.type === PaymentTypes.ONE_TIME) return existing;

    const paymentIntentId = this.getStripeId(invoice.payment_intent);
    if (!paymentIntentId) return null;
    const sessions = await this.stripe.checkout.sessions.list({
      payment_intent: paymentIntentId,
      limit: 1,
    });
    const session = sessions.data[0];
    return session ? this.createOneTimePaymentRecord(session) : null;
  }

  private getInvoicePaidAt(invoice: Stripe.Invoice) {
    const paidAt = invoice.status_transitions?.paid_at;
    return paidAt ? new Date(paidAt * 1000) : new Date();
  }

  private getStripeId(value: { id: string } | string | null | undefined) {
    if (typeof value === 'string') return value;
    return value?.id ?? null;
  }

  private async findTransactionByPaymentReference(input: {
    paymentIntentId?: string | null;
    chargeId?: string | null;
  }) {
    const conditions = [
      input.paymentIntentId
        ? eq(paymentTransactions.paymentIntentId, input.paymentIntentId)
        : undefined,
      input.chargeId
        ? eq(paymentTransactions.chargeId, input.chargeId)
        : undefined,
    ].filter((condition) => condition !== undefined);
    if (conditions.length === 0) return null;

    const [transaction] = await getDb()
      .select()
      .from(paymentTransactions)
      .where(or(...conditions))
      .orderBy(desc(paymentTransactions.createdAt))
      .limit(1);
    return transaction ?? null;
  }

  private async revokePaymentTransaction(
    transaction: PaymentTransaction,
    status: 'refunded' | 'disputed'
  ) {
    const db = getDb();
    const now = new Date();
    await db
      .update(paymentTransactions)
      .set({
        paymentStatus: status,
        fulfillmentStatus: 'revoked',
        updatedAt: now,
      })
      .where(eq(paymentTransactions.id, transaction.id));

    const [paymentRecord] = await db
      .select({ type: payment.type })
      .from(payment)
      .where(eq(payment.id, transaction.paymentId))
      .limit(1);
    const [newerFulfilledTransaction] =
      paymentRecord?.type === PaymentTypes.SUBSCRIPTION
        ? await db
            .select({ id: paymentTransactions.id })
            .from(paymentTransactions)
            .where(
              and(
                eq(paymentTransactions.paymentId, transaction.paymentId),
                gt(paymentTransactions.createdAt, transaction.createdAt),
                eq(paymentTransactions.fulfillmentStatus, 'fulfilled'),
                or(
                  eq(paymentTransactions.paymentStatus, 'paid'),
                  eq(paymentTransactions.paymentStatus, 'partially_refunded')
                )
              )
            )
            .limit(1)
        : [];
    await db
      .update(payment)
      .set({
        paid: Boolean(newerFulfilledTransaction),
        updatedAt: now,
      })
      .where(eq(payment.id, transaction.paymentId));
  }

  private async onRefundCreated(refund: Stripe.Refund) {
    if (refund.status !== 'succeeded') {
      console.log(
        `Ignoring refund ${refund.id} until Stripe marks it succeeded`
      );
      return;
    }
    const transaction = await this.findTransactionByPaymentReference({
      paymentIntentId: this.getStripeId(refund.payment_intent),
      chargeId: this.getStripeId(refund.charge),
    });
    if (!transaction) {
      console.warn(`No local transaction found for refund ${refund.id}`);
      return;
    }
    if (refund.amount >= transaction.amount) {
      await this.revokePaymentTransaction(transaction, 'refunded');
      return;
    }
    await getDb()
      .update(paymentTransactions)
      .set({ paymentStatus: 'partially_refunded', updatedAt: new Date() })
      .where(eq(paymentTransactions.id, transaction.id));
  }

  private async onChargeRefunded(charge: Stripe.Charge) {
    const transaction = await this.findTransactionByPaymentReference({
      paymentIntentId: this.getStripeId(charge.payment_intent),
      chargeId: charge.id,
    });
    if (!transaction) {
      console.warn(`No local transaction found for charge ${charge.id}`);
      return;
    }
    if (charge.refunded || charge.amount_refunded >= transaction.amount) {
      await this.revokePaymentTransaction(transaction, 'refunded');
      return;
    }
    await getDb()
      .update(paymentTransactions)
      .set({ paymentStatus: 'partially_refunded', updatedAt: new Date() })
      .where(eq(paymentTransactions.id, transaction.id));
  }

  private async onDisputeCreated(dispute: Stripe.Dispute) {
    const transaction = await this.findTransactionByPaymentReference({
      paymentIntentId: this.getStripeId(dispute.payment_intent),
      chargeId: this.getStripeId(dispute.charge),
    });
    if (!transaction) {
      console.warn(`No local transaction found for dispute ${dispute.id}`);
      return;
    }
    await this.revokePaymentTransaction(transaction, 'disputed');
  }

  private async onDisputeResolved(dispute: Stripe.Dispute) {
    if (dispute.status !== 'won' && dispute.status !== 'warning_closed') return;
    const transaction = await this.findTransactionByPaymentReference({
      paymentIntentId: this.getStripeId(dispute.payment_intent),
      chargeId: this.getStripeId(dispute.charge),
    });
    if (!transaction) {
      console.warn(`No local transaction found for dispute ${dispute.id}`);
      return;
    }

    const db = getDb();
    const [paymentRecord] = await db
      .select()
      .from(payment)
      .where(eq(payment.id, transaction.paymentId))
      .limit(1);
    if (!paymentRecord) return;
    const subscriptionActive =
      paymentRecord.type === PaymentTypes.SUBSCRIPTION &&
      (paymentRecord.status === 'active' ||
        paymentRecord.status === 'trialing') &&
      (!paymentRecord.periodEnd || paymentRecord.periodEnd > new Date());
    const shouldRestore =
      paymentRecord.type === PaymentTypes.ONE_TIME || subscriptionActive;
    const now = new Date();
    await db
      .update(paymentTransactions)
      .set({
        paymentStatus: 'paid',
        fulfillmentStatus: 'fulfilled',
        failureMessage: null,
        updatedAt: now,
      })
      .where(eq(paymentTransactions.id, transaction.id));
    if (shouldRestore) {
      await db
        .update(payment)
        .set({ paid: true, updatedAt: now })
        .where(eq(payment.id, paymentRecord.id));
    }
  }

  public async reconcilePayment(objectId: string): Promise<void> {
    if (objectId.startsWith('in_')) {
      const invoice = await this.stripe.invoices.retrieve(objectId);
      if (invoice.paid || invoice.status === 'paid') {
        await this.onInvoicePaid(invoice);
      } else if (invoice.attempted) {
        await this.onInvoicePaymentFailed(invoice);
      } else {
        throw new Error(`Invoice ${objectId} is not paid`);
      }
      return;
    }

    if (objectId.startsWith('cs_')) {
      const session = await this.stripe.checkout.sessions.retrieve(objectId, {
        expand: ['subscription'],
      });
      await this.onCheckoutCompleted(session);
      const invoiceId = this.getStripeId(session.invoice);
      if (invoiceId) {
        const invoice = await this.stripe.invoices.retrieve(invoiceId, {
          expand: ['subscription'],
        });
        if (invoice.paid || invoice.status === 'paid') {
          await this.onInvoicePaid(invoice);
        }
      }
      return;
    }

    if (objectId.startsWith('pi_')) {
      const intent = await this.stripe.paymentIntents.retrieve(objectId);
      if (intent.status !== 'succeeded') {
        throw new Error(`PaymentIntent ${objectId} is not succeeded`);
      }
      const invoiceId = this.getStripeId(intent.invoice);
      if (invoiceId) {
        await this.reconcilePayment(invoiceId);
        return;
      }
      const sessions = await this.stripe.checkout.sessions.list({
        payment_intent: objectId,
        limit: 1,
      });
      const session = sessions.data[0];
      if (!session) {
        throw new Error(`No Checkout Session found for ${objectId}`);
      }
      await this.onAsyncPaymentSucceeded(session);
      return;
    }

    throw new Error(
      'Use a Stripe Invoice, Checkout Session, or PaymentIntent ID'
    );
  }

  /**
   * Map Stripe subscription interval to our own interval types
   * @param subscription Stripe subscription
   * @returns PlanInterval
   */
  private mapStripeIntervalToPlanInterval(
    subscription: Stripe.Subscription
  ): PlanInterval {
    switch (subscription.items.data[0]?.plan.interval) {
      case 'month':
        return PlanIntervals.MONTH;
      case 'year':
        return PlanIntervals.YEAR;
      default:
        return PlanIntervals.MONTH;
    }
  }

  /**
   * Convert Stripe subscription status to PaymentStatus,
   * we narrow down the status to our own status types
   * @param status Stripe subscription status
   * @returns PaymentStatus
   */
  private mapSubscriptionStatusToPaymentStatus(
    status: Stripe.Subscription.Status
  ): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      active: 'active',
      canceled: 'canceled',
      incomplete: 'incomplete',
      incomplete_expired: 'incomplete_expired',
      past_due: 'past_due',
      trialing: 'trialing',
      unpaid: 'unpaid',
      paused: 'paused',
    };

    return statusMap[status] || 'failed';
  }

  /**
   * Find existing payment record by Invoice
   * @param invoice Stripe invoice
   * @returns Payment record or null if not found
   */
  private extractSubscriptionId(invoice: Stripe.Invoice): string | null {
    const invoiceSubscription = invoice.subscription;
    if (typeof invoiceSubscription === 'string') {
      console.log(`invoice.subscription is string: ${invoiceSubscription}`);
      return invoiceSubscription;
    }
    if (
      invoiceSubscription &&
      typeof invoiceSubscription === 'object' &&
      'id' in invoiceSubscription
    ) {
      console.log(`invoice.subscription is object: ${invoiceSubscription.id}`);
      return invoiceSubscription.id;
    }

    const invoiceAny = invoice as {
      parent?: { subscription_details?: { subscription?: string } };
    };
    if (invoiceAny.parent?.subscription_details?.subscription) {
      const subscriptionId =
        invoiceAny.parent.subscription_details.subscription;
      console.log(
        `invoice.parent.subscription_details.subscription is string: ${subscriptionId}`
      );
      return subscriptionId;
    }

    const lineItems = invoice.lines?.data ?? [];
    for (const lineItem of lineItems) {
      if (typeof lineItem.subscription === 'string') {
        console.log(
          `invoice.lineItem.subscription is string: ${lineItem.subscription}`
        );
        return lineItem.subscription;
      }
      if (
        lineItem.subscription &&
        typeof lineItem.subscription === 'object' &&
        'id' in lineItem.subscription
      ) {
        console.log(
          `invoice.lineItem.subscription is object: ${lineItem.subscription.id}`
        );
        return lineItem.subscription.id;
      }

      const lineItemAny = lineItem as {
        parent?: { subscription_item_details?: { subscription?: string } };
      };
      if (lineItemAny.parent?.subscription_item_details?.subscription) {
        const subscriptionId =
          lineItemAny.parent.subscription_item_details.subscription;
        console.log(
          `invoice.lineItem.parent.subscription_item_details.subscription is string: ${subscriptionId}`
        );
        return subscriptionId;
      }
    }

    return null;
  }

  private getPeriodStart(subscription: Stripe.Subscription): Date | undefined {
    const s = subscription as Stripe.Subscription & {
      current_period_start?: number;
      items?: { data?: { current_period_start?: number }[] };
    };
    const startUnix =
      s.current_period_start ??
      s?.items?.data?.[0]?.current_period_start ??
      undefined;
    return typeof startUnix === 'number'
      ? new Date(startUnix * 1000)
      : undefined;
  }

  private getPeriodEnd(subscription: Stripe.Subscription): Date | undefined {
    const s = subscription as Stripe.Subscription & {
      current_period_end?: number;
      items?: { data?: { current_period_end?: number }[] };
    };
    const endUnix =
      s.current_period_end ??
      s?.items?.data?.[0]?.current_period_end ??
      undefined;
    return typeof endUnix === 'number' ? new Date(endUnix * 1000) : undefined;
  }

  /**
   * Map application locale to Stripe's supported locale values.
   */
  private mapLocaleToStripeLocale(
    locale: string
  ): Stripe.Checkout.SessionCreateParams.Locale {
    const stripeLocales = [
      'bg',
      'cs',
      'da',
      'de',
      'el',
      'en',
      'es',
      'et',
      'fi',
      'fil',
      'fr',
      'hr',
      'hu',
      'id',
      'it',
      'ja',
      'ko',
      'lt',
      'lv',
      'ms',
      'mt',
      'nb',
      'nl',
      'pl',
      'pt',
      'ro',
      'ru',
      'sk',
      'sl',
      'sv',
      'th',
      'tr',
      'vi',
      'zh',
    ] as const;

    if (stripeLocales.some((supported) => supported === locale)) {
      return locale as Stripe.Checkout.SessionCreateParams.Locale;
    }

    const baseLocale = locale.split('-')[0];
    if (stripeLocales.some((supported) => supported === baseLocale)) {
      return baseLocale as Stripe.Checkout.SessionCreateParams.Locale;
    }

    return 'auto';
  }
}
