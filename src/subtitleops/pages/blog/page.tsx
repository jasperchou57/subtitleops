import type { LegacyMetadata as Metadata } from '@/lib/legacy-metadata';
import Link from '@/compat/next-link';

export const metadata: Metadata = {
  title: 'Subtitle Tools Blog — Guides, Tips & Format Explanations',
  description:
    'Learn about subtitle formats, conversion workflows, and best practices for working with SRT, ASS, VTT, and TXT subtitle files.',
  alternates: { canonical: '/blog' },
  openGraph: { url: '/blog' },
};

const posts = [
  {
    slug: 'how-to-fix-subtitle-delay-online',
    title: 'How to Fix Subtitle Delay Online',
    excerpt:
      'Learn how to fix subtitles that appear too early, too late, or drift out of sync. Includes when to use timing shift versus FPS conversion.',
    date: '2026-05-13',
  },
  {
    slug: 'what-is-ass-subtitle-file',
    title: 'What Is an ASS Subtitle File? Advanced SubStation Alpha Explained',
    excerpt:
      'Learn what an ASS subtitle file is, why it supports styling and positioning, and when to keep ASS instead of converting to SRT.',
    date: '2026-05-13',
  },
  {
    slug: 'what-is-vtt-file',
    title: 'What Is a VTT File? WebVTT Captions Explained',
    excerpt:
      'Learn what a VTT file is, how WebVTT captions work, and when to use VTT instead of SRT. Includes syntax examples, browser use cases, and conversion tips.',
    date: '2026-05-13',
  },
  {
    slug: 'what-is-srt-file',
    title: 'What Is an SRT File? Format Structure Explained',
    excerpt:
      'Learn what an SRT file is, how the SubRip subtitle format works, and where SRT files are used. Includes format anatomy, real examples, and common problems.',
    date: '2026-03-30',
  },
  {
    slug: 'srt-vs-vtt-which-subtitle-format',
    title: 'SRT vs VTT — Which Subtitle Format Should You Use?',
    excerpt:
      'SRT and VTT look almost identical but behave differently in browsers, players, and editors. Learn when each format is the right choice and how to convert between them.',
    date: '2026-03-23',
  },
  {
    slug: 'ass-vs-srt-when-to-convert',
    title:
      'ASS vs SRT — When Should You Convert and When Should You Keep the Original?',
    excerpt:
      'ASS subtitle files carry rich styling that SRT cannot represent. This guide explains when converting ASS to SRT makes sense and when keeping the original format is the better choice.',
    date: '2026-03-22',
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        Subtitle Tools Blog
      </h1>
      <p className="text-muted-foreground mb-12">
        Guides, tips, and format explanations for working with subtitle files.
      </p>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link
              href={`/blog/${post.slug}`}
              title={post.title}
              className="block"
            >
              <time className="text-xs text-muted-foreground">{post.date}</time>
              <h2 className="text-xl font-semibold mt-1 group-hover:underline underline-offset-4">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
