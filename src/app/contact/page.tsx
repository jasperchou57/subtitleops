import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with SubtitleOps. Send us feedback, bug reports, or feature requests.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
        Contact Us
      </h1>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>
          We would love to hear from you. Whether you have a question, found a
          bug, or want to suggest a new feature, feel free to reach out.
        </p>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Email</h2>
          <p>
            Send us an email at{" "}
            <a
              href="mailto:contact@subtitleops.com"
              className="font-medium underline underline-offset-4 hover:text-foreground/70"
            >
              contact@subtitleops.com
            </a>{" "}
            and we will get back to you as soon as possible.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Feature Requests
          </h2>
          <p>
            Looking for a specific subtitle format, a new tool, or a workflow
            improvement? Let us know what would make SubtitleOps more useful for
            your work.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Bug Reports
          </h2>
          <p>
            If a conversion is not working correctly, please include the file
            format, browser, and a description of the issue so we can reproduce
            and fix it quickly.
          </p>
        </div>
      </div>
    </div>
  );
}
