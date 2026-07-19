const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

type GoogleAccessTokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

type Ga4RunReportResponse = {
  dimensionHeaders?: Array<{ name: string }>;
  metricHeaders?: Array<{ name: string }>;
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
  totals?: Array<{
    metricValues?: Array<{ value?: string }>;
  }>;
};

type SearchConsoleResponse = {
  rows?: Array<{
    keys?: string[];
    clicks?: number;
    impressions?: number;
    ctr?: number;
    position?: number;
  }>;
};

type AccessTokenCache = {
  accessToken: string;
  expiresAt: number;
  scopeKey: string;
};

type ServiceAccountJson = {
  client_email?: string;
  private_key?: string;
  token_uri?: string;
};

export type SeoAnalyticsRange = {
  startDate: string;
  endDate: string;
  days: number;
};

export type SeoAnalyticsReportRow = {
  dimensions: Record<string, string>;
  metrics: Record<string, number>;
};

export class GoogleSeoAnalyticsConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GoogleSeoAnalyticsConfigurationError';
  }
}

let tokenCache: AccessTokenCache | undefined;

export function isSeoAnalyticsRequestAuthorized(request: Request) {
  const expectedToken = getEnv('SEO_ANALYTICS_TOKEN');
  if (!expectedToken) {
    throw new GoogleSeoAnalyticsConfigurationError(
      'SEO_ANALYTICS_TOKEN is not configured.'
    );
  }

  const authHeader = request.headers.get('authorization') ?? '';
  const bearerToken = authHeader.match(/^Bearer\s+(.+)$/i)?.[1];
  const headerToken = request.headers.get('x-seo-analytics-token');

  return (bearerToken ?? headerToken) === expectedToken;
}

