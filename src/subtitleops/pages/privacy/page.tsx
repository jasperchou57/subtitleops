import type { LegacyMetadata as Metadata } from '@/lib/legacy-metadata';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'SubtitleOps privacy policy. Learn how browser conversion, accounts, optional project archives, analytics, and payments are handled.',
  alternates: { canonical: '/privacy' },
  openGraph: { url: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-muted-foreground mb-10">
        Last updated: July 16, 2026
      </p>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <h2 className="text-xl font-semibold text-foreground">Overview</h2>
        <p>
          SubtitleOps is designed with privacy as a core principle. Subtitle
          conversion runs in your browser. Free conversions are not uploaded.
          Paid users may explicitly keep a private ZIP archive in project
          history; those selected archives are stored in Cloudflare R2.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Data We Collect
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Account data such as your name, email address, authentication
            records, workspace membership, and security-related request data.
          </li>
          <li>
            Subscription status, plan, billing interval, customer and
            subscription identifiers. Payment card details are handled by the
            payment provider and are not stored by SubtitleOps.
          </li>
          <li>
            Workflow metadata such as file names, output formats, quality issue
            summaries, presets, review status, and retention dates.
          </li>
          <li>
            Private ZIP archives only when a paid user selects project archive
            storage.
          </li>
          <li>
            Beta signup email, selected plan, and optional use-case notes.
          </li>
          <li>
            We do not process subtitle file contents through analytics or
            advertising services.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Storage and Retention
        </h2>
        <p>
          Account, workspace, subscription, and project metadata is stored in
          Cloudflare D1. Optional private archives are stored in Cloudflare R2
          and can be accessed only by the owning account. Pro history is kept
          for up to 180 days and Studio history for up to 365 days. We may keep
          limited billing, fraud-prevention, security, or legal records where
          required after an account or project is removed.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Analytics
        </h2>
        <p>
          We use Google Analytics (GA4) to understand how visitors use the site.
          This collects anonymized usage data such as page views, referral
          sources, and general device information. Google Analytics may use
          cookies to distinguish unique visitors. No personally identifiable
          information is collected through analytics.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Advertising
        </h2>
        <p>
          When advertising is enabled, we use Google AdSense to display
          advertising. Google and its partners may use cookies, web beacons, IP
          addresses, device information, and similar technologies to serve ads,
          limit how often ads are shown, measure ad performance, and help keep
          ads relevant. Where required, advertising and analytics choices are
          collected through a Google-certified consent management platform. Read
          our{' '}
          <a
            href="/cookie"
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
          >
            Cookie Policy
          </a>{' '}
          or learn more about how Google uses information from sites and apps
          that use its services at{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
          >
            Google&apos;s partner sites policy
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Third-Party Services
        </h2>
        <p>
          SubtitleOps uses Google Analytics, Google AdSense, Cloudflare, and a
          configured payment provider such as Stripe or Creem. Third-party
          services may collect standard technical information such as IP
          addresses, browser and device data, cookies, and request metadata as
          part of analytics, advertising, security, and hosting operations. For
          Cloudflare hosting details, see{' '}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
          >
            Cloudflare&apos;s Privacy Policy
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Your Choices
        </h2>
        <p>
          You can use the free conversion tools without an account, choose not
          to store a ZIP archive, download or delete stored files, manage or
          cancel a subscription through billing settings, and request account
          deletion from account settings. Contact us for access or correction
          requests that are not available in the product.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Changes to This Policy
        </h2>
        <p>
          We may update this privacy policy from time to time. Changes will be
          posted on this page with an updated revision date.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Contact</h2>
        <p>
          If you have questions about this privacy policy, contact us at{' '}
          <a
            href="mailto:support@subtitleops.com"
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
          >
            support@subtitleops.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
