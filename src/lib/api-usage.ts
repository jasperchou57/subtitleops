import { getDb } from '@/db';
import { productionApiUsage } from '@/db/app.schema';
import { lt, sql } from 'drizzle-orm';

export const PRODUCTION_API_DAILY_LIMIT = 1000;
const USAGE_RETENTION_DAYS = 35;

export type ProductionApiQuota = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter: number;
};

export function getProductionApiUsageDate(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

function getNextUtcMidnight(now: Date) {
  return Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1) /
      1000
  );
}

export async function consumeProductionApiQuota(
  userId: string,
  now = new Date()
): Promise<ProductionApiQuota> {
  const db = getDb();
  const usageDate = getProductionApiUsageDate(now);
  const [usage] = await db
    .insert(productionApiUsage)
    .values({
      userId,
      usageDate,
      requestCount: 1,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [productionApiUsage.userId, productionApiUsage.usageDate],
      set: {
        requestCount: sql`${productionApiUsage.requestCount} + 1`,
        updatedAt: now,
      },
      setWhere: lt(productionApiUsage.requestCount, PRODUCTION_API_DAILY_LIMIT),
    })
    .returning({ requestCount: productionApiUsage.requestCount });

  const resetAt = getNextUtcMidnight(now);
  const allowed = usage !== undefined;
  const requestCount = usage?.requestCount ?? PRODUCTION_API_DAILY_LIMIT;

  return {
    allowed,
    limit: PRODUCTION_API_DAILY_LIMIT,
    remaining: Math.max(0, PRODUCTION_API_DAILY_LIMIT - requestCount),
    resetAt,
    retryAfter: Math.max(1, resetAt - Math.floor(now.getTime() / 1000)),
  };
}

export async function purgeOldProductionApiUsage(now = new Date()) {
  const cutoff = new Date(
    now.getTime() - USAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000
  );
  await getDb()
    .delete(productionApiUsage)
    .where(lt(productionApiUsage.usageDate, getProductionApiUsageDate(cutoff)));
}
