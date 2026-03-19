import type { Metadata } from "next";
import Link from "next/link";
import { SrtToVttConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free SRT to VTT Converter Online",
  description: "Convert SRT subtitle files to WebVTT format for browser-based video and HTML5 caption delivery. Add the required header, rewrite timestamps, and export a clean VTT file.",
  keywords: ["srt to vtt", "convert srt to vtt", "srt to webvtt", "subtitle to vtt"],
  alternates: { canonical: "/tools/srt-to-vtt" },
};

const jsonLdData = toolPageJsonLd({
  name: "SRT to VTT Converter",
  description: "Convert SRT subtitle files to WebVTT format for browser-based video and HTML5 caption delivery. Add the required header, rewrite timestamps, and export a clean VTT file.",
  url: "/tools/srt-to-vtt",
  faqs: [
    { question: "Why do I need to convert SRT to VTT?", answer: "Because browser-based video workflows usually expect WebVTT rather than raw SRT. If the subtitle file is headed for web delivery, VTT is often the correct output format." },
    { question: "What changes when converting SRT to VTT?", answer: "The converter adds the WEBVTT header, rewrites timestamp punctuation, removes SRT cue numbers, and outputs a clean VTT file." },
    { question: "Does the conversion affect subtitle timing?", answer: "No. The timing is preserved. Only the file syntax is rewritten for WebVTT compatibility." },
    { question: "Can I style the file after converting to VTT?", answer: "Yes. Once you have WebVTT output, you can extend it with cue settings or related web caption styling as needed." },
    { question: "Is my subtitle file uploaded anywhere?", answer: "No. The SRT to VTT conversion happens in the browser, and your file stays on your device." },
    { question: "Does the conversion support all languages?", answer: "Yes. The converter preserves UTF-8 encoding, so it works with all languages including CJK characters, Arabic, and European languages." },
    { question: "What is the difference between SRT and WebVTT in practice?", answer: "SRT is the simpler, more universal working format. WebVTT is the more web-native delivery format. If a subtitle file is headed into a browser environment, WebVTT is often the cleaner final output even when the project originally produced SRT upstream." },
  ],
});

const relatedTools = [
  { name: "VTT to SRT", href: "/tools/vtt-to-srt" },
  { name: "ASS to SRT", href: "/tools/ass-to-srt" },
  { name: "TXT to SRT", href: "/tools/txt-to-srt" },
  { name: "SRT to TXT", href: "/tools/srt-to-txt" },
  { name: "Subtitle Merger", href: "/tools/subtitle-merger" },
];

