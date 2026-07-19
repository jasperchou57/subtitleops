import { beforeEach, describe, expect, it, vi } from 'vitest';

const { deleteMock, retrieveMock } = vi.hoisted(() => ({
  deleteMock: vi.fn().mockResolvedValue({ deleted: true }),
  retrieveMock: vi.fn(),
}));

vi.mock('stripe', () => ({
  Stripe: class {
    static errors = {
      StripeInvalidRequestError: class extends Error {},
    };

    customers = {
      del: deleteMock,
      retrieve: retrieveMock,
    };
  },
}));

vi.mock('../config/website', () => ({
  websiteConfig: {
    payment: {
      provider: 'stripe',
    },
  },
}));

vi.mock('../env/server', () => ({
  serverEnv: {
    STRIPE_SECRET_KEY: 'sk_test_account_deletion',
  },
}));

import { deletePaymentCustomer } from './account-deletion';

describe('deletePaymentCustomer', () => {
  beforeEach(() => {
    deleteMock.mockClear();
    retrieveMock.mockReset();
  });

  it('does nothing when the user has no billing profile', async () => {
    await deletePaymentCustomer(null);

    expect(retrieveMock).not.toHaveBeenCalled();
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('deletes an active Stripe customer', async () => {
    retrieveMock.mockResolvedValue({ id: 'cus_active' });

    await deletePaymentCustomer('cus_active');

    expect(deleteMock).toHaveBeenCalledWith('cus_active');
  });

  it('is safe to retry after the Stripe customer was already deleted', async () => {
    retrieveMock.mockResolvedValue({ id: 'cus_deleted', deleted: true });

    await deletePaymentCustomer('cus_deleted');

    expect(deleteMock).not.toHaveBeenCalled();
  });
});
