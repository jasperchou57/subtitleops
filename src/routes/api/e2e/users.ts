import { createFileRoute } from '@tanstack/react-router';
import { eq, inArray, like } from 'drizzle-orm';
import { getDb } from '@/db';
import { account, session, user } from '@/db/auth.schema';
import { payment, productionApiUsage, userFiles } from '@/db/app.schema';
import { getProductionApiUsageDate } from '@/lib/api-usage';
import { getUserEntitlement } from '@/lib/entitlements';
import { auth } from '@/auth/auth';

const TEST_EMAIL_PATTERN = 'e2e-%@example.test';
const TEST_API_SECRET = 'mkfast-e2e-secret';

function assertE2EAccess(request: Request) {
  const requestSecret = request.headers.get('x-e2e-secret');
  const isLocalE2EMode =
    import.meta.env.DEV === true && import.meta.env.MODE === 'e2e';

  if (!isLocalE2EMode || requestSecret !== TEST_API_SECRET) {
    return Response.json({ error: 'Not Found' }, { status: 404 });
  }

  return null;
}

function isE2EEmail(email: string) {
  return email.startsWith('e2e-') && email.endsWith('@example.test');
}

export const Route = createFileRoute('/api/e2e/users')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const accessError = assertE2EAccess(request);
        if (accessError) return accessError;

        const email = new URL(request.url).searchParams.get('email') ?? '';
        if (!isE2EEmail(email)) {
          return Response.json(
            { error: 'Invalid test email' },
            { status: 400 }
          );
        }

        const [userRow] = await getDb()
          .select({ id: user.id, email: user.email })
          .from(user)
          .where(eq(user.email, email))
          .limit(1);
        if (!userRow) {
          return Response.json({ error: 'User not found' }, { status: 404 });
        }

        const [paymentRow] = await getDb()
          .select({
            planId: payment.planId,
            priceId: payment.priceId,
            status: payment.status,
            cancelAtPeriodEnd: payment.cancelAtPeriodEnd,
            periodEnd: payment.periodEnd,
          })
          .from(payment)
          .where(eq(payment.userId, userRow.id))
          .limit(1);
        const entitlement = await getUserEntitlement(userRow.id);
        return Response.json({
          user: userRow,
          payment: paymentRow ?? null,
          entitlement,
        });
      },
      POST: async ({ request }) => {
        const accessError = assertE2EAccess(request);
        if (accessError) return accessError;

        const body = (await request.json()) as { email?: unknown };
        const email = typeof body.email === 'string' ? body.email : '';
        if (!isE2EEmail(email)) {
          return Response.json(
            { error: 'Invalid test email' },
            { status: 400 }
          );
        }

        const [userRow] = await getDb()
          .select({ id: user.id })
          .from(user)
          .where(eq(user.email, email))
          .limit(1);
        if (!userRow) {
          return Response.json({ error: 'User not found' }, { status: 404 });
        }

        const apiKey = await auth.api.createApiKey({
          body: { name: 'E2E production API', userId: userRow.id },
        });
        return Response.json({ apiKey: apiKey.key });
      },
      PATCH: async ({ request }) => {
        const accessError = assertE2EAccess(request);
        if (accessError) return accessError;

        const body = (await request.json()) as {
          email?: unknown;
          emailVerified?: unknown;
          planId?: unknown;
          role?: unknown;
          subscriptionStatus?: unknown;
          cancelAtPeriodEnd?: unknown;
          apiUsageCount?: unknown;
        };
        const email = typeof body.email === 'string' ? body.email : '';

        if (!isE2EEmail(email)) {
          return Response.json(
            { error: 'Invalid test email' },
            { status: 400 }
          );
        }

        const updates: {
          emailVerified?: boolean;
          role?: string | null;
          updatedAt: Date;
        } = { updatedAt: new Date() };

        if (typeof body.emailVerified === 'boolean') {
          updates.emailVerified = body.emailVerified;
        }
        if (
          body.role === null ||
          body.role === 'admin' ||
          body.role === 'user'
        ) {
          updates.role = body.role === 'user' ? null : body.role;
        }

        const [updatedUser] = await getDb()
          .update(user)
          .set(updates)
          .where(eq(user.email, email))
          .returning({
            id: user.id,
            email: user.email,
            emailVerified: user.emailVerified,
            role: user.role,
          });

        if (!updatedUser) {
          return Response.json({ error: 'User not found' }, { status: 404 });
        }

        const requestedPlan =
          body.planId === 'free' ||
          body.planId === 'pro' ||
          body.planId === 'studio'
            ? body.planId
            : null;

        if (requestedPlan) {
          const db = getDb();
          await db.delete(payment).where(eq(payment.userId, updatedUser.id));

          if (requestedPlan !== 'free') {
            const now = new Date();
            const subscriptionStatus =
              body.subscriptionStatus === 'trialing' ||
              body.subscriptionStatus === 'canceled' ||
              body.subscriptionStatus === 'past_due'
                ? body.subscriptionStatus
                : 'active';
            await db.insert(payment).values({
              id: crypto.randomUUID(),
              planId: requestedPlan,
              priceId: `e2e_${requestedPlan}_monthly`,
              userId: updatedUser.id,
              customerId: `e2e_customer_${updatedUser.id}`,
              subscriptionId: `e2e_subscription_${updatedUser.id}`,
              type: 'subscription',
              scene: 'subscription',
              interval: 'month',
              status: subscriptionStatus,
              paid: true,
              periodStart: now,
              periodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
              cancelAtPeriodEnd: body.cancelAtPeriodEnd === true,
              createdAt: now,
              updatedAt: now,
            });
          }

          const entitlement = await getUserEntitlement(updatedUser.id);
          if (
            typeof body.apiUsageCount === 'number' &&
            Number.isInteger(body.apiUsageCount) &&
            body.apiUsageCount >= 0
          ) {
            const now = new Date();
            await db
              .insert(productionApiUsage)
              .values({
                userId: updatedUser.id,
                usageDate: getProductionApiUsageDate(now),
                requestCount: body.apiUsageCount,
                updatedAt: now,
              })
              .onConflictDoUpdate({
                target: [
                  productionApiUsage.userId,
                  productionApiUsage.usageDate,
                ],
                set: {
                  requestCount: body.apiUsageCount,
                  updatedAt: now,
                },
              });
          }
          return Response.json({ user: updatedUser, entitlement });
        }

        return Response.json({ user: updatedUser });
      },
      DELETE: async ({ request }) => {
        const accessError = assertE2EAccess(request);
        if (accessError) return accessError;

        const db = getDb();
        const rows = await db
          .select({ id: user.id })
          .from(user)
          .where(like(user.email, TEST_EMAIL_PATTERN));
        const userIds = rows.map((row) => row.id);

        if (userIds.length === 0) {
          return Response.json({ deleted: 0 });
        }

        await db.delete(session).where(inArray(session.userId, userIds));
        await db.delete(account).where(inArray(account.userId, userIds));
        await db.delete(payment).where(inArray(payment.userId, userIds));
        await db.delete(userFiles).where(inArray(userFiles.userId, userIds));
        await db.delete(user).where(inArray(user.id, userIds));

        return Response.json({ deleted: userIds.length });
      },
    },
  },
});