export default function SrtToVttPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {jsonLdData.map((data, i) => <JsonLd key={i} data={data} />)}

      {/* ===== Zone 1: Tool (Hero) ===== */}
      <section className="relative py-10 md:py-14">
        <VibeBackgroundGlow />
        <h1 className="relative text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Convert SRT to VTT for HTML5 Video
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Use this free SRT to VTT converter when your subtitle file needs to work in a browser-based video player or any workflow built around WebVTT. The tool adds the WEBVTT header, rewrites timestamp punctuation, removes numbered cue indices, and produces browser-ready caption output while preserving your subtitle text and timing.
        </p>
        <div className="mt-8"><SrtToVttConverter /></div>
        <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Need a universal subtitle format again after editing?</span>{" "}
          Use the{" "}
          <Link href="/tools/vtt-to-srt" className="font-medium underline underline-offset-4 hover:text-foreground/70">VTT to SRT page</Link>{" "}
          to move WebVTT captions back into a simpler delivery format.
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Convert SRT to VTT in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">1</span>
            <h3 className="font-semibold mb-1">Upload Your SRT File</h3>
            <p className="text-sm text-muted-foreground">
              Drop a standard .srt subtitle file into the converter. This works well for subtitles exported from editors, transcription tools, and subtitle marketplaces.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">2</span>
            <h3 className="font-semibold mb-1">Rewrite the File for WebVTT Output</h3>
            <p className="text-sm text-muted-foreground">
              The converter transforms the SRT structure into WebVTT syntax by adding the required header and adjusting timestamp formatting.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">3</span>
            <h3 className="font-semibold mb-1">Download the VTT File for Web Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Once the conversion is finished, you get a .vtt file that is ready for HTML5 video players and related web caption workflows.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Why People Convert SRT to VTT</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          The main reason is web delivery. SRT is still one of the most common subtitle working formats, especially in editing and transcription workflows. But browser-based video players are built around WebVTT. If your subtitle file is leaving the editor and moving onto a website, a learning platform, or a custom player, VTT is often the safer output. Platforms like YouTube accept WebVTT uploads directly for manual captioning, and course platforms such as Coursera and Udemy prefer this format for their embedded players. Many LMS tools including Moodle and Canvas also rely on browser-native caption rendering, making a VTT file the most compatible choice for educational content.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This conversion is also useful when you want access to WebVTT-specific behavior after the file is converted. WebVTT can be extended with cue settings and styled in web environments more naturally than plain SRT.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">What Changes During SRT to VTT Conversion</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">WEBVTT header added:</span>
            WebVTT files begin with a required header. SRT files do not, so the converter inserts it automatically. Without this header, browsers will reject the file as invalid and captions will not render.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Timestamps switch format:</span>
            SRT uses comma-separated milliseconds. WebVTT uses dots. This is one of the most important syntax changes, and even a single misplaced comma will cause parsing errors in compliant players.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Numeric cue indices removed:</span>
            SRT normally includes numbered entries. WebVTT does not require them, so the file is normalized into WebVTT-style cues. Removing these indices also reduces file size slightly, which helps with faster loading in web environments.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Text and timing preserved:</span>
            The goal is to change the container format, not the subtitle content. The converted file keeps the text and timing you already have. This means you can verify the output against your original captions without re-checking every cue.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Web Delivery and Accessibility Context</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          If captions are part of your web publishing workflow, WebVTT is usually the more natural target format. It aligns with browser-based caption delivery and gives teams room to extend subtitle presentation later when needed.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          That does not mean every SRT file must become VTT. But if the next step is a browser player, course platform, or web-based media product, the conversion keeps the subtitle file aligned with the environment where it will be used.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          From a compliance perspective, WCAG 2.1 Success Criterion 1.2.2 requires synchronized captions for prerecorded audio content. WebVTT is the format best supported by the HTML5 track element, which is the standard mechanism for meeting this requirement in web contexts. Using a browser-native caption file helps teams satisfy accessibility audits without relying on third-party player plugins.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Users searching for a way to convert subtitle files for web playback usually have a specific job in front of them: a web player, a learning product, a course upload, or a publishing team asking for WebVTT instead of SRT. Framing the conversion around those real delivery scenarios matters more than explaining syntax differences alone.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Common Use Cases for SRT to VTT</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Preparing captions for web players:</span>
            Teams often receive subtitles in SRT because that is what transcription vendors and editors export. VTT is the version they need once those captions move into a website. This is especially common for marketing teams embedding product demos or promotional clips with the HTML5 track element.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Moving subtitle work from post-production into publishing:</span>
            SRT is common upstream. WebVTT is common downstream. This tool bridges that gap. Production houses and freelance editors frequently hand off caption files in SRT, and the publishing team can convert them here before deployment.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Creating browser-ready caption files without manual editing:</span>
            Instead of manually adding headers and changing timestamps line by line, the converter handles the syntax rewrite automatically. This eliminates a tedious and error-prone step, particularly for files with hundreds of cues.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Opening the door to WebVTT features later:</span>
            Once the file is in VTT format, you can add cue settings or styling in later steps if the publishing workflow requires it. Features like positioning, alignment, and CSS-based caption styling become available only after the file is in a browser-ready format.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0">Standardizing subtitle output for front-end teams:</span>
            Sometimes the subtitle work was done elsewhere and the web team simply needs a browser-compatible file. Converting to the browser-native format is often the handoff step between post-production and implementation.
          </li>
        </ul>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="why-convert">
            <AccordionTrigger>Why do I need to convert SRT to VTT?</AccordionTrigger>
            <AccordionContent>
              Because browser-based video workflows usually expect WebVTT rather than raw SRT. If the subtitle file is headed for web delivery, VTT is often the correct output format.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="what-changes">
            <AccordionTrigger>What changes when converting SRT to VTT?</AccordionTrigger>
            <AccordionContent>
              The converter adds the WEBVTT header, rewrites timestamp punctuation, removes SRT cue numbers, and outputs a clean VTT file.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="timing">
            <AccordionTrigger>Does the conversion affect subtitle timing?</AccordionTrigger>
            <AccordionContent>
              No. The timing is preserved. Only the file syntax is rewritten for WebVTT compatibility.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="styling">
            <AccordionTrigger>Can I style the file after converting to VTT?</AccordionTrigger>
            <AccordionContent>
              Yes. Once you have WebVTT output, you can extend it with cue settings or related web caption styling as needed.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my subtitle file uploaded anywhere?</AccordionTrigger>
            <AccordionContent>
              No. The SRT to VTT conversion happens in the browser, and your file stays on your device.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="languages">
            <AccordionTrigger>Does the conversion support all languages?</AccordionTrigger>
            <AccordionContent>
              Yes. The converter preserves UTF-8 encoding, so it works with all languages including CJK characters, Arabic, and European languages.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="srt-vs-vtt">
            <AccordionTrigger>What is the difference between SRT and WebVTT in practice?</AccordionTrigger>
            <AccordionContent>
              SRT is the simpler, more universal working format. WebVTT is the more web-native delivery format. If a subtitle file is headed into a browser environment, WebVTT is often the cleaner final output even when the project originally produced SRT upstream.
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
