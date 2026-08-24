import { getDb } from '@/db';
import { stripeWebhookEvents } from '@/db/app.schema';
import { and, eq, lt, or, sql } from 'drizzle-orm';
import type { Stripe } from 'stripe';

const PROCESSING_LEASE_MS = 5 * 60 * 1000;

function getEventObjectId(event: Stripe.Event) {
  const object = event.data.object as { id?: unknown };
  return typeof object.id === 'string' ? object.id : null;
}

/**
 * Atomically claim a verified event. A concurrently processing duplicate gets
 * a retryable error; a completed duplicate is acknowledged without re-running
 * business logic; failed or stale claims can be retried safely.
 */
export async function beginStripeWebhookEvent(event: Stripe.Event) {
  const db = getDb();
  const now = new Date();
  const inserted = await db
    .insert(stripeWebhookEvents)
    .values({
      id: event.id,
      eventType: event.type,
      objectId: getEventObjectId(event),
      status: 'processing',
      livemode: event.livemode,
      attempts: 1,
      receivedAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing({ target: stripeWebhookEvents.id })
    .returning({ id: stripeWebhookEvents.id });

  if (inserted.length > 0) return true;

  const [existing] = await db
    .select()
    .from(stripeWebhookEvents)
    .where(eq(stripeWebhookEvents.id, event.id))
    .limit(1);
  if (!existing) throw new Error(`Unable to claim Stripe event ${event.id}`);
  if (existing.status === 'succeeded') return false;

  const staleBefore = new Date(now.getTime() - PROCESSING_LEASE_MS);
  const claimed = await db
    .update(stripeWebhookEvents)
    .set({
      status: 'processing',
      attempts: sql`${stripeWebhookEvents.attempts} + 1`,
      lastError: null,
      updatedAt: now,
    })
    .where(
      and(
        eq(stripeWebhookEvents.id, event.id),
        or(
          eq(stripeWebhookEvents.status, 'failed'),
          and(
            eq(stripeWebhookEvents.status, 'processing'),
            lt(stripeWebhookEvents.updatedAt, staleBefore)
          )
        )
      )
    )
    .returning({ id: stripeWebhookEvents.id });

  if (claimed.length === 0) {
    throw new Error(`Stripe event ${event.id} is already processing`);
  }
  return true;
}

export async function completeStripeWebhookEvent(eventId: string) {
  const now = new Date();
  await getDb()
    .update(stripeWebhookEvents)
    .set({
      status: 'succeeded',
      lastError: null,
      processedAt: now,
      updatedAt: now,
    })
    .where(eq(stripeWebhookEvents.id, eventId));
}

export async function failStripeWebhookEvent(eventId: string, error: unknown) {
  const message =
    error instanceof Error ? error.message.slice(0, 1000) : 'Unknown error';
  await getDb()
    .update(stripeWebhookEvents)
    .set({
      status: 'failed',
      lastError: message,
      updatedAt: new Date(),
    })
    .where(eq(stripeWebhookEvents.id, eventId));
}
