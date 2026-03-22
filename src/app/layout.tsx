import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://subtitleops.com"),
  title: {
    default: "Free Online Subtitle Converter & Tools",
    template: "%s | SubtitleOps",
  },
  description:
    "Convert subtitle files between SRT, ASS, VTT, and TXT in your browser. Free online subtitle converter for format conversion and transcript extraction.",
  keywords: [
    "subtitle converter",
    "subtitle tools",
    "free subtitle converter",
    "srt converter",
  ],
  alternates: { canonical: "https://subtitleops.com" },
  authors: [{ name: "SubtitleOps" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SubtitleOps",
    url: "https://subtitleops.com",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3RKDT74KDZ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3RKDT74KDZ');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
