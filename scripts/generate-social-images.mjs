import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = resolve(root, 'public/og');

const cards = [
  {
    file: 'subtitleops-tools.png',
    eyebrow: 'PRIVATE · BROWSER-BASED · FREE',
    title: 'Subtitle tools that keep your files on your device',
    detail: 'Convert · Extract · Shift · Fix FPS',
    left: 'SRT  ASS  VTT',
    right: 'TXT  SBV',
  },
  {
    file: 'subtitle-delay.png',
    eyebrow: 'SUBTITLE TIMING GUIDE',
    title: 'How to Fix Subtitle Delay Online',
    detail:
      'Choose timing shift for a fixed offset — FPS conversion for drift.',
    left: '00:01:14,500',
    right: '− 2.5 seconds',
  },
  {
    file: 'what-is-ass.png',
    eyebrow: 'SUBTITLE FORMAT GUIDE',
    title: 'What Is an ASS Subtitle File?',
    detail: 'Styling · Positioning · Karaoke timing',
    left: '.ASS',
    right: 'Advanced SSA',
  },
  {
    file: 'what-is-vtt.png',
    eyebrow: 'SUBTITLE FORMAT GUIDE',
    title: 'What Is a VTT File?',
    detail: 'WebVTT captions for HTML5 video',
    left: 'WEBVTT',
    right: '<video> captions',
  },
  {
    file: 'what-is-srt.png',
    eyebrow: 'SUBTITLE FORMAT GUIDE',
    title: 'What Is an SRT File?',
    detail: 'Structure · Timestamps · Examples · Tools',
    left: '00:00:01,000',
    right: 'Hello, world.',
  },
  {
    file: 'srt-vs-vtt.png',
    eyebrow: 'FORMAT COMPARISON',
    title: 'SRT vs VTT',
    detail: 'Players and editors vs browser-native captions',
    left: '.SRT',
    right: '.VTT',
  },
  {
    file: 'ass-vs-srt.png',
    eyebrow: 'FORMAT COMPARISON',
    title: 'ASS vs SRT',
    detail: 'Rich styling vs universal compatibility',
    left: '.ASS',
    right: '.SRT',
  },
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function cardHtml(card) {
  return `<!doctype html><style>
    *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;background:#f8fafc;color:#18181b;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .canvas{position:relative;width:100%;height:100%;padding:72px 76px;background:radial-gradient(circle at 12% 5%,#f5d9f2 0,transparent 38%),radial-gradient(circle at 90% 20%,#ded7fa 0,transparent 42%),linear-gradient(145deg,#fff 30%,#f8fafc)}
    .brand{display:flex;align-items:center;gap:15px;font-size:27px;font-weight:750;letter-spacing:-.02em}.logo{width:46px;height:46px;border-radius:12px;background:#18181b;position:relative;box-shadow:0 10px 24px #18181b24}.logo:before,.logo:after{content:"";position:absolute;left:10px;height:5px;border-radius:4px;background:white}.logo:before{right:10px;bottom:16px}.logo:after{right:18px;bottom:8px}
    .eyebrow{margin-top:62px;color:#5f5f70;font-size:18px;font-weight:750;letter-spacing:.14em}.title{margin-top:16px;width:760px;font-size:57px;line-height:1.04;font-weight:800;letter-spacing:-.045em}.detail{margin-top:22px;width:760px;color:#5f6472;font-size:24px;line-height:1.35}
    .visual{position:absolute;right:72px;bottom:70px;width:350px;height:300px}.card{position:absolute;width:245px;height:168px;padding:24px;border:1px solid #e4e4e7;border-radius:24px;background:#ffffffdb;box-shadow:0 24px 70px #30304a21;backdrop-filter:blur(10px)}.card.one{left:0;top:0;transform:rotate(-6deg)}.card.two{right:0;bottom:0;transform:rotate(5deg);background:#18181b;color:#fff}.tag{font-size:15px;font-weight:750;letter-spacing:.08em;color:#78788a}.two .tag{color:#b9b9c8}.value{position:absolute;left:24px;right:24px;bottom:26px;font-size:27px;line-height:1.12;font-weight:800;word-break:break-word}.line{position:absolute;left:24px;right:24px;top:56px;height:5px;border-radius:3px;background:#e4e4e7}.two .line{background:#3f3f46}
  </style><div class="canvas"><div class="brand"><span class="logo"></span>SubtitleOps</div><div class="eyebrow">${escapeHtml(card.eyebrow)}</div><div class="title">${escapeHtml(card.title)}</div><div class="detail">${escapeHtml(card.detail)}</div><div class="visual"><div class="card one"><div class="tag">INPUT</div><div class="line"></div><div class="value">${escapeHtml(card.left)}</div></div><div class="card two"><div class="tag">OUTPUT</div><div class="line"></div><div class="value">${escapeHtml(card.right)}</div></div></div></div>`;
}

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

for (const card of cards) {
  await page.setContent(cardHtml(card));
  await page.screenshot({ path: resolve(outputDir, card.file), type: 'png' });
}

await page.setViewportSize({ width: 512, height: 512 });
await page.setContent(
  '<style>*{box-sizing:border-box}body{margin:0;width:512px;height:512px;background:#18181b;position:relative}i{position:absolute;left:96px;height:58px;border-radius:29px;background:#fafafa}i:first-child{right:96px;bottom:176px}i:last-child{right:208px;bottom:88px}</style><i></i><i></i>'
);
await page.screenshot({
  path: resolve(root, 'public/logo-512.png'),
  type: 'png',
});
await browser.close();
