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
    default: "SubtitleOps - Free Online Subtitle Converter & Tools",
    template: "%s | SubtitleOps",
  },
  description:
    "Free online subtitle converter and editing tools. Convert ASS, VTT, TXT, SMI to SRT format instantly in your browser. No upload needed — 100% private.",
  keywords: [
    "subtitle converter",
    "srt converter",
    "ass to srt",
    "vtt to srt",
    "subtitle tools",
    "subtitle editor online",
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
