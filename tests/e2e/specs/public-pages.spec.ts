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

const toolPages = publicPages.filter((path) => path.startsWith('/tools/'));

test('all 25 public pages render without browser errors', async ({ page }) => {
  const monitor = installPageHealthMonitor(page);

  for (const path of publicPages) {
    await test.step(path, async () => {
      await expectHealthyPage(page, monitor, path);
    });
  }
});

test('existing-page SEO batch 1 keeps metadata, intent, and workflow boundaries', async ({
  page,
}) => {
  const pages = [
    {
      path: '/',
      title: 'Subtitle Converter for Real Workflows | SubtitleOps',
      description:
        'Convert SRT, VTT, ASS, TXT, and SBV files with a subtitle converter built for clear results, format changes, and repeat workflows.',
      canonical: 'https://subtitleops.com',
      h1: 'The Subtitle Converter for Work That Repeats',
      schema: ['WebSite', 'Organization'],
    },
    {
      path: '/tools',
      title: 'Subtitle Tools for Conversion, Text & Timing | SubtitleOps',
      description:
        'Browse SubtitleOps subtitle tools by task: convert SRT, VTT and ASS, extract clean text, create SRT drafts, or fix timing. Start with one file.',
      canonical: 'https://subtitleops.com/tools',
      h1: 'Subtitle Tools for Every File Task',
      schema: ['CollectionPage', 'ItemList', 'BreadcrumbList'],
    },
    {
      path: '/tools/srt-to-txt',
      title: 'SRT to TXT Converter — Clean Transcript | SubtitleOps',
      description:
        'Use this SRT to TXT converter to remove timestamps, cue numbers, and basic tags from an SRT file. Preview clean text, keep cue spacing, and download TXT.',
      canonical: 'https://subtitleops.com/tools/srt-to-txt',
      h1: 'SRT to TXT Converter for Clean Transcript Text',
      schema: ['SoftwareApplication', 'BreadcrumbList'],
    },
    {
      path: '/tools/txt-to-srt',
      title: 'TXT to SRT Converter — Draft Timed Subtitles | SubtitleOps',
      description:
        'Use this TXT to SRT converter to turn plain text into an editable SRT draft. Choose cue splitting and timing rules, preview the result, then download.',
      canonical: 'https://subtitleops.com/tools/txt-to-srt',
      h1: 'TXT to SRT Converter for Editable Subtitle Drafts',
      schema: ['SoftwareApplication', 'BreadcrumbList'],
    },
  ] as const;

  for (const expected of pages) {
    await test.step(expected.path, async () => {
      await page.goto(expected.path);
      await expect(page).toHaveTitle(expected.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        expected.description
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        expected.canonical
      );
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        expected.h1
      );
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

      const schemaTypes = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map(
            (script) => JSON.parse(script.textContent || '{}')['@type']
          )
        );
      expect(schemaTypes).toEqual(expected.schema);
    });
  }

  await page.goto('/');
  await expect(
    page.getByRole('banner').getByRole('link', { name: 'SubtitleOps' })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Choose a subtitle tool' })
  ).toHaveAttribute('href', '#choose-tool');
  await expect(page.getByRole('button', { name: 'Choose File' })).toHaveCount(
    0
  );
  for (const task of [
    'Convert a subtitle format',
    'Extract clean text',
    'Create an SRT draft',
    'Fix subtitle timing',
  ]) {
    await expect(
      page.getByRole('link', { name: new RegExp(task) })
    ).toBeVisible();
  }

  await page.goto('/tools');
  for (const task of [
    'Convert a Format',
    'Extract Clean Text',
    'Create an SRT Draft',
    'Fix Subtitle Timing',
  ]) {
    await expect(
      page.getByRole('link', { name: new RegExp(task) })
    ).toBeVisible();
  }

  await page.goto('/tools/srt-to-txt');
  await expect(
    page.getByText('one blank line between separate cues')
  ).toBeVisible();
  await expect(page.getByText('not removed automatically')).toBeVisible();

  await page.goto('/tools/txt-to-srt');
  const directInput = page.getByLabel(
    'Paste transcript, script, or lyrics text'
  );
  const convertButton = page.getByRole('button', {
    name: 'Convert pasted text',
  });
  await expect(async () => {
    await directInput.fill('');
    await directInput.pressSequentially(
      'First subtitle line.\nSecond subtitle line.'
    );
    await expect(convertButton).toBeEnabled({ timeout: 1_000 });
  }).toPass({ timeout: 10_000 });
  await convertButton.click();
  const result = page.locator('[data-analytics-area="conversion_result"]');
  await expect(result.getByText('Converted successfully!')).toBeVisible();
  await expect(
    result.getByText('Building subtitle drafts repeatedly?')
  ).toBeVisible();
  await expect(result.getByText('00:00:03,500 --> 00:00:06,500')).toBeVisible();
});

