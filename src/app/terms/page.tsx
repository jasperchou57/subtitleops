import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "SubtitleOps terms of service. Understand the terms governing use of our free browser-based subtitle conversion tools.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Terms of Service
      </h1>
      <p className="text-sm text-muted-foreground mb-10">
        Last updated: March 22, 2026
      </p>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <h2 className="text-xl font-semibold text-foreground">
          Acceptance of Terms
        </h2>
        <p>
          By accessing and using SubtitleOps, you agree to be bound by these
          Terms of Service. If you do not agree with any part of these terms,
          please do not use the site.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Description of Service
        </h2>
        <p>
          SubtitleOps provides free, browser-based subtitle file conversion
          tools. All processing occurs locally in your web browser. We do not
          store, transmit, or have access to any files you process using our
          tools.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Use of the Service
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            You may use SubtitleOps for personal and commercial purposes at no
            cost.
          </li>
          <li>
            You are responsible for the content of the files you process. Do not
            use SubtitleOps to process files that violate applicable laws or
            third-party rights.
          </li>
          <li>
            You may not attempt to disrupt, overload, or interfere with the
            normal operation of the site.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Disclaimer of Warranties
        </h2>
        <p>
          SubtitleOps is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; without warranties of any kind, either express or
          implied. We do not guarantee that the tools will be error-free,
          uninterrupted, or that conversion output will meet your specific
          requirements. Always verify converted files before use in production
          workflows.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, SubtitleOps and its operators
          shall not be liable for any indirect, incidental, special, or
          consequential damages arising from your use of or inability to use the
          service.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">
          Changes to Terms
        </h2>
        <p>
          We reserve the right to update these terms at any time. Changes will
          be posted on this page with an updated revision date. Continued use of
          SubtitleOps after changes constitutes acceptance of the revised terms.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Contact</h2>
        <p>
          Questions about these terms? Contact us at{" "}
          <a
            href="mailto:contact@subtitleops.com"
            className="font-medium underline underline-offset-4 hover:text-foreground/70"
          >
            contact@subtitleops.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
