import Link from "next/link";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";

const tools = [
  {
    name: "ASS to SRT",
    description: "Convert Advanced SubStation Alpha (.ass) files to SubRip (.srt) format",
    href: "/tools/ass-to-srt",
  },
  {
    name: "VTT to SRT",
    description: "Convert WebVTT (.vtt) files to SubRip (.srt) format",
    href: "/tools/vtt-to-srt",
  },
  {
    name: "TXT to SRT",
    description: "Convert plain text (.txt) subtitle files to SubRip (.srt) format",
    href: "/tools/txt-to-srt",
  },
  {
    name: "SRT to VTT",
    description: "Convert SubRip (.srt) files to WebVTT (.vtt) format for HTML5 video",
    href: "/tools/srt-to-vtt",
  },
  {
    name: "SRT to TXT",
    description: "Extract plain text from SubRip (.srt) subtitle files",
    href: "/tools/srt-to-txt",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 md:py-32">
        <VibeBackgroundGlow />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Subtitle tools that just work.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Convert, sync, merge and clean subtitle files instantly.
            Runs in your browser — files never leave your device.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/tools/ass-to-srt"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
            >
              Get started
            </Link>
            <Link
              href="#tools"
              className="inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-medium hover:bg-accent transition-colors"
            >
              See all tools
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-muted-foreground tracking-wide uppercase">
          <span>100% Free</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>No Upload Required</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>Browser-based</span>
          <span className="hidden sm:inline">&middot;</span>
          <span>Private &amp; Secure</span>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            All tools
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Pick a tool to get started. No sign-up needed.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-center justify-between rounded-xl border p-5 hover:bg-accent transition-colors"
              >
                <div>
                  <h3 className="font-semibold group-hover:underline underline-offset-4">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
                <svg
                  className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors ml-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid gap-10 md:grid-cols-3 text-center">
            <div>
              <div className="mx-auto mb-4 text-4xl font-bold text-muted-foreground/30">
                01
              </div>
              <h3 className="font-semibold mb-2">Upload</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to select your subtitle file
              </p>
            </div>
            <div>
              <div className="mx-auto mb-4 text-4xl font-bold text-muted-foreground/30">
                02
              </div>
              <h3 className="font-semibold mb-2">Convert</h3>
              <p className="text-sm text-muted-foreground">
                Processed locally in your browser — nothing is uploaded to any server
              </p>
            </div>
            <div>
              <div className="mx-auto mb-4 text-4xl font-bold text-muted-foreground/30">
                03
              </div>
              <h3 className="font-semibold mb-2">Download</h3>
              <p className="text-sm text-muted-foreground">
                Preview the result and download your converted file
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
