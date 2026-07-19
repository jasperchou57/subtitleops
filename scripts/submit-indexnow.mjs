const HOST = 'subtitleops.com';
const BASE_URL = `https://${HOST}`;
const KEY = '405e2322f901befd0cf4c4379b1c5fdf';
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

function extractUrlsFromSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    match[1].trim()
  );
}

function normalizeUrl(url) {
  const parsed = new URL(url);
  parsed.hash = '';
  return parsed.toString();
}

async function getUrls() {
  const args = process.argv.slice(2).filter((arg) => arg !== '--dry-run');

  if (args.length > 0) {
    return args.map(normalizeUrl);
  }

  const response = await fetch(SITEMAP_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch sitemap: ${response.status} ${response.statusText}`
    );
  }

  const sitemap = await response.text();
  return extractUrlsFromSitemap(sitemap).map(normalizeUrl);
}

async function submitIndexNow() {
  const isDryRun = process.argv.includes('--dry-run');
  const urls = [...new Set(await getUrls())].filter(
    (url) => new URL(url).hostname === HOST
  );

  if (urls.length === 0) {
    throw new Error('No subtitleops.com URLs found to submit.');
  }

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  if (isDryRun) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  const body = await response.text();
  if (![200, 202].includes(response.status)) {
    throw new Error(
      `IndexNow submission failed: ${response.status} ${response.statusText}${body ? `\n${body}` : ''}`
    );
  }

  console.log(`Submitted ${urls.length} URLs to IndexNow.`);
  if (body) {
    console.log(body);
  }
}

submitIndexNow().catch((error) => {
  console.error(error);
  process.exit(1);
});
