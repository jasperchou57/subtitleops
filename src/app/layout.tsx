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
    "Convert SRT, ASS, VTT, TXT, and SBV subtitles in your browser. Free tools for format conversion, text extraction, timing shift, and FPS fixes.",
  keywords: [
    "subtitle converter",
    "subtitle tools",
    "free subtitle converter",
    "srt converter",
    "subtitle timing",
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
          strategy="lazyOnload"
        />
        <Script
          src="https://plausible.io/js/pa-dZabeih5aLJYn323J_RJo.js"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3RKDT74KDZ');
          `}
        </Script>
        <Script id="plausible-init" strategy="afterInteractive">
          {`
            window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
            plausible.init()
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
