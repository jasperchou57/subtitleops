import { expect, test } from '@playwright/test';
import {
  expectHealthyPage,
  installPageHealthMonitor,
} from '../fixtures/page-health';

const publicPages = [
  '/',
  '/tools',
  '/pricing',
  '/tools/ass-to-srt',
  '/tools/vtt-to-srt',
  '/tools/txt-to-srt',
  '/tools/srt-to-vtt',
  '/tools/srt-to-txt',
  '/tools/sbv-to-srt',
  '/tools/srt-to-ass',
  '/tools/vtt-to-txt',
  '/tools/subtitle-shift',
  '/tools/subtitle-fps-converter',
  '/blog',
  '/blog/how-to-fix-subtitle-delay-online',
  '/blog/what-is-ass-subtitle-file',
  '/blog/what-is-vtt-file',
  '/blog/what-is-srt-file',
  '/blog/ass-vs-srt-when-to-convert',
  '/blog/srt-vs-vtt-which-subtitle-format',
  '/about',
  '/privacy',
  '/cookie',
  '/terms',
  '/contact',
] as const;

test('all 25 public pages render without browser errors', async ({ page }) => {
  const monitor = installPageHealthMonitor(page);

  for (const path of publicPages) {
    await test.step(path, async () => {
      await expectHealthyPage(page, monitor, path);
    });
  }
});

test('AdSense stays disabled until production consent messaging is ready', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.locator(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    )
  ).toHaveCount(0);
});

test('public machine-readable endpoints respond', async ({ request }) => {
  const ping = await request.get('/api/ping');
  await expect(ping).toBeOK();
  expect(await ping.json()).toEqual({ message: 'pong' });

  for (const path of ['/robots.txt', '/sitemap.xml', '/manifest.json']) {
    const response = await request.get(path);
    await expect(response, path).toBeOK();
    if (path === '/sitemap.xml') {
      expect(await response.text()).toMatch(
        /<loc>https?:\/\/[^<]+\/cookie<\/loc>/
      );
    }
  }
});
