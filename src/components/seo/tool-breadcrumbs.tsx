import Link from '@/compat/next-link';

export function ToolBreadcrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="pt-5 text-sm text-foreground/75">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link
            href="/"
            title="SubtitleOps home"
            className="hover:text-foreground"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            href="/tools"
            title="All subtitle tools"
            className="hover:text-foreground"
          >
            Tools
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-foreground">
          {current}
        </li>
      </ol>
    </nav>
  );
}
