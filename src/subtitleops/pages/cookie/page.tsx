import type { LegacyMetadata as Metadata } from '@/lib/legacy-metadata';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Learn how SubtitleOps uses essential, analytics, and advertising cookies and how to manage your choices.',
  alternates: { canonical: '/cookie' },
  openGraph: { url: '/cookie' },
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
        Cookie Policy
      </h1>
      <p className="mb-10 text-sm text-muted-foreground">
        Last updated: July 16, 2026
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">Overview</h2>
        <p>
          This policy explains how SubtitleOps and its service providers use
          cookies and similar technologies. Cookies are small files or browser
          storage entries used to keep the service working, remember choices,
          measure usage, and, when enabled, support advertising.
        </p>

        <h2 className="pt-4 text-xl font-semibold text-foreground">
          Essential Cookies
        </h2>
        <p>
          Essential cookies support account sessions, security, language,
          interface preferences, and other features needed for the site to
          operate. They cannot be disabled through an advertising consent
          message because the requested service would not work correctly without
          them.
        </p>

        <h2 className="pt-4 text-xl font-semibold text-foreground">
          Analytics Cookies
        </h2>
        <p>
          We use Google Analytics to understand page usage, traffic sources,
          device categories, and product interactions. Analytics data is not
          used to upload or inspect subtitle contents. Where consent is
          required, analytics storage follows the choices collected through our
          consent management platform.
        </p>

        <h2 className="pt-4 text-xl font-semibold text-foreground">
          Advertising Cookies
        </h2>
        <p>
          Google AdSense and its partners may use cookies, device information,
          IP addresses, and similar technologies to serve, limit, and measure
          ads. Third-party vendors, including Google, use advertising cookies
          based on a person&apos;s prior visits to SubtitleOps or other
          websites. For visitors in the European Economic Area, the United
          Kingdom, and Switzerland, we will request consent before serving
          personalized advertising.
        </p>

        <h2 className="pt-4 text-xl font-semibold text-foreground">
          Managing Your Choices
        </h2>
        <p>
          When a privacy message is shown, you can consent, decline, or manage
          the purposes and vendors available in that message. You can also clear
          cookies in your browser. Clearing cookies may sign you out, reset
          interface preferences, and cause a consent message to appear again.
          You can opt out of Google&apos;s personalized advertising in{' '}
          <a
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
            href="https://www.google.com/settings/ads"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Ads Settings
          </a>{' '}
          or opt out of some third-party vendors&apos; personalized advertising
          at{' '}
          <a
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
            href="https://optout.aboutads.info/"
            rel="noopener noreferrer"
            target="_blank"
          >
            aboutads.info
          </a>
          .
        </p>

        <h2 className="pt-4 text-xl font-semibold text-foreground">
          Third-Party Information
        </h2>
        <p>
          Learn more about how Google uses information from sites and apps that
          use its services in{' '}
          <a
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
            href="https://policies.google.com/technologies/partner-sites"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google&apos;s partner sites policy
          </a>
          . Additional information about account, payment, storage, and service
          providers is available in our{' '}
          <a
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
            href="/privacy"
          >
            Privacy Policy
          </a>
          .
        </p>

        <h2 className="pt-4 text-xl font-semibold text-foreground">Contact</h2>
        <p>
          Questions about this policy can be sent to{' '}
          <a
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
            href="mailto:support@subtitleops.com"
          >
            support@subtitleops.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
