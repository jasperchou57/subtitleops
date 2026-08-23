import type { LegacyMetadata as Metadata } from '@/lib/legacy-metadata';
import Link from '@/compat/next-link';
import {
  ArrowRight,
  CheckCircle2,
  CircleSlash2,
  FileOutput,
  FilePlus2,
  FileText,
  TimerReset,
} from 'lucide-react';
import { ToolCard } from '@/components/tools/tool-card';
import { JsonLd, toolsPageJsonLd } from '@/components/seo/json-ld';
import {
  getSubtitleToolsByCategory,
  subtitleToolCategories,
  subtitleTools,
  type SubtitleToolCategoryId,
} from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Subtitle Tools for Conversion, Text & Timing',
  description:
    'Browse SubtitleOps subtitle tools by task: convert SRT, VTT and ASS, extract clean text, create SRT drafts, or fix timing. Start with one file.',
  alternates: { canonical: '/tools' },
  openGraph: { url: '/tools' },
};

const toolsJsonLd = toolsPageJsonLd(subtitleTools);

const toolRows = [
  ['ASS', 'SRT', 'Keeps text and timing; removes ASS-only styling'],
  ['VTT', 'SRT', 'Keeps text and timing; removes WebVTT-only settings'],
  ['SRT', 'VTT', 'Adds WebVTT structure for web video captions'],
  ['SRT', 'ASS', 'Creates an editable ASS base; styling still needs editing'],
  ['SBV', 'SRT', 'Rewrites YouTube SBV timing as numbered SRT cues'],
  ['SRT', 'TXT', 'Removes timing, cue numbers, and basic tags'],
  ['VTT', 'TXT', 'Removes timing, headers, settings, and caption metadata'],
  ['TXT', 'SRT draft', 'Creates rule-based cues and adjustable timestamps'],
  ['SRT / VTT', 'Shifted file', 'Moves every cue by one fixed time offset'],
  [
    'SRT / VTT',
    'FPS-adjusted file',
    'Rescales the full timeline for frame-rate drift',
  ],
] as const;

function CategoryIcon({ category }: { category: SubtitleToolCategoryId }) {
  const Icon =
    category === 'format'
      ? FileOutput
      : category === 'extract'
        ? FileText
        : category === 'create'
          ? FilePlus2
          : TimerReset;

  return <Icon className="h-5 w-5" aria-hidden="true" />;
}

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
      {toolsJsonLd.map((data) => (
        <JsonLd key={String(data['@id'])} data={data} />
      ))}

      <nav aria-label="Breadcrumb" className="text-sm text-foreground/75">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            Tools
          </li>
        </ol>
      </nav>

      <header className="max-w-3xl pt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          Choose by task
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Subtitle Tools for Every File Task
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Choose what you need to do with the subtitle file you already have.
          SubtitleOps separates format conversion, text extraction, subtitle
          drafting, and timing repair so every page has one clear job.
        </p>
      </header>

      <section aria-labelledby="task-heading" className="py-12">
        <h2 id="task-heading" className="text-2xl font-bold">
          What do you need to do?
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {subtitleToolCategories.map((category) => (
            <Link
              key={category.id}
              href={`#${category.id}`}
              className="group rounded-2xl border bg-card p-6 transition-colors hover:bg-accent"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CategoryIcon category={category.id} />
                </span>
                <ArrowRight
                  className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{category.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {category.intro}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="space-y-14 border-t pt-12">
        {subtitleToolCategories.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-24">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <CategoryIcon category={category.id} />
              </span>
              <div>
                <h2 className="text-2xl font-semibold">{category.name}</h2>
                <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {getSubtitleToolsByCategory(category.id).map((tool) => (
                <ToolCard key={tool.href} tool={tool} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16 border-t pt-14" aria-labelledby="matrix-title">
        <div className="max-w-3xl">
          <h2 id="matrix-title" className="text-2xl font-bold">
            What each subtitle tool changes
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Choose by the result you need, then check the destination page for
            exact examples and format-loss notes before downloading.
          </p>
        </div>
        <div className="mt-6 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Input
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Result
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Important change
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {toolRows.map(([input, result, change]) => (
                <tr key={`${input}-${result}`}>
                  <td className="px-4 py-3 font-medium">{input}</td>
                  <td className="px-4 py-3">{result}</td>
                  <td className="px-4 py-3 text-muted-foreground">{change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16 grid gap-5 border-t pt-14 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Available today
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Text subtitle format conversion, clean-text extraction, rule-based
            SRT drafting, fixed time shifts, and FPS timeline rescaling. Current
            single-file tools run in the browser and do not require an account.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-2 font-semibold">
            <CircleSlash2 className="h-5 w-5 text-muted-foreground" />
            Not part of these tools
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Direct audio or video transcription, automatic speech alignment, and
            subtitle translation are not presented as available features on
            these pages.
          </p>
        </div>
      </section>

      <section className="mt-12 rounded-2xl border bg-muted/30 p-7 md:flex md:items-center md:justify-between md:gap-8">
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold">
            One file now, repeat workflows when you need them
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Use the single-file tools first. If the same job keeps coming back,
            compare the Pro and Studio private beta paths for batches, presets,
            history, quality checks, and team review.
          </p>
        </div>
        <Link
          href="/pricing"
          className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background md:mt-0"
        >
          Compare repeat workflows
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
