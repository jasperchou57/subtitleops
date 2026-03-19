import Link from "next/link";

const navTools = [
  { name: "ASS to SRT", href: "/tools/ass-to-srt" },
  { name: "VTT to SRT", href: "/tools/vtt-to-srt" },
  { name: "TXT to SRT", href: "/tools/txt-to-srt" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt" },
  { name: "SRT to TXT", href: "/tools/srt-to-txt" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 15h14M5 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-base font-semibold tracking-tight">
            SubtitleOps
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {navTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              {tool.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
