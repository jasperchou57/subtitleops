import { getDb } from '@/db';
import {
  payment,
  paymentTransactions,
  stripeWebhookEvents,
} from '@/db/app.schema';
import { user } from '@/db/auth.schema';
import { adminApiMiddleware } from '@/middlewares/admin-middleware';
import { reconcilePayment } from '@/payment';
import { createServerFn } from '@tanstack/react-start';
import { count as countFn, desc, eq, or, sql } from 'drizzle-orm';
import { z } from 'zod';

const listPaymentReconciliationSchema = z.object({
  pageIndex: z.number().int().min(0),
  pageSize: z.number().int().min(1).max(100),
  search: z.string().max(200),
});

export const listPaymentReconciliation = createServerFn({ method: 'GET' })
  .inputValidator(listPaymentReconciliationSchema)
  .middleware([adminApiMiddleware])
  .handler(async ({ data }) => {
    const db = getDb();
    const search = data.search.trim();
    const escaped = search
      .replace(/\\/g, '\\\\')
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_');
    const pattern = `%${escaped}%`;
    const where = search
      ? or(
          sql`lower(${user.email}) like lower(${pattern}) escape '\\'`,
          sql`lower(${paymentTransactions.userId}) like lower(${pattern}) escape '\\'`,
          sql`lower(${payment.customerId}) like lower(${pattern}) escape '\\'`,
          sql`lower(${payment.sessionId}) like lower(${pattern}) escape '\\'`,
          sql`lower(${payment.subscriptionId}) like lower(${pattern}) escape '\\'`,
          sql`lower(${paymentTransactions.invoiceId}) like lower(${pattern}) escape '\\'`,
          sql`lower(${paymentTransactions.paymentIntentId}) like lower(${pattern}) escape '\\'`,
          sql`lower(${paymentTransactions.chargeId}) like lower(${pattern}) escape '\\'`,
          sql`lower(${paymentTransactions.businessKey}) like lower(${pattern}) escape '\\'`
        )
      : undefined;

    const baseQuery = db
      .select({
        transactionId: paymentTransactions.id,
        businessKey: paymentTransactions.businessKey,
        userId: paymentTransactions.userId,
        email: user.email,
        planId: payment.planId,
        customerId: payment.customerId,
        subscriptionId: payment.subscriptionId,
        checkoutSessionId: paymentTransactions.checkoutSessionId,
        invoiceId: paymentTransactions.invoiceId,
        paymentIntentId: paymentTransactions.paymentIntentId,
        chargeId: paymentTransactions.chargeId,
        priceId: paymentTransactions.priceId,
        amount: paymentTransactions.amount,
        currency: paymentTransactions.currency,
        paymentStatus: paymentTransactions.paymentStatus,
        fulfillmentStatus: paymentTransactions.fulfillmentStatus,
        failureMessage: paymentTransactions.failureMessage,
        paidAt: paymentTransactions.paidAt,
        fulfilledAt: paymentTransactions.fulfilledAt,
        createdAt: paymentTransactions.createdAt,
        updatedAt: paymentTransactions.updatedAt,
      })
      .from(paymentTransactions)
      .innerJoin(payment, eq(paymentTransactions.paymentId, payment.id))
      .innerJoin(user, eq(paymentTransactions.userId, user.id))
      .where(where);
    const countQuery = db
      .select({ count: countFn() })
      .from(paymentTransactions)
      .innerJoin(payment, eq(paymentTransactions.paymentId, payment.id))
      .innerJoin(user, eq(paymentTransactions.userId, user.id))
      .where(where);

    const eventWhere = search
      ? or(
          sql`lower(${stripeWebhookEvents.id}) like lower(${pattern}) escape '\\'`,
          sql`lower(${stripeWebhookEvents.objectId}) like lower(${pattern}) escape '\\'`,
          sql`lower(${stripeWebhookEvents.eventType}) like lower(${pattern}) escape '\\'`
        )
      : undefined;
    const [items, [{ count }], events] = await Promise.all([
      baseQuery
        .orderBy(desc(paymentTransactions.createdAt))
        .limit(data.pageSize)
        .offset(data.pageIndex * data.pageSize),
      countQuery,
      db
        .select()
        .from(stripeWebhookEvents)
        .where(eventWhere)
        .orderBy(desc(stripeWebhookEvents.receivedAt))
        .limit(search ? 20 : 5),
    ]);

    return { items, total: Number(count), events };
  });

const reconcilePaymentSchema = z.object({
  objectId: z
    .string()
    .trim()
    .regex(/^(in|cs|pi)_[A-Za-z0-9_]+$/, {
      message: 'Use a Stripe Invoice, Checkout Session, or PaymentIntent ID.',
    }),
});

export const reconcileStripePayment = createServerFn({ method: 'POST' })
  .inputValidator(reconcilePaymentSchema)
  .middleware([adminApiMiddleware])
  .handler(async ({ data }) => {
    await reconcilePayment(data.objectId);
    return { reconciled: true, objectId: data.objectId };
  });
