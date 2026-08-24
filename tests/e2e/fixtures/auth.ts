import { expect, type APIRequestContext, type Page } from '@playwright/test';
import { E2E_TEST_SECRET, type E2EUser, createE2EUser } from './test-data';

const e2eHeaders = {
  'x-e2e-secret': E2E_TEST_SECRET,
};

export async function cleanupE2EUsers(request: APIRequestContext) {
  const response = await request.delete('/api/e2e/users', {
    headers: e2eHeaders,
  });

  expect(response.status()).toBeLessThan(500);
}

export async function registerE2EUser(
  request: APIRequestContext,
  overrides: Partial<E2EUser> = {}
) {
  const user = createE2EUser(overrides);
  const origin = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3302';
  const response = await request.post('/api/auth/sign-up/email', {
    headers: {
      Origin: origin,
      Referer: `${origin}/auth/register`,
    },
    data: {
      email: user.email,
      password: user.password,
      name: user.name,
      callbackURL: '/dashboard',
    },
  });

  expect(response.ok(), await response.text()).toBeTruthy();

  await updateE2EUser(request, {
    email: user.email,
    emailVerified: true,
    role: user.role ?? 'user',
  });

  return user;
}

export async function updateE2EUser(
  request: APIRequestContext,
  data: {
    email: string;
    emailVerified?: boolean;
    planId?: 'free' | 'pro' | 'studio';
    role?: 'admin' | 'user' | null;
    subscriptionStatus?: 'active' | 'trialing' | 'canceled' | 'past_due';
    cancelAtPeriodEnd?: boolean;
    apiUsageCount?: number;
  }
) {
  const response = await request.patch('/api/e2e/users', {
    headers: e2eHeaders,
    data,
  });

  expect(response.ok(), await response.text()).toBeTruthy();
  return response.json() as Promise<{
    entitlement: {
      planId: 'free' | 'pro' | 'studio';
      batchFileLimit: number;
      seatLimit: number;
      historyDays: number;
      sharedWorkspace: boolean;
    };
  }>;
}

export async function createE2EApiKey(
  request: APIRequestContext,
  email: string
) {
  const response = await request.post('/api/e2e/users', {
    headers: e2eHeaders,
    data: { email },
  });
  expect(response.ok(), await response.text()).toBeTruthy();
  const data = (await response.json()) as { apiKey: string };
  return data.apiKey;
}

export async function getE2EUserState(
  request: APIRequestContext,
  email: string
) {
  const response = await request.get('/api/e2e/users', {
    headers: e2eHeaders,
    params: { email },
  });
  expect(response.ok(), await response.text()).toBeTruthy();
  return response.json() as Promise<{
    user: { id: string; email: string };
    payment: {
      planId: string | null;
      priceId: string;
      status: string;
      paid: boolean;
      cancelAtPeriodEnd: boolean | null;
      periodEnd: string | null;
    } | null;
    entitlement: {
      planId: 'free' | 'pro' | 'studio';
      batchFileLimit: number;
    };
    transactions: Array<{
      businessKey: string;
      paymentStatus: string;
      fulfillmentStatus: string;
      invoiceId: string | null;
      paymentIntentId: string | null;
      chargeId: string | null;
    }>;
    webhookEvents: Array<{
      id: string;
      eventType: string;
      status: string;
      attempts: number;
    }>;
  }>;
}

export async function loginByForm(page: Page, user: E2EUser) {
  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');
  await page.locator('input[name="email"]').fill(user.email);
  await page.locator('input[name="password"]').fill(user.password);
  const signInButton = page.getByRole('button', {
    name: /^sign in$|^登录$/i,
  });
  await expect(signInButton).toBeEnabled();
  await signInButton.click();
  await expect(page).toHaveURL(/\/dashboard\/?$/);
}
