import Link from "next/link";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { UniversalConverter } from "@/components/tools/universal-converter";

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
      {/* Hero + Tool */}
      <section className="relative py-16 md:py-24">
        <VibeBackgroundGlow />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Subtitle tools that just work.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Drop any subtitle file — we auto-detect the format and let you convert instantly.
              Everything runs in your browser.
            </p>
          </div>

          {/* Universal Converter — the interactive tool */}
          <UniversalConverter />
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
            Or pick a specific tool for dedicated features and SEO-optimized guides.
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
              <div className="mx-auto mb-4 text-4xl font-bold text-muted-foreground/30">01</div>
              <h3 className="font-semibold mb-2">Drop any file</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your subtitle file — format is auto-detected (SRT, ASS, VTT, TXT)
              </p>
            </div>
            <div>
              <div className="mx-auto mb-4 text-4xl font-bold text-muted-foreground/30">02</div>
              <h3 className="font-semibold mb-2">Pick output format</h3>
              <p className="text-sm text-muted-foreground">
                Choose your target format. Conversion happens locally — nothing leaves your browser
              </p>
            </div>
            <div>
              <div className="mx-auto mb-4 text-4xl font-bold text-muted-foreground/30">03</div>
              <h3 className="font-semibold mb-2">Preview & download</h3>
              <p className="text-sm text-muted-foreground">
                See a before/after comparison and download your converted file with one click
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
