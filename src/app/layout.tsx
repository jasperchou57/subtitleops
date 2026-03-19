import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Free Online Subtitle Converter & Tools",
    template: "%s | SubtitleOps",
  },
  description:
    "Convert subtitle files between SRT, ASS, VTT, and TXT in your browser. Use a free online subtitle converter for format conversion, transcript extraction, and transcript-to-subtitle drafting workflows.",
  keywords: [
    "subtitle converter",
    "subtitle tools",
    "free subtitle converter",
    "online subtitle converter",
    "srt converter",
    "ass to srt",
    "vtt to srt",
  ],
  authors: [{ name: "SubtitleOps" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SubtitleOps",
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
