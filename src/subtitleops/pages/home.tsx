import Link from '@/compat/next-link';
import {
  ArrowRight,
  CheckCircle2,
  CircleSlash2,
  FileOutput,
  FilePlus2,
  FileText,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from 'lucide-react';
import { VibeBackgroundGlow } from '@/components/ui/vibe-background-glow';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { JsonLd, homepageJsonLd } from '@/components/seo/json-ld';

const homepageFaqs = [
  {
    question: 'Is SubtitleOps a free subtitle converter?',
    answer:
      'The current single-file subtitle tools are available without a paid plan or account. Pro and Studio are separate private beta paths for repeat workflows such as batches, presets, history, quality checks, and team review.',
  },
  {
    question: 'Does SubtitleOps upload my subtitle file?',
    answer:
      'Each current converter reads and transforms the source file in your browser. The source subtitle is not sent to a conversion endpoint. Any future workspace save action must be separate and explicit.',
  },
  {
    question: 'Can I convert a subtitle file to SRT?',
    answer:
      'Yes. Use ASS to SRT, VTT to SRT, or SBV to SRT based on the file you already have. If you only have plain text, TXT to SRT creates an editable timed draft.',
  },
  {
    question: 'Does TXT to SRT synchronize subtitles to speech?',
    answer:
      'No. TXT to SRT creates rule-based cue timing from the start time, duration, gap, and split settings you choose. The result is a draft that still needs review against the video or audio.',
  },
  {
    question: 'How do I fix subtitles that are out of sync?',
    answer:
      'Use Subtitle Timing Shift when every cue is early or late by roughly the same amount. If the gap grows as the video plays, use the Subtitle FPS Converter to rescale the timeline.',
  },
  {
    question: 'Does SubtitleOps translate or transcribe audio and video?',
    answer:
      'Not in the current tool set. Today SubtitleOps focuses on text subtitle format conversion, text extraction, rule-based SRT drafting, and timing correction.',
  },
  {
    question: 'When would I need Pro or Studio?',
    answer:
      'A single file belongs in the current browser tools. Pro is intended for an individual repeating the same work across batches, while Studio is intended for small teams that need shared review and larger workflows. Both remain private beta until the production purchase and entitlement flow is verified.',
  },
];

const homepageJsonLdData = homepageJsonLd(homepageFaqs);

const taskPaths = [
  {
    title: 'Convert a subtitle format',
    description:
      'Move between SRT, VTT, ASS, and SBV for the next player or editor.',
    examples: 'ASS → SRT · VTT → SRT · SRT → VTT',
    count: '5 tools',
    href: '/tools#format',
    icon: FileOutput,
  },
  {
    title: 'Extract clean text',
    description:
      'Remove subtitle timing and syntax for reading, review, or translation.',
    examples: 'SRT → TXT · VTT → TXT',
    count: '2 tools',
    href: '/tools#extract',
    icon: FileText,
  },
  {
    title: 'Create an SRT draft',
    description:
      'Turn a transcript, script, or lyrics into adjustable rule-based cues.',
    examples: 'TXT → SRT draft',
    count: '1 tool',
    href: '/tools#create',
    icon: FilePlus2,
  },
  {
    title: 'Fix subtitle timing',
    description:
      'Choose a fixed time shift or FPS rescaling based on the type of drift.',
    examples: 'Timing Shift · FPS Converter',
    count: '2 tools',
    href: '/tools#timing',
    icon: TimerReset,
  },
];

const showcases = [
  {
    task: 'SRT → TXT',
    kept: 'Dialogue order and readable cue boundaries',
    changed: 'Subtitle blocks become plain transcript text',
    removed: 'Cue numbers, timestamps, and basic tags',
    href: '/tools/srt-to-txt',
  },
  {
    task: 'SRT → VTT',
    kept: 'Dialogue and cue timing',
    changed: 'Timestamps and document header become WebVTT',
    removed: 'SRT-only numbering from the output structure',
    href: '/tools/srt-to-vtt',
  },
  {
    task: 'ASS → SRT',
    kept: 'Dialogue and available cue timing',
    changed: 'Styled ASS events become simple SRT cues',
    removed: 'Fonts, colors, positioning, karaoke, and effects',
    href: '/tools/ass-to-srt',
  },
];

export default function HomePage() {
  return (
    <>
      {homepageJsonLdData.map((data) => (
        <JsonLd key={String(data['@id'])} data={data} />
      ))}

      <section id="hero" className="relative py-16 md:py-24">
        <VibeBackgroundGlow />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-800">
            Subtitle Workflows, Under Control.
          </p>
          <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            The Subtitle Converter for Work That Repeats
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Choose the task that matches the subtitle file you have, open the
            dedicated tool, and inspect the result before download. When the
            same job repeats, move into a clearer repeat workflow.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#choose-tool"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background"
            >
              Choose a subtitle tool
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href="/tools#format"
              className="inline-flex items-center rounded-xl border bg-card px-5 py-3 text-sm font-medium"
            >
              See supported formats
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Each tool has one clear job. Uploading starts only after you choose
            the tool you need.
          </p>
        </div>
      </section>

      <section
        id="choose-tool"
        className="scroll-mt-20 border-t py-14 md:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold text-blue-700">Start here</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Choose the subtitle task first
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Tell SubtitleOps what you need to do. We will take you to the
              dedicated tool where you can add the file and review the result.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {taskPaths.map((task) => {
              const Icon = task.icon;

              return (
                <Link
                  key={task.title}
                  href={task.href}
                  className="group rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground/75">
                      {task.count}
                    </span>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {task.description}
                      </p>
                    </div>
                    <ArrowRight
                      className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-4 border-t pt-4 text-xs font-medium text-muted-foreground">
                    {task.examples}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold">How the workflow works</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-4">
            {[
              [
                '1',
                'Choose the task',
                'Start with format conversion, text extraction, SRT drafting, or timing repair.',
              ],
              [
                '2',
                'Open the dedicated tool',
                'Pick the exact input-to-output page that matches the result you need.',
              ],
              [
                '3',
                'Add the file',
                'Upload or paste content only after the tool and its boundaries are clear.',
              ],
              [
                '4',
                'Review and download',
                'Compare the source and result before treating the output as ready.',
              ],
            ].map(([number, title, description]) => (
              <li key={number} className="rounded-2xl border bg-card p-5">
                <span className="text-sm font-bold text-blue-600">
                  {number}
                </span>
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold">Choose the workflow that fits</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              [
                'Quick file task',
                'Convert or extract one file without turning the job into a project.',
              ],
              [
                'Recurring creator work',
                'Repeat the same format, timing, and delivery steps across regular releases.',
              ],
              [
                'Small-team delivery',
                'Keep file handling, review, and repeat decisions consistent across a team.',
              ],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Pro and Studio repeat workflows remain in private beta.{' '}
            <Link
              href="/pricing"
              className="font-medium underline underline-offset-4"
            >
              Compare the current plan boundaries
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-t py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-blue-600">
              Understand the result
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Three common format decisions
            </h2>
            <p className="mt-4 text-muted-foreground">
              SubtitleOps shows what stays, what changes, and what the
              destination format cannot carry before you download.
            </p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {showcases.map((item) => (
              <article
                key={item.task}
                className="rounded-2xl border bg-card p-6"
              >
                <h3 className="text-lg font-semibold">{item.task}</h3>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="font-medium text-green-700">Kept</dt>
                    <dd className="mt-1 text-muted-foreground">{item.kept}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-blue-700">Changed</dt>
                    <dd className="mt-1 text-muted-foreground">
                      {item.changed}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-amber-700">Removed</dt>
                    <dd className="mt-1 text-muted-foreground">
                      {item.removed}
                    </dd>
                  </div>
                </dl>
                <Link
                  href={item.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
                >
                  Open {item.task}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-5 px-4 sm:px-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-7">
            <ShieldCheck className="h-6 w-6 text-blue-600" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">
              Current trust boundary
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Each current converter reads and transforms the source subtitle in
              the browser. Source text is not sent to a conversion endpoint. A
              future workspace save must remain a separate user action.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-7">
            <Sparkles className="h-6 w-6 text-blue-600" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">
              Current capability boundary
            </h2>
            <div className="mt-3 space-y-3 text-sm text-muted-foreground">
              <p className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                Format conversion, text extraction, SRT drafting, shift, and FPS
                rescaling.
              </p>
              <p className="flex gap-2">
                <CircleSlash2 className="mt-0.5 h-4 w-4 shrink-0" />
                No audio/video transcription, automatic speech sync, or
                translation today.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold">Subtitle converter questions</h2>
          <Accordion className="mt-6 w-full">
            {homepageFaqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
