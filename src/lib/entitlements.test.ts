import { describe, expect, it } from 'vitest';
import {
  isPlanAtLeast,
  PLAN_ENTITLEMENTS,
  resolveEntitlement,
} from './entitlement-policy';

const now = new Date('2026-07-15T12:00:00.000Z');

function paymentRecord(
  overrides: Partial<Parameters<typeof resolveEntitlement>[0][number]> = {}
) {
  return {
    planId: 'pro',
    type: 'subscription',
    scene: 'subscription',
    status: 'active',
    paid: true,
    periodEnd: new Date('2026-08-15T12:00:00.000Z'),
    ...overrides,
  };
}

describe('plan entitlements', () => {
  it('defaults to free without an active payment', () => {
    expect(resolveEntitlement([], now)).toEqual(PLAN_ENTITLEMENTS.free);
  });

  it('grants Pro for an active paid subscription', () => {
    expect(resolveEntitlement([paymentRecord()], now)).toEqual(
      PLAN_ENTITLEMENTS.pro
    );
  });

  it('grants the highest active plan', () => {
    expect(
      resolveEntitlement(
        [paymentRecord(), paymentRecord({ planId: 'studio' })],
        now
      )
    ).toEqual(PLAN_ENTITLEMENTS.studio);
  });

  it('ignores canceled, unpaid, and expired subscriptions', () => {
    const records = [
      paymentRecord({ status: 'canceled' }),
      paymentRecord({ paid: false }),
      paymentRecord({ periodEnd: new Date('2026-06-01T00:00:00.000Z') }),
    ];
    expect(resolveEntitlement(records, now)).toEqual(PLAN_ENTITLEMENTS.free);
  });

  it('uses plan hierarchy for server-side authorization', () => {
    expect(isPlanAtLeast('studio', 'pro')).toBe(true);
    expect(isPlanAtLeast('pro', 'studio')).toBe(false);
  });
});
