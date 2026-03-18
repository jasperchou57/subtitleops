import type { Metadata } from "next";
import Link from "next/link";
import { SrtToTxtConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free SRT to TXT Converter — Extract Text from SRT Subtitles Online",
  description: "Convert SRT to TXT instantly. Strips timestamps, index numbers, and formatting tags to produce clean plain text. Perfect for transcripts, translation, and text analysis.",
  keywords: ["srt to txt", "srt to text", "extract text from srt", "subtitle to text", "srt to plain text", "subtitle transcript", "srt text extractor"],
  alternates: { canonical: "/tools/srt-to-txt" },
};

const jsonLdData = toolPageJsonLd({
  name: "SRT to TXT Converter",
  description: "Convert SRT subtitle files to plain text. Strips timestamps, index numbers, and formatting to extract clean dialogue text. Free, browser-based, no upload.",
  url: "/tools/srt-to-txt",
  faqs: [
    { question: "What gets removed when I convert SRT to TXT?", answer: "All SRT-specific data is stripped: subtitle index numbers, timestamp lines, the arrow separator, and HTML formatting tags like bold and italic. Only the pure dialogue text remains." },
    { question: "Are SDH annotations like [music] removed?", answer: "No. The SRT to TXT converter preserves all text content including SDH annotations such as [music], [applause], and [laughter]. Use SRT Cleaner if you need those removed." },
    { question: "Is my subtitle file uploaded to a server?", answer: "No. All SRT to TXT conversion happens entirely in your browser using client-side JavaScript. Your file never leaves your device." },
    { question: "Can I convert SRT to text for multiple languages?", answer: "Yes. The converter outputs clean UTF-8 text, supporting all languages including Chinese, Japanese, Korean, Arabic, and Cyrillic characters." },
    { question: "How does the converter handle multi-line subtitle entries?", answer: "Multi-line entries within a single subtitle cue are joined into one line in the output, producing one clean line of text per subtitle entry." },
    { question: "Can I use the extracted text for NLP or text analysis?", answer: "Absolutely. The SRT to TXT output is clean UTF-8 plain text ideal for word frequency counting, sentiment analysis, NLP pipelines, and creating word clouds." },
    { question: "What is the difference between SRT to TXT and SRT Cleaner?", answer: "SRT to TXT strips everything except dialogue text, removing all timestamps and formatting. SRT Cleaner keeps the SRT format intact but removes SDH annotations, hearing-impaired tags, and formatting artifacts." },
  ],
});

const relatedTools = [
  { name: "TXT to SRT", href: "/tools/txt-to-srt" },
  { name: "ASS to SRT", href: "/tools/ass-to-srt" },
  { name: "VTT to SRT", href: "/tools/vtt-to-srt" },
  { name: "SRT to VTT", href: "/tools/srt-to-vtt" },
  { name: "SRT Cleaner", href: "/tools/srt-cleaner" },
];

