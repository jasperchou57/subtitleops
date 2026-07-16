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
  });
});
