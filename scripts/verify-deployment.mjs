const baseUrl = process.argv
  .slice(2)
  .find((argument) => argument !== '--')
  ?.replace(/\/$/, '');

if (!baseUrl || !URL.canParse(baseUrl)) {
  console.error(
    'Usage: pnpm verify:deployment -- https://subtitleops.example.workers.dev'
  );
  process.exit(1);
}

const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function get(path, options) {
  const response = await fetch(`${baseUrl}${path}`, {
    redirect: 'manual',
    ...options,
  });
  return { response, text: await response.text() };
}

const home = await get('/');
check(home.response.ok, `GET / returned ${home.response.status}`);
check(
  home.response.headers
    .get('content-security-policy')
    ?.includes("script-src 'self' 'unsafe-inline' https:"),
  'Content-Security-Policy is missing or unexpected'
);
check(
  !home.response.headers
    .get('content-security-policy')
    ?.includes("'unsafe-eval'"),
  "Content-Security-Policy still allows 'unsafe-eval'"
);
check(
  home.response.headers.get('strict-transport-security') === 'max-age=63072000',
  'Strict-Transport-Security is missing or unexpected'
);
check(
  home.response.headers.get('x-content-type-options') === 'nosniff',
  'X-Content-Type-Options is missing'
);

for (const path of ['/pricing', '/auth/login']) {
  const result = await get(path);
  check(result.response.ok, `GET ${path} returned ${result.response.status}`);
}

const dashboard = await get('/dashboard');
check(
  [302, 303, 307, 308].includes(dashboard.response.status),
  `Guest GET /dashboard should redirect, returned ${dashboard.response.status}`
);
check(
  dashboard.response.headers.get('location')?.includes('/auth/login'),
  'Guest GET /dashboard did not redirect to login'
);

for (const path of ['/api/ping', '/api/ready']) {
  const result = await get(path);
  check(result.response.ok, `GET ${path} returned ${result.response.status}`);
}

const sitemap = await get('/sitemap.xml');
check(
  sitemap.response.ok,
  `GET /sitemap.xml returned ${sitemap.response.status}`
);
check(
  sitemap.text.includes('<loc>https://subtitleops.com/pricing</loc>'),
  'Sitemap is missing the production pricing URL'
);
check(
  sitemap.text.includes('<loc>https://subtitleops.com/cookie</loc>'),
  'Sitemap is missing the production cookie-policy URL'
);
check(!sitemap.text.includes('localhost'), 'Sitemap contains localhost URLs');

for (const path of ['/robots.txt', '/manifest.json']) {
  const result = await get(path);
  check(result.response.ok, `GET ${path} returned ${result.response.status}`);
}

const unsignedWebhook = await get('/api/webhooks/stripe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{}',
});
check(
  unsignedWebhook.response.status >= 400 &&
    unsignedWebhook.response.status < 500,
  `Unsigned Stripe webhook should return 4xx, returned ${unsignedWebhook.response.status}`
);

if (failures.length > 0) {
  console.error(`Deployment verification failed for ${baseUrl}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Deployment verified: ${baseUrl}`);
