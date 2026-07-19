import { expect, test } from '@playwright/test';
import {
  cleanupE2EUsers,
  registerE2EUser,
  updateE2EUser,
} from '../fixtures/auth';

test.describe('subscription entitlements', () => {
  test.beforeEach(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test.afterEach(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test('upgrades and downgrades the same account', async ({ request }) => {
    const user = await registerE2EUser(request);

    const free = await updateE2EUser(request, {
      email: user.email,
      planId: 'free',
    });
    expect(free.entitlement).toMatchObject({
      planId: 'free',
      batchFileLimit: 1,
      seatLimit: 1,
      historyDays: 0,
      sharedWorkspace: false,
    });

    const pro = await updateE2EUser(request, {
      email: user.email,
      planId: 'pro',
    });
    expect(pro.entitlement).toMatchObject({
      planId: 'pro',
      batchFileLimit: 100,
      seatLimit: 1,
      historyDays: 180,
      sharedWorkspace: false,
    });

    const studio = await updateE2EUser(request, {
      email: user.email,
      planId: 'studio',
    });
    expect(studio.entitlement).toMatchObject({
      planId: 'studio',
      batchFileLimit: 500,
      seatLimit: 3,
      historyDays: 365,
      sharedWorkspace: true,
    });

    const cancelScheduled = await updateE2EUser(request, {
      email: user.email,
      planId: 'studio',
      subscriptionStatus: 'active',
      cancelAtPeriodEnd: true,
    });
    expect(cancelScheduled.entitlement.planId).toBe('studio');

    const canceled = await updateE2EUser(request, {
      email: user.email,
      planId: 'studio',
      subscriptionStatus: 'canceled',
    });
    expect(canceled.entitlement.planId).toBe('free');

    const downgraded = await updateE2EUser(request, {
      email: user.email,
      planId: 'free',
    });
    expect(downgraded.entitlement.planId).toBe('free');
    expect(downgraded.entitlement.batchFileLimit).toBe(1);
  });
});
