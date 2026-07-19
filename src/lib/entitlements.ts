import { getDb } from '@/db';
import { payment } from '@/db/app.schema';
import { findPlanByPriceId } from '@/lib/price-plan';
import { and, desc, eq } from 'drizzle-orm';
import {
  resolveEntitlement,
  type PaymentEntitlementRecord,
} from './entitlement-policy';

export * from './entitlement-policy';

export async function getUserEntitlement(userId: string) {
  const records = await getDb()
    .select({
      planId: payment.planId,
      priceId: payment.priceId,
      type: payment.type,
      scene: payment.scene,
      status: payment.status,
      paid: payment.paid,
      periodEnd: payment.periodEnd,
    })
    .from(payment)
    .where(and(eq(payment.userId, userId), eq(payment.paid, true)))
    .orderBy(desc(payment.createdAt));

  const resolvedRecords: PaymentEntitlementRecord[] = records.map((record) => ({
    ...record,
    planId: record.planId ?? findPlanByPriceId(record.priceId)?.id ?? null,
  }));
  return resolveEntitlement(resolvedRecords);
}
