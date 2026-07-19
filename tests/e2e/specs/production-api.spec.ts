import { expect, test } from '@playwright/test';
import {
  cleanupE2EUsers,
  createE2EApiKey,
  registerE2EUser,
  updateE2EUser,
} from '../fixtures/auth';

const input = `1
00:00:01,000 --> 00:00:03,000
API conversion
`;

test.describe('production conversion API', () => {
  test.beforeEach(async ({ request }) => cleanupE2EUsers(request));
  test.afterEach(async ({ request }) => cleanupE2EUsers(request));

  test('rejects missing keys and non-Studio plans', async ({ request }) => {
    const missing = await request.post('/api/v1/convert', {
      data: { content: input, filename: 'input.srt', outputFormat: 'vtt' },
    });
    expect(missing.status()).toBe(401);

    const user = await registerE2EUser(request);
    await updateE2EUser(request, { email: user.email, planId: 'pro' });
    const key = await createE2EApiKey(request, user.email);
    const forbidden = await request.post('/api/v1/convert', {
      headers: { 'x-api-key': key },
      data: { content: input, filename: 'input.srt', outputFormat: 'vtt' },
    });
    expect(forbidden.status()).toBe(403);
  });

  test('converts subtitles for Studio API keys', async ({ request }) => {
    const user = await registerE2EUser(request);
    await updateE2EUser(request, { email: user.email, planId: 'studio' });
    const key = await createE2EApiKey(request, user.email);
    const response = await request.post('/api/v1/convert', {
      headers: { Authorization: `Bearer ${key}` },
      data: { content: input, filename: 'input.srt', outputFormat: 'vtt' },
    });

    expect(response.ok(), await response.text()).toBeTruthy();
    const data = (await response.json()) as {
      inputFormat: string;
      outputFormat: string;
      content: string;
      quality: { cueCount: number };
    };
    expect(data).toMatchObject({
      inputFormat: 'srt',
      outputFormat: 'vtt',
      quality: { cueCount: 1 },
    });
    expect(data.content).toContain('WEBVTT');
    expect(response.headers()['x-ratelimit-limit']).toBe('1000');
    expect(response.headers()['x-ratelimit-remaining']).toBe('999');
  });

  test('shares the daily quota across keys and rejects exhausted accounts', async ({
    request,
  }) => {
    const user = await registerE2EUser(request);
    await updateE2EUser(request, { email: user.email, planId: 'studio' });
    const firstKey = await createE2EApiKey(request, user.email);
    const secondKey = await createE2EApiKey(request, user.email);

    const first = await request.post('/api/v1/convert', {
      headers: { 'x-api-key': firstKey },
      data: { content: input, filename: 'input.srt', outputFormat: 'vtt' },
    });
    expect(first.ok(), await first.text()).toBeTruthy();
    expect(first.headers()['x-ratelimit-remaining']).toBe('999');

    const second = await request.post('/api/v1/convert', {
      headers: { 'x-api-key': secondKey },
      data: { content: input, filename: 'input.srt', outputFormat: 'vtt' },
    });
    expect(second.ok(), await second.text()).toBeTruthy();
    expect(second.headers()['x-ratelimit-remaining']).toBe('998');

    await updateE2EUser(request, {
      email: user.email,
      planId: 'studio',
      apiUsageCount: 1000,
    });
    const exhausted = await request.post('/api/v1/convert', {
      headers: { 'x-api-key': firstKey },
      data: { content: input, filename: 'input.srt', outputFormat: 'vtt' },
    });
    expect(exhausted.status()).toBe(429);
    expect(exhausted.headers()['x-ratelimit-remaining']).toBe('0');
    expect(Number(exhausted.headers()['retry-after'])).toBeGreaterThan(0);
    await expect(exhausted.json()).resolves.toMatchObject({
      code: 'RATE_LIMIT_EXCEEDED',
    });
  });
});
