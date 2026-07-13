import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "SubtitleOps privacy policy. Learn how we handle your data — all subtitle conversions run in your browser with no file uploads.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-muted-foreground mb-10">
        Last updated: July 12, 2026
      </p>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <h2 className="text-xl font-semibold text-foreground">Overview</h2>
        <p>
          SubtitleOps is designed with privacy as a core principle. All subtitle
          file conversions run entirely in your browser. Your files are never
          uploaded to our servers or any third-party service.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Data We Do Not Collect
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>We do not collect, store, or transmit your subtitle files.</li>
          <li>We do not require user accounts or login credentials.</li>
          <li>
            We do not process subtitle file contents through analytics or
            advertising services.
          </li>
        </ul>

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
          We use Google AdSense to display advertising. Google and its partners
          may use cookies, web beacons, IP addresses, device information, and
          similar technologies to serve ads, limit how often ads are shown,
          measure ad performance, and help keep ads relevant. Learn more about
          how Google uses information from sites and apps that use its services
          at{" "}
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
          SubtitleOps uses Google Analytics, Google AdSense, and Vercel.
          Third-party services may collect standard technical information such
          as IP addresses, browser and device data, cookies, and request
          metadata as part of analytics, advertising, security, and hosting
          operations. For Vercel hosting details, see{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
          >
            Vercel&apos;s Privacy Policy
          </a>
          .
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
          If you have questions about this privacy policy, contact us at{" "}
          <a
            href="mailto:help@subtitleops.com"
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
          >
            help@subtitleops.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