export default function SrtToTxtPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {jsonLdData.map((data, i) => <JsonLd key={i} data={data} />)}

      {/* ===== Zone 1: Tool (Hero) ===== */}
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          SRT to TXT — Extract Text from SRT Subtitles
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Convert SRT to TXT by stripping all timestamps, index numbers, and HTML formatting tags from your subtitle file.
          This free SRT to text converter produces clean, readable plain text output that you can open in any text editor.
          Everything runs in your browser — your subtitle file is never uploaded to a server.
        </p>
        <div className="mt-8"><SrtToTxtConverter /></div>
        <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Have plain text and need subtitles?</span>{" "}
          Use our{" "}
          <Link href="/tools/txt-to-srt" className="font-medium underline underline-offset-4 hover:text-foreground/70">TXT to SRT converter</Link>{" "}
          to generate timed subtitles from a text file automatically.
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Convert SRT to TXT in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">1</span>
            <h3 className="font-semibold mb-1">Upload Your SRT File</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your .srt subtitle file into the SRT to TXT converter above, or click the upload area to browse your files. The tool accepts any valid SRT file encoded in UTF-8.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">2</span>
            <h3 className="font-semibold mb-1">Automatic SRT to Text Extraction</h3>
            <p className="text-sm text-muted-foreground">
              The SRT to TXT conversion happens instantly in your browser. Index numbers, timestamps, and HTML formatting tags are stripped away, leaving only the pure dialogue text from your subtitle file.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">3</span>
            <h3 className="font-semibold mb-1">Preview and Download TXT</h3>
            <p className="text-sm text-muted-foreground">
              Review the extracted text in the preview panel. When you are satisfied with the output, download the clean .txt file with a single click. The result is a plain text file you can open anywhere.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">What Gets Removed During SRT to TXT Extraction</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          An SRT file contains much more than just dialogue text. When you convert SRT to TXT, our extractor systematically removes all structural and formatting data that is specific to the SRT subtitle format. Understanding exactly what gets stripped helps you know what to expect from the SRT to text output.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Index numbers:</span>
            Every subtitle entry in an SRT file begins with a sequential number (1, 2, 3, and so on). These index numbers serve only as identifiers within the SRT format and carry no dialogue meaning. The SRT to TXT converter strips all index numbers from the output.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Timestamp lines:</span>
            Each SRT entry includes a timing line such as 00:01:15,000 --&gt; 00:01:18,500 that tells video players when to display and hide the subtitle. Since plain text has no concept of timing, the entire timestamp line is removed during the SRT to text conversion.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">HTML formatting tags:</span>
            SRT files sometimes contain basic HTML tags like {"<b>"} for bold, {"<i>"} for italic, {"<u>"} for underline, and {"<font color=\"...\">"} for colored text. All these markup tags are stripped to produce clean, unformatted plain text in the TXT output.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Blank separator lines:</span>
            SRT uses blank lines to separate one subtitle entry from the next. These structural blank lines are removed, and each subtitle entry becomes a single line in the resulting TXT file.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Multi-line joins:</span>
            When a subtitle entry spans two or more lines within a single cue (for example, a long sentence split across two lines for readability on screen), the SRT to TXT converter joins those lines into a single line. This produces one clean line of text per subtitle entry.
          </li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          One important note: SDH (Subtitles for the Deaf and Hard-of-Hearing) annotations such as [music], [applause], [laughter], and speaker labels like JOHN: are preserved by default when you convert SRT to TXT. These are part of the dialogue text content, not SRT formatting. If you need to remove SDH annotations as well, use our{" "}
          <Link href="/tools/srt-cleaner" className="font-medium underline underline-offset-4 hover:text-foreground/70">SRT Cleaner</Link>{" "}
          tool before extracting text.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Common Use Cases for SRT to TXT Conversion</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          There are many reasons people convert SRT to TXT. Extracting plain text from subtitle files opens up possibilities that go far beyond simply reading dialogue. Here are the most popular use cases for SRT to text extraction.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Creating transcripts:</span>
            Convert SRT to TXT to produce readable transcripts from movie, TV show, or lecture subtitles. Students often extract text from lecture subtitles to create study notes they can highlight, annotate, and review without dealing with timestamps.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Translation workflows:</span>
            Many translation tools and services work best with plain text input. By converting SRT to text first, you can feed clean dialogue into Google Translate, DeepL, or professional translation memory tools without timestamp noise corrupting the output.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Text analysis and NLP:</span>
            Researchers and data scientists use SRT to TXT conversion to prepare subtitle data for natural language processing. The extracted text is ideal for word frequency counting, sentiment analysis, topic modeling, and other computational linguistics tasks.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Word clouds and visualization:</span>
            Some users convert SRT to text to create word clouds from movie dialogue. By extracting the plain text, you can pipe it into visualization tools to see which words and phrases appear most frequently in a film or TV series.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Language learning:</span>
            Language learners extract dialogue text from foreign-language movie subtitles to build vocabulary lists, study sentence patterns, and create flashcards. Having the dialogue as plain text makes it easy to look up unfamiliar words and phrases.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Searchable text indexes:</span>
            Converting SRT to TXT allows you to create searchable text archives of video content. By indexing the extracted text, you can quickly search across thousands of subtitle files to find specific dialogue, quotes, or scenes.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Content review:</span>
            Editors and content reviewers use SRT to text extraction to quickly scan all dialogue in a video without watching it. This is useful for checking script accuracy, reviewing content for compliance, or auditing subtitles before distribution.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">SRT to TXT Output Format</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          When you convert SRT to TXT with our tool, the output is a clean UTF-8 encoded plain text file. Each subtitle entry becomes exactly one line of text. Multi-line subtitle entries are joined with a space so that no dialogue is lost. The resulting .txt file can be opened in any text editor on any operating system, including Notepad on Windows, TextEdit on macOS, and any code editor like VS Code or Sublime Text.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The SRT to text output preserves the original order of subtitle entries, so lines appear in the same chronological sequence as they do in the video. This makes the extracted text easy to follow as a readable transcript from start to finish. If your SRT file contains entries in multiple languages, all text is preserved regardless of language or character set.
        </p>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="what-removed">
            <AccordionTrigger>What gets removed when I convert SRT to TXT?</AccordionTrigger>
            <AccordionContent>
              All SRT-specific structural data is stripped during the SRT to TXT conversion: subtitle index numbers (1, 2, 3...), timestamp lines with the arrow separator (00:00:01,000 --&gt; 00:00:04,000), and HTML formatting tags like bold, italic, underline, and font color. Only the pure dialogue text remains in the output file. The result is one line of clean text per subtitle entry.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sdh">
            <AccordionTrigger>Does the SRT to TXT converter remove SDH annotations like [music]?</AccordionTrigger>
            <AccordionContent>
              No. The SRT to text extractor preserves all text content including SDH (Subtitles for the Deaf and Hard-of-Hearing) annotations such as [music], [applause], [laughter], and speaker identification labels. These are considered part of the dialogue text, not SRT formatting. If you want to remove SDH annotations, run your file through our <Link href="/tools/srt-cleaner" className="underline underline-offset-4 hover:text-foreground/70">SRT Cleaner</Link> tool first, then convert the cleaned SRT to TXT.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="multiline">
            <AccordionTrigger>How are multi-line subtitle entries handled?</AccordionTrigger>
            <AccordionContent>
              When a single subtitle cue contains text that spans multiple lines (which is common for long sentences split for on-screen readability), the SRT to TXT converter joins those lines into a single line with a space between them. The output contains exactly one line per subtitle entry, making it clean and easy to process further.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my SRT file safe and private during conversion?</AccordionTrigger>
            <AccordionContent>
              Yes. All SRT to TXT conversion processing happens entirely in your web browser using client-side JavaScript. Your subtitle file is never uploaded to any server, never transmitted over the internet, and never stored anywhere. We have zero access to your files. This makes our SRT to TXT converter the most private option available for extracting text from subtitles.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="languages">
            <AccordionTrigger>Can I convert SRT to text for non-English subtitles?</AccordionTrigger>
            <AccordionContent>
              Absolutely. The SRT to TXT converter outputs clean UTF-8 encoded text, which supports all languages and writing systems. This includes Chinese, Japanese, Korean, Arabic, Hebrew, Thai, Hindi, Cyrillic, and all European languages. Character encoding is preserved exactly during the SRT to text extraction process.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="nlp">
            <AccordionTrigger>Can I use SRT to TXT output for text analysis or NLP?</AccordionTrigger>
            <AccordionContent>
              Yes. The extracted plain text is ideal for computational text analysis. Researchers commonly use SRT to TXT conversion to prepare subtitle data for word frequency counting, sentiment analysis, topic modeling, named entity recognition, and other NLP tasks. The clean output can be directly loaded into Python, R, or any text analysis toolkit without additional preprocessing.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="difference-cleaner">
            <AccordionTrigger>What is the difference between SRT to TXT and SRT Cleaner?</AccordionTrigger>
            <AccordionContent>
              These two tools serve different purposes. SRT to TXT extracts only the dialogue text, completely removing all SRT structure including index numbers, timestamps, and formatting. The output is a plain .txt file. SRT Cleaner, on the other hand, keeps the SRT format intact (with indices, timestamps, and structure) but removes unwanted content like SDH annotations, hearing-impaired tags, and formatting artifacts. Use SRT to TXT when you need plain text; use SRT Cleaner when you need a cleaner SRT file.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="pb-16">
        <h2 className="text-lg font-semibold mb-4">Related Subtitle Tools</h2>
        <div className="flex flex-wrap gap-2">
          {relatedTools.map((t) => (
            <Link key={t.href} href={t.href} className="inline-flex items-center rounded-lg border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors">
              {t.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
