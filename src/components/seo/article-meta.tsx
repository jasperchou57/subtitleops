import Link from '@/compat/next-link';

const UPDATED_DATE = '2026-07-19';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export function ArticleMeta({ datePublished }: { datePublished: string }) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span>
        By{' '}
        <Link href="/about" title="About SubtitleOps" className="underline">
          SubtitleOps
        </Link>
      </span>
      <time dateTime={datePublished}>
        Published {formatDate(datePublished)}
      </time>
      <time dateTime={UPDATED_DATE}>Updated {formatDate(UPDATED_DATE)}</time>
    </div>
  );
}

export function ArticleHeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={1200}
      height={630}
      className="mb-10 h-auto w-full rounded-2xl border"
      loading="eager"
      fetchPriority="high"
    />
  );
}
