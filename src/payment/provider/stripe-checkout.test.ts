import { describe, expect, it } from 'vitest';
import { isCheckoutSessionPaid } from './stripe-checkout';

describe('Stripe checkout payment status', () => {
  it('unlocks completed paid checkouts', () => {
    expect(isCheckoutSessionPaid('paid')).toBe(true);
  });

  it('unlocks checkouts that require no payment', () => {
    expect(isCheckoutSessionPaid('no_payment_required')).toBe(true);
  });

  it('keeps asynchronous unpaid checkouts locked', () => {
    expect(isCheckoutSessionPaid('unpaid')).toBe(false);
  });
});