export async function getSeoAnalyticsOverview(input: {
  days?: number;
  endDate?: string;
  rowLimit?: number;
}) {
  assertSeoAnalyticsConfigured();

  const range = getDateRange(input.days, input.endDate);
  const rowLimit = clampInteger(input.rowLimit ?? 50, 1, 250);
  const accessToken = await getGoogleAccessToken();

  const [
    gscSummary,
    gscQueries,
    gscPages,
    gscDates,
    gscDevices,
    ga4Summary,
    ga4Pages,
    ga4Sources,
    ga4Dates,
    ga4Devices,
  ] = await Promise.all([
    querySearchConsole(accessToken, range, [], 1),
    querySearchConsole(accessToken, range, ['query'], rowLimit),
    querySearchConsole(accessToken, range, ['page'], rowLimit),
    querySearchConsole(accessToken, range, ['date'], rowLimit),
    querySearchConsole(accessToken, range, ['device'], 10),
    runGa4Report(
      accessToken,
      range,
      [],
      [
        'activeUsers',
        'sessions',
        'screenPageViews',
        'engagedSessions',
        'eventCount',
      ]
    ),
    runGa4Report(
      accessToken,
      range,
      ['pagePath', 'pageTitle'],
      ['activeUsers', 'sessions', 'screenPageViews'],
      rowLimit
    ),
    runGa4Report(
      accessToken,
      range,
      ['sessionSourceMedium'],
      ['activeUsers', 'sessions'],
      rowLimit
    ),
    runGa4Report(
      accessToken,
      range,
      ['date'],
      ['activeUsers', 'sessions', 'screenPageViews'],
      rowLimit
    ),
    runGa4Report(
      accessToken,
      range,
      ['deviceCategory'],
      ['activeUsers', 'sessions'],
      10
    ),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    range,
    siteUrl: getEnv('GOOGLE_SEO_GSC_SITE_URL'),
    ga4PropertyId: normalizeGa4PropertyId(getEnv('GOOGLE_SEO_GA4_PROPERTY_ID')),
    gsc: {
      summary: gscSummary.rows[0] ?? null,
      queries: gscQueries.rows,
      pages: gscPages.rows,
      dates: gscDates.rows,
      devices: gscDevices.rows,
    },
    ga4: {
      summary: ga4Summary.totals,
      pages: ga4Pages.rows,
      sources: ga4Sources.rows,
      dates: ga4Dates.rows,
      devices: ga4Devices.rows,
    },
  };
}

function assertSeoAnalyticsConfigured() {
  const missing = [
    'GOOGLE_SEO_GA4_PROPERTY_ID',
    'GOOGLE_SEO_GSC_SITE_URL',
  ].filter((name) => !getEnv(name));

  if (missing.length > 0) {
    throw new GoogleSeoAnalyticsConfigurationError(
      `Missing Google SEO analytics configuration: ${missing.join(', ')}.`
    );
  }

  if (!hasGoogleAuthCredentials()) {
    throw new GoogleSeoAnalyticsConfigurationError(
      'Missing Google SEO analytics authentication: configure OAuth refresh-token credentials or GOOGLE_SERVICE_ACCOUNT_JSON.'
    );
  }
}

async function getGoogleAccessToken() {
  const scopeKey = [GA4_SCOPE, GSC_SCOPE].sort().join(' ');
  if (
    tokenCache?.scopeKey === scopeKey &&
    tokenCache.expiresAt > Date.now() + 60_000
  ) {
    return tokenCache.accessToken;
  }

  if (hasGoogleOAuthCredentials()) {
    return getOAuthAccessToken(scopeKey);
  }

  if (getEnv('GOOGLE_SERVICE_ACCOUNT_JSON')) {
    return getServiceAccountAccessToken(scopeKey);
  }

  throw new GoogleSeoAnalyticsConfigurationError(
    'Google SEO analytics authentication is not configured.'
  );
}

function hasGoogleAuthCredentials() {
  return (
    hasGoogleOAuthCredentials() ||
    Boolean(getEnv('GOOGLE_SERVICE_ACCOUNT_JSON'))
  );
}

function hasGoogleOAuthCredentials() {
  return Boolean(
    getEnv('GOOGLE_OAUTH_CLIENT_ID') && getEnv('GOOGLE_OAUTH_REFRESH_TOKEN')
  );
}

async function getOAuthAccessToken(scopeKey: string) {
  const body = new URLSearchParams({
    client_id: getEnv('GOOGLE_OAUTH_CLIENT_ID'),
    refresh_token: getEnv('GOOGLE_OAUTH_REFRESH_TOKEN'),
    grant_type: 'refresh_token',
  });

  const clientSecret = getEnv('GOOGLE_OAUTH_CLIENT_SECRET');
  if (clientSecret) {
    body.set('client_secret', clientSecret);
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const result = (await response.json()) as GoogleAccessTokenResponse;

  if (!response.ok || !result.access_token) {
    const detail = result.error_description ?? result.error ?? response.status;
    throw new Error(`Google OAuth token refresh failed: ${detail}`);
  }

  tokenCache = {
    accessToken: result.access_token,
    expiresAt: Date.now() + (result.expires_in ?? 3600) * 1000,
    scopeKey,
  };

  return result.access_token;
}

async function getServiceAccountAccessToken(scopeKey: string) {
  const serviceAccount = getServiceAccount();
  const assertion = await createSignedJwt(serviceAccount, scopeKey);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const response = await fetch(serviceAccount.token_uri ?? TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const result = (await response.json()) as GoogleAccessTokenResponse;

  if (!response.ok || !result.access_token) {
    const detail = result.error_description ?? result.error ?? response.status;
    throw new Error(`Google service account token request failed: ${detail}`);
  }

  tokenCache = {
    accessToken: result.access_token,
    expiresAt: Date.now() + (result.expires_in ?? 3600) * 1000,
    scopeKey,
  };

  return result.access_token;
}

function getServiceAccount() {
  try {
    const parsed = JSON.parse(
      getEnv('GOOGLE_SERVICE_ACCOUNT_JSON')
    ) as ServiceAccountJson;

    if (!parsed.client_email || !parsed.private_key) {
      throw new Error('Missing client_email or private_key.');
    }

    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key,
      token_uri: parsed.token_uri,
    };
  } catch (error) {
    throw new GoogleSeoAnalyticsConfigurationError(
      `Invalid GOOGLE_SERVICE_ACCOUNT_JSON: ${
        error instanceof Error ? error.message : 'unknown error'
      }`
    );
  }
}

async function createSignedJwt(
  serviceAccount: Required<
    Pick<ServiceAccountJson, 'client_email' | 'private_key'>
  >,
  scope: string
) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: serviceAccount.client_email,
    scope,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };
  const unsignedToken = `${base64UrlJson(header)}.${base64UrlJson(claimSet)}`;
  const key = await importPrivateKey(serviceAccount.private_key);
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsignedToken)
  );

  return `${unsignedToken}.${base64Url(new Uint8Array(signature))}`;
}

