import Link from "next/link";

const converters = [
  { name: "ASS to SRT", href: "/tools/ass-to-srt", title: "Convert ASS to SRT subtitle format" },
  { name: "VTT to SRT", href: "/tools/vtt-to-srt", title: "Convert VTT to SRT subtitle format" },
  { name: "TXT to SRT", href: "/tools/txt-to-srt", title: "Convert TXT to SRT subtitle format" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt", title: "Convert SRT to VTT subtitle format" },
  { name: "SRT to TXT", href: "/tools/srt-to-txt", title: "Convert SRT to TXT plain text" },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" title="SubtitleOps — Free Online Subtitle Converter" className="flex items-center gap-2.5 mb-4">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 15h14M5 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-base font-semibold tracking-tight">
                SubtitleOps
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free online subtitle tools. Convert, sync and clean your files in the browser.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Converters</h3>
            <ul className="space-y-2">
              {converters.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} title={tool.title} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" title="Subtitle guides, tips and format explanations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/tools" title="Browse all free subtitle conversion tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" title="About SubtitleOps" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" title="SubtitleOps Privacy Policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" title="SubtitleOps Terms of Service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" title="Contact SubtitleOps" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} SubtitleOps
        </div>
      </div>
    </footer>
  );
}