test('existing-page SEO batch 2 keeps file contracts and beta boundaries clear', async ({
  page,
}) => {
  const pages = [
    {
      path: '/tools/ass-to-srt',
      title: 'ASS to SRT Converter — Remove Styling | SubtitleOps',
      description:
        'Convert ASS or SSA to SRT in your browser. Keep dialogue and timing, remove styling and positioning, preview the result, and download a clean SubRip file.',
      h1: 'ASS to SRT Converter for Clean, Compatible Subtitles',
      contract:
        'Styles, positions, layers, effects, names, and karaoke tags are removed',
      schema: ['SoftwareApplication', 'BreadcrumbList'],
    },
    {
      path: '/tools/vtt-to-srt',
      title: 'VTT to SRT Converter — WebVTT to SubRip | SubtitleOps',
      description:
        'Convert VTT to SRT in your browser. Keep visible caption text and timing, remove WebVTT headers and cue settings, preview the result, and download SRT.',
      h1: 'VTT to SRT Converter for Clean SubRip Files',
      contract:
        'WEBVTT headers, cue IDs, settings, notes, and VTT tags are not carried into SRT',
      schema: ['SoftwareApplication', 'BreadcrumbList'],
    },
    {
      path: '/tools/srt-to-vtt',
      title: 'SRT to VTT Converter — Web Caption Files | SubtitleOps',
      description:
        'Convert SRT to VTT for web video. Keep caption text and timing, add the WEBVTT header, rewrite timestamps, preview the result, and download WebVTT.',
      h1: 'SRT to VTT Converter for Web Video Captions',
      contract:
        'Adds WEBVTT, changes millisecond commas to dots, and removes SRT cue numbers',
      schema: ['SoftwareApplication', 'BreadcrumbList'],
    },
    {
      path: '/tools/sbv-to-srt',
      title: 'SBV to SRT Converter — YouTube Captions | SubtitleOps',
      description:
        'Convert SBV to SRT in your browser. Keep YouTube caption text and timing, add numbered cues, preview the result, and download a reusable SubRip file.',
      h1: 'SBV to SRT Converter for Reusable YouTube Captions',
      contract:
        'Rewrites timestamp syntax and adds cue numbers; it does not edit or translate the text',
      schema: ['SoftwareApplication', 'BreadcrumbList'],
    },
    {
      path: '/tools/srt-to-ass',
      title: 'SRT to ASS Converter — Editable Style Base | SubtitleOps',
      description:
        'Convert SRT to ASS in your browser. Keep dialogue and timing, create a valid 1080p ASS file with one default style, preview it, and continue editing.',
      h1: 'SRT to ASS Converter for an Editable Style Base',
      contract:
        'Basic b/i/u tags are removed; one Default style is created, but effects and karaoke are not invented',
      schema: ['SoftwareApplication', 'BreadcrumbList'],
    },
    {
      path: '/tools/vtt-to-txt',
      title: 'VTT to TXT Converter — Clean Caption Text | SubtitleOps',
      description:
        'Use this VTT to TXT converter to remove timestamps, headers, cue settings, notes, and tags. Keep readable cue spacing, preview clean text, and download TXT.',
      h1: 'VTT to TXT Converter for Clean Caption Text',
      contract:
        'Removes timing, cue IDs and settings, notes, voice labels, and tags; adds one blank line between cues',
      schema: ['SoftwareApplication', 'BreadcrumbList'],
    },
    {
      path: '/tools/subtitle-shift',
      title: 'Subtitle Timing Shift — Fix Constant Delay | SubtitleOps',
      description:
        'Shift SRT or VTT subtitles earlier or later by a fixed offset. Preview every changed timestamp, see any zero clamps, and download a synced copy locally.',
      h1: 'Subtitle Timing Shift for Constant Sync Errors',
      contract:
        'Adds one offset to every timestamp; negative results are clamped to zero and reported',
      schema: ['SoftwareApplication', 'BreadcrumbList'],
    },
    {
      path: '/tools/subtitle-fps-converter',
      title: 'Subtitle FPS Converter — Fix Timing Drift | SubtitleOps',
      description:
        'Rescale SRT or VTT timestamps between source and target frame rates. Preview the timing ratio, fix progressive drift, and download a new local copy.',
      h1: 'Subtitle FPS Converter for Timing Drift',
      contract:
        'Multiplies every timestamp by source ÷ target FPS; the tool does not detect frame rates automatically',
      schema: ['SoftwareApplication', 'BreadcrumbList'],
    },
    {
      path: '/pricing',
      title: 'SubtitleOps Pricing — Free, Pro & Studio Workflows',
      description:
        'Compare SubtitleOps Free, Pro, and Studio by workflow frequency. Keep single-file tools free; join private beta for batch, presets, review, and API workflows.',
      h1: 'Pricing for One-Off, Repeat, and Team Subtitle Work',
      contract: 'Choose by workflow frequency, not company size',
      schema: ['BreadcrumbList'],
    },
  ] as const;

  for (const expected of pages) {
    await test.step(expected.path, async () => {
      await page.goto(expected.path);
      await expect(page).toHaveTitle(expected.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        expected.description
      );
      const canonicalHref = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      expect(canonicalHref).toBeTruthy();
      expect(new URL(canonicalHref as string).pathname).toBe(expected.path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        expected.h1
      );
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(
        page.getByText(expected.contract, { exact: true })
      ).toBeVisible();

      const schemaTypes = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((scripts) =>
          scripts.map(
            (script) => JSON.parse(script.textContent || '{}')['@type']
          )
        );
      expect(schemaTypes).toEqual(expected.schema);
    });
  }

  const workflowText = 'Running this workflow more than once?';

  await page.goto('/tools/vtt-to-srt');
  await expect(async () => {
    await page.locator('input[type="file"]').setInputFiles({
      name: 'sample.vtt',
      mimeType: 'text/vtt',
      buffer: Buffer.from(
        'WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nHello world\n'
      ),
    });
    await expect(page.getByText(workflowText)).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 10_000 });

  await page.goto('/tools/ass-to-srt');
  await expect(async () => {
    await page.locator('input[type="file"]').setInputFiles({
      name: 'sample.ass',
      mimeType: 'text/plain',
      buffer: Buffer.from(
        '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\nDialogue: 0,0:00:01.00,0:00:03.00,Default,,0,0,0,,Hello world\n'
      ),
    });
    await expect(page.getByText(workflowText)).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 10_000 });

  for (const timingTool of [
    { path: '/tools/subtitle-shift', action: 'Shift subtitles' },
    { path: '/tools/subtitle-fps-converter', action: 'Convert FPS' },
  ]) {
    await page.goto(timingTool.path);
    const fileInput = page.locator('input[type="file"]').first();
    await expect(async () => {
      await fileInput.setInputFiles({
        name: 'sample.srt',
        mimeType: 'text/plain',
        buffer: Buffer.from('1\n00:00:01,000 --> 00:00:03,000\nHello world\n'),
      });
      await expect(page.getByText('Detected as SRT subtitle file')).toBeVisible(
        {
          timeout: 1_000,
        }
      );
    }).toPass({ timeout: 10_000 });
    if (timingTool.path === '/tools/subtitle-shift') {
      await page.getByLabel('Shift by (seconds)').fill('1');
    }
    await page.getByRole('button', { name: timingTool.action }).click();
    await expect(page.getByText(workflowText)).toBeVisible();
  }
});