async function importPrivateKey(privateKey: string) {
  const normalizedKey = privateKey.replace(/\\n/g, '\n');
  const pemBody = normalizedKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s+/g, '');
  const binary = Uint8Array.from(atob(pemBody), (char) => char.charCodeAt(0));

  return crypto.subtle.importKey(
    'pkcs8',
    binary,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );
}

async function querySearchConsole(
  accessToken: string,
  range: SeoAnalyticsRange,
  dimensions: string[],
  rowLimit: number
) {
  const siteUrl = encodeURIComponent(getEnv('GOOGLE_SEO_GSC_SITE_URL'));
  const response = await googleJsonFetch<SearchConsoleResponse>(
    `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`,
    accessToken,
    {
      startDate: range.startDate,
      endDate: range.endDate,
      dimensions,
      rowLimit,
      type: 'web',
    }
  );

  return {
    rows: (response.rows ?? []).map((row) => ({
      dimensions: Object.fromEntries(
        dimensions.map((dimension, index) => [
          dimension,
          row.keys?.[index] ?? '',
        ])
      ),
      metrics: {
        clicks: row.clicks ?? 0,
        impressions: row.impressions ?? 0,
        ctr: row.ctr ?? 0,
        position: row.position ?? 0,
      },
    })),
  };
}

async function runGa4Report(
  accessToken: string,
  range: SeoAnalyticsRange,
  dimensions: string[],
  metrics: string[],
  limit = 1
) {
  const propertyId = normalizeGa4PropertyId(
    getEnv('GOOGLE_SEO_GA4_PROPERTY_ID')
  );
  const response = await googleJsonFetch<Ga4RunReportResponse>(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    accessToken,
    {
      dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
      dimensions: dimensions.map((name) => ({ name })),
      metrics: metrics.map((name) => ({ name })),
      limit: `${limit}`,
    }
  );

  return {
    rows: normalizeGa4Rows(response),
    totals: normalizeGa4Totals(response),
  };
}

async function googleJsonFetch<T>(
  url: string,
  accessToken: string,
  body: Record<string, unknown>
) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Google API request failed ${response.status}: ${detail.slice(0, 500)}`
    );
  }

  return (await response.json()) as T;
}

function normalizeGa4Rows(
  response: Ga4RunReportResponse
): SeoAnalyticsReportRow[] {
  const dimensionNames =
    response.dimensionHeaders?.map((header) => header.name) ?? [];
  const metricNames =
    response.metricHeaders?.map((header) => header.name) ?? [];

  return (response.rows ?? []).map((row) => ({
    dimensions: Object.fromEntries(
      dimensionNames.map((name, index) => [
        name,
        row.dimensionValues?.[index]?.value ?? '',
      ])
    ),
    metrics: Object.fromEntries(
      metricNames.map((name, index) => [
        name,
        Number(row.metricValues?.[index]?.value ?? 0),
      ])
    ),
  }));
}

function normalizeGa4Totals(response: Ga4RunReportResponse) {
  const metricNames =
    response.metricHeaders?.map((header) => header.name) ?? [];
  const totalValues =
    response.totals?.[0]?.metricValues ??
    response.rows?.[0]?.metricValues ??
    [];

  return Object.fromEntries(
    metricNames.map((name, index) => [
      name,
      Number(totalValues[index]?.value ?? 0),
    ])
  );
}

function getDateRange(days = 28, endDate?: string): SeoAnalyticsRange {
  const safeDays = clampInteger(days, 1, 90);
  const end = endDate ? parseDate(endDate) : offsetDate(new Date(), -2);
  const start = offsetDate(end, -(safeDays - 1));

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
    days: safeDays,
  };
}

function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('endDate must use YYYY-MM-DD format.');
  }

  return new Date(`${value}T00:00:00.000Z`);
}

function offsetDate(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function clampInteger(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.trunc(value), min), max);
}

function normalizeGa4PropertyId(propertyId: string) {
  return propertyId.replace(/^properties\//, '').trim();
}

function getEnv(name: string) {
  return process.env[name]?.trim() ?? '';
}

function base64UrlJson(value: unknown) {
  return base64Url(new TextEncoder().encode(JSON.stringify(value)));
}

function base64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}
