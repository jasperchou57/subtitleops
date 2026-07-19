export type ProductPlanId = 'free' | 'pro' | 'studio';

export type PlanEntitlement = {
  planId: ProductPlanId;
  batchFileLimit: number;
  seatLimit: number;
  historyDays: number;
  savedPresets: boolean;
  qualityChecks: boolean;
  sharedWorkspace: boolean;
  reviewWorkflow: boolean;
  productionApi: boolean;
};

export const PLAN_ENTITLEMENTS: Record<ProductPlanId, PlanEntitlement> = {
  free: {
    planId: 'free',
    batchFileLimit: 1,
    seatLimit: 1,
    historyDays: 0,
    savedPresets: false,
    qualityChecks: false,
    sharedWorkspace: false,
    reviewWorkflow: false,
    productionApi: false,
  },
  pro: {
    planId: 'pro',
    batchFileLimit: 100,
    seatLimit: 1,
    historyDays: 180,
    savedPresets: true,
    qualityChecks: true,
    sharedWorkspace: false,
    reviewWorkflow: false,
    productionApi: false,
  },
  studio: {
    planId: 'studio',
    batchFileLimit: 500,
    seatLimit: 3,
    historyDays: 365,
    savedPresets: true,
    qualityChecks: true,
    sharedWorkspace: true,
    reviewWorkflow: true,
    productionApi: true,
  },
};

const PLAN_RANK: Record<ProductPlanId, number> = {
  free: 0,
  pro: 1,
  studio: 2,
};

export type PaymentEntitlementRecord = {
  planId: string | null;
  type: string;
  scene: string | null;
  status: string;
  paid: boolean;
  periodEnd: Date | null;
};

function normalizePlanId(value: string | null | undefined): ProductPlanId {
  if (value === 'pro' || value === 'studio') return value;
  return 'free';
}

function isActivePayment(record: PaymentEntitlementRecord, now: Date) {
  if (!record.paid) return false;
  if (
    record.type === 'one_time' &&
    record.scene === 'lifetime' &&
    record.status === 'completed'
  ) {
    return true;
  }
  if (record.type !== 'subscription') return false;
  if (record.status !== 'active' && record.status !== 'trialing') return false;
  return !record.periodEnd || record.periodEnd.getTime() > now.getTime();
}

export function resolveEntitlement(
  records: PaymentEntitlementRecord[],
  now = new Date()
): PlanEntitlement {
  let resolvedPlan: ProductPlanId = 'free';

  for (const record of records) {
    if (!isActivePayment(record, now)) continue;
    const planId = normalizePlanId(record.planId);
    if (PLAN_RANK[planId] > PLAN_RANK[resolvedPlan]) resolvedPlan = planId;
  }

  return PLAN_ENTITLEMENTS[resolvedPlan];
}

export function isPlanAtLeast(
  currentPlan: ProductPlanId,
  requiredPlan: ProductPlanId
) {
  return PLAN_RANK[currentPlan] >= PLAN_RANK[requiredPlan];
}