test('public pages stay within a mobile viewport and keep tools accessible', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const path of publicPages) {
    await test.step(`${path} has no horizontal page overflow`, async () => {
      await page.goto(path);
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(
        dimensions.clientWidth
      );
    });
  }

  for (const path of toolPages) {
    await test.step(`${path} exposes its uploader in the first view`, async () => {
      await page.goto(path);
      const input = page.locator('input[type="file"]').first();
      await expect(input).toHaveAccessibleName(/Upload .*subtitle file/i);

      const dropzone = page
        .locator('[data-analytics-area="file_dropzone"]')
        .first();
      await expect(dropzone).toBeVisible();
      const box = await dropzone.boundingBox();
      expect(box).not.toBeNull();
      expect(box?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(844);
    });
  }

  await page.goto('/pricing');
  for (const plan of ['Free', 'Pro', 'Studio']) {
    await expect(
      page.getByRole('heading', { level: 2, name: plan })
    ).toBeVisible();
  }
  await expect(
    page.getByRole('toolbar', { name: 'Billing interval' })
  ).toBeVisible();
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

test('production security headers stay enforced', async ({ request }) => {
  const response = await request.get('/');
  await expect(response).toBeOK();

  const csp = response.headers()['content-security-policy'];
  expect(csp).toContain("script-src 'self' 'unsafe-inline' https:");
  expect(csp).not.toContain("'unsafe-eval'");
  expect(response.headers()['strict-transport-security']).toBe(
    'max-age=63072000'
  );
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
});

test('public machine-readable endpoints respond', async ({ request }) => {
  const ping = await request.get('/api/ping');
  await expect(ping).toBeOK();
  expect(await ping.json()).toEqual({ message: 'pong' });

  const readiness = await request.get('/api/ready');
  await expect(readiness).toBeOK();
  expect(await readiness.json()).toMatchObject({ status: 'ready' });

  for (const path of ['/robots.txt', '/sitemap.xml', '/manifest.json']) {
    const response = await request.get(path);
    await expect(response, path).toBeOK();
    if (path === '/sitemap.xml') {
      const sitemap = await response.text();
      expect(sitemap).toMatch(/<loc>https?:\/\/[^<]+\/cookie<\/loc>/);
      expect(sitemap.match(/<lastmod>2026-08-23<\/lastmod>/g)).toHaveLength(13);
      expect(sitemap).not.toContain('<changefreq>');
      expect(sitemap).not.toContain('<priority>');
    }
  }
});
