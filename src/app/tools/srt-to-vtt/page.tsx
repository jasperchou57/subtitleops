import type { Metadata } from "next";
import Link from "next/link";
import { SrtToVttConverter } from "./converter";
import { VibeBackgroundGlow } from "@/components/ui/vibe-background-glow";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd, toolPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free SRT to VTT Converter Online",
  description: "Convert SubRip (.srt) subtitle files to WebVTT (.vtt) format for HTML5 video. Adds WEBVTT header, converts timestamps. No upload — 100% private.",
  keywords: ["srt to vtt", "convert srt to vtt", "srt to webvtt", "subtitle to vtt", "html5 subtitle converter"],
  alternates: { canonical: "/tools/srt-to-vtt" },
};

const jsonLdData = toolPageJsonLd({
  name: "SRT to VTT Converter",
  description: "Convert SRT subtitle files to WebVTT format instantly. Free, browser-based, no upload needed.",
  url: "/tools/srt-to-vtt",
  faqs: [
    { question: "Why do I need to convert SRT to VTT?", answer: "The HTML5 <track> element only accepts WebVTT files. Browsers cannot load SRT files natively, so you must convert SRT to VTT to embed subtitles in web video players." },
    { question: "What changes when converting SRT to VTT?", answer: "A WEBVTT header is added, comma-separated milliseconds become dot-separated, numeric cue indices are removed, and the file extension changes from .srt to .vtt." },
    { question: "Is my file uploaded to a server?", answer: "No. The SRT to VTT conversion runs entirely in your browser using JavaScript. Your subtitle file never leaves your device." },
    { question: "Does converting SRT to VTT affect subtitle timing?", answer: "No. All timestamps and dialogue text are preserved exactly during SRT to VTT conversion. Only the format syntax changes." },
    { question: "Can I add VTT styling after converting from SRT?", answer: "Yes. After converting SRT to VTT, you can manually add cue settings like position, align, and line, as well as CSS ::cue styling rules that WebVTT supports." },
    { question: "Which platforms require VTT format?", answer: "YouTube, Netflix web player, Coursera, Udemy, Vimeo, and any website using HTML5 <video><track> elements all require or prefer WebVTT format." },
    { question: "Does SRT to VTT conversion support all languages?", answer: "Yes. The converter preserves UTF-8 encoding, supporting all languages including Chinese, Japanese, Korean, Arabic, and European languages." },
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
          Free SRT to VTT Converter Online
        </h1>
        <p className="relative mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Convert SubRip (.srt) subtitle files to WebVTT (.vtt) format with this free online SRT to VTT converter.
          The tool adds the required WEBVTT header, converts comma timestamps to dot notation, and removes numeric indices.
          Your SRT file is processed entirely in your browser — nothing is uploaded to any server.
        </p>
        <div className="mt-8"><SrtToVttConverter /></div>
        <div className="mt-6 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Need the reverse?</span>{" "}
          Convert VTT back to SubRip with our{" "}
          <Link href="/tools/vtt-to-srt" className="font-medium underline underline-offset-4 hover:text-foreground/70">VTT to SRT converter</Link>.
        </div>
      </section>

      {/* ===== Zone 2: Landing Page Content ===== */}
      <section className="pb-12 border-t pt-10">
        <h2 className="text-2xl font-bold mb-6">How to Convert SRT to VTT in 3 Steps</h2>
        <ol className="grid gap-4 md:grid-cols-3 mb-8">
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">1</span>
            <h3 className="font-semibold mb-1">Upload SRT File</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your .srt subtitle file into the SRT to VTT converter above, or click the upload area to browse your files. The converter accepts any valid SubRip file regardless of size or language.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">2</span>
            <h3 className="font-semibold mb-1">Automatic SRT to VTT Conversion</h3>
            <p className="text-sm text-muted-foreground">
              The SRT to VTT conversion happens instantly in your browser. A WEBVTT header is added, comma-separated timestamps are converted to dot notation, and numeric cue indices are removed to produce valid WebVTT output.
            </p>
          </li>
          <li className="rounded-lg border bg-card p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold mb-3">3</span>
            <h3 className="font-semibold mb-1">Preview and Download VTT</h3>
            <p className="text-sm text-muted-foreground">
              Review the before and after comparison showing your original SRT content alongside the converted VTT output. When satisfied with the SRT to VTT result, download the .vtt file with a single click.
            </p>
          </li>
        </ol>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Why Convert SRT to VTT?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          WebVTT is the only subtitle format natively supported by the HTML5 {"<track>"} element. Web browsers cannot load SRT files directly — if you try to use an .srt file with a {"<video>"} tag, the subtitles simply will not appear. Converting SRT to VTT is therefore essential for anyone embedding captions on a website, whether you are building an e-learning platform, a video portfolio, or a media-rich blog.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Beyond basic browser compatibility, VTT offers significant advantages over SRT for web delivery. After you convert SRT to VTT, you gain access to cue settings that control subtitle positioning (position, align, line, size), CSS-based styling through the ::cue pseudo-element, NOTE blocks for translator and editor comments, and support for vertical text rendering used in CJK (Chinese, Japanese, Korean) languages. None of these features exist in the SRT format.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Major video platforms already rely on VTT as their web subtitle standard. YouTube uses WebVTT for its web player, Netflix serves VTT captions to browsers, and educational platforms like Coursera, Udemy, and Vimeo all require or prefer VTT format for uploaded subtitles. If you have SRT files from a transcription service or subtitle editor, using an SRT to VTT converter ensures your captions are ready for these platforms without manual editing.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">What Changes During SRT to VTT Conversion</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          When you convert SRT to VTT, several specific transformations occur to produce a valid WebVTT file. Understanding what changes during SRT to VTT conversion helps you verify the output and take advantage of VTT features afterward.
        </p>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">WEBVTT header added:</span>
            Every valid WebVTT file must begin with the text WEBVTT on its first line. SRT files have no header — they start with a numeric index. The SRT to VTT converter inserts this mandatory header automatically.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Timestamp separator:</span>
            SRT uses a comma to separate milliseconds (00:01:23,456), while VTT uses a dot (00:01:23.456). Every timestamp in the file is converted from comma to dot notation during SRT to VTT conversion.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Numeric indices removed:</span>
            SRT requires a sequential number (1, 2, 3...) before each cue block. WebVTT uses optional text-based cue identifiers instead. The converter strips these numeric indices since they are not required by the VTT specification.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Text preserved exactly:</span>
            All dialogue text, line breaks, and basic formatting tags like {"<b>"}, {"<i>"}, and {"<u>"} are preserved during the SRT to VTT conversion. Your subtitle content remains identical — only the container format changes.
          </li>
          <li className="flex gap-3">
            <span className="font-medium text-foreground shrink-0 w-44">Timing unchanged:</span>
            All start and end timestamps are carried over without modification. The timing of every cue remains exactly the same after converting SRT to VTT, ensuring perfect synchronization with your video.
          </li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Web Accessibility and SRT to VTT Conversion</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Converting SRT to VTT is not just a technical requirement — it is an accessibility obligation. The Web Content Accessibility Guidelines (WCAG 2.1) Level AA require that all prerecorded video content includes synchronized captions. Since the HTML5 {"<track>"} element only supports WebVTT, converting your SRT subtitle files to VTT format is the standard path to achieving compliance on the web.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Accessible captions benefit a much wider audience than you might expect. Beyond users who are deaf or hard of hearing, captions are used by people watching videos in noisy environments, non-native speakers who need text reinforcement, and viewers who simply prefer reading along. Studies show that over 80% of people who use captions have no hearing impairment — they use captions by choice.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          After performing SRT to VTT conversion, you can enhance accessibility further by using VTT-specific features. The ::cue CSS selector lets you customize caption appearance (font size, background color, text color) to improve readability. Cue positioning settings like line and position can place subtitles away from important visual content. You can also add VTT NOTE blocks with metadata about translation choices or speaker identification, helping editors maintain caption quality over time.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">SRT vs VTT — Detailed Format Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead><tr className="bg-muted/50"><th className="text-left p-3 font-semibold">Feature</th><th className="text-left p-3 font-semibold">SRT (.srt)</th><th className="text-left p-3 font-semibold">WebVTT (.vtt)</th></tr></thead>
            <tbody className="divide-y">
              <tr><td className="p-3 font-medium">File header</td><td className="p-3 text-muted-foreground">No header, starts with index number</td><td className="p-3 text-muted-foreground">Required WEBVTT header on first line</td></tr>
              <tr><td className="p-3 font-medium">Timestamp separator</td><td className="p-3 text-muted-foreground">Comma for milliseconds (00:01:23,456)</td><td className="p-3 text-muted-foreground">Dot for milliseconds (00:01:23.456)</td></tr>
              <tr><td className="p-3 font-medium">Cue positioning</td><td className="p-3 text-muted-foreground">Not supported natively</td><td className="p-3 text-muted-foreground">position, align, line, size, vertical</td></tr>
              <tr><td className="p-3 font-medium">CSS styling</td><td className="p-3 text-muted-foreground">No CSS support</td><td className="p-3 text-muted-foreground">Supports ::cue pseudo-element for styling</td></tr>
              <tr><td className="p-3 font-medium">Comment blocks</td><td className="p-3 text-muted-foreground">No comment support</td><td className="p-3 text-muted-foreground">NOTE blocks for translator/editor comments</td></tr>
              <tr><td className="p-3 font-medium">Vertical text</td><td className="p-3 text-muted-foreground">Not supported</td><td className="p-3 text-muted-foreground">Supports vertical:rl and vertical:lr for CJK</td></tr>
              <tr><td className="p-3 font-medium">Browser support</td><td className="p-3 text-muted-foreground">Cannot be loaded by HTML5 {"<track>"}</td><td className="p-3 text-muted-foreground">Native support in all modern browsers</td></tr>
              <tr><td className="p-3 font-medium">Primary use case</td><td className="p-3 text-muted-foreground">Desktop players, video editing software</td><td className="p-3 text-muted-foreground">Web video, streaming platforms, HTML5</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          The table above illustrates why SRT to VTT conversion is necessary for web delivery. SRT remains the most widely supported format across desktop video players like VLC and editing tools like Premiere Pro. However, for any web-based application using HTML5 {"<video>"} and {"<track>"} elements, converting SRT to VTT is mandatory because browsers do not parse the SRT format.
        </p>
      </section>

      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Common Use Cases for SRT to VTT Conversion</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Web video embedding:</span> The most common reason to convert SRT to VTT is embedding subtitles on a website. The HTML5 {"<video><track>"} tag pair requires WebVTT files. If you have SRT subtitles from a transcription service, converting SRT to VTT makes them ready for your web player.</li>
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Platform uploads:</span> YouTube, Vimeo, Coursera, and Udemy accept VTT uploads for caption tracks. If your subtitles were created in SRT format, a quick SRT to VTT conversion prepares them for upload without manual reformatting.</li>
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Accessibility compliance:</span> Meeting WCAG 2.1 Level AA requirements means providing captions for video content. Since web captions use VTT, converting SRT to VTT is a necessary step toward legal and ethical accessibility compliance.</li>
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">E-learning content:</span> Online course creators often receive subtitles in SRT format from translators or AI transcription tools. Converting SRT to VTT ensures compatibility with learning management systems that use HTML5 video players.</li>
          <li className="flex gap-3"><span className="font-medium text-foreground shrink-0">Enhanced styling:</span> After converting SRT to VTT, content creators can add CSS ::cue styling rules to customize caption appearance, use positioning settings to avoid overlapping on-screen text, and add NOTE blocks for production comments.</li>
        </ul>
      </section>

      {/* ===== Zone 3: FAQ + Related Tools ===== */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          <AccordionItem value="why-vtt">
            <AccordionTrigger>Why do I need to convert SRT to VTT?</AccordionTrigger>
            <AccordionContent>
              The HTML5 {"<track>"} element only accepts WebVTT files for displaying subtitles in web browsers. Browsers cannot natively load or parse SRT files. If you are embedding captions in a website or uploading subtitles to a streaming platform, you must convert SRT to VTT first. This is not a preference — it is a technical requirement of the web platform.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="what-changes">
            <AccordionTrigger>What exactly changes during SRT to VTT conversion?</AccordionTrigger>
            <AccordionContent>
              During SRT to VTT conversion, three main changes occur: (1) A WEBVTT header line is added at the beginning of the file. (2) Timestamp millisecond separators change from commas to dots (00:01:23,456 becomes 00:01:23.456). (3) Numeric cue indices (1, 2, 3...) are removed since VTT does not require them. All dialogue text, timing, and basic formatting tags are preserved exactly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="styling">
            <AccordionTrigger>Can I add styling to my VTT file after converting from SRT?</AccordionTrigger>
            <AccordionContent>
              Yes. One of the major advantages of converting SRT to VTT is gaining access to WebVTT styling features. You can add cue settings like position:50%, align:center, and line:80% directly after the timestamp arrow to control subtitle placement. You can also use the CSS ::cue pseudo-element in your stylesheet to customize font, color, background, and size of captions. These styling capabilities do not exist in the SRT format.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="accessibility">
            <AccordionTrigger>How does SRT to VTT conversion help with web accessibility?</AccordionTrigger>
            <AccordionContent>
              WCAG 2.1 Level AA guidelines require synchronized captions for all prerecorded video content on the web. Since the HTML5 {"<track>"} element only supports VTT format, converting your SRT subtitles to VTT is the standard method for achieving caption compliance. WebVTT also supports accessibility-friendly features like customizable caption styling and precise positioning that help users with different needs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="platforms">
            <AccordionTrigger>Which platforms require VTT instead of SRT?</AccordionTrigger>
            <AccordionContent>
              Any website using the HTML5 {"<video><track>"} element requires VTT format. Major platforms that use or prefer WebVTT include YouTube (for web player captions), Netflix (web browser delivery), Coursera, Udemy, Vimeo, and most modern learning management systems. Converting SRT to VTT ensures your subtitles are compatible with all these platforms.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger>Is my SRT file safe and private?</AccordionTrigger>
            <AccordionContent>
              Absolutely. All SRT to VTT conversion processing happens directly in your web browser using client-side JavaScript. Your subtitle file is never uploaded to any server, never transmitted over the internet, and never stored anywhere. We have zero access to your files. This makes our SRT to VTT converter the most private option available — your data never leaves your device.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="batch">
            <AccordionTrigger>Can I batch convert multiple SRT files to VTT?</AccordionTrigger>
            <AccordionContent>
              The free version of our SRT to VTT converter processes one file at a time. Batch SRT to VTT conversion for multiple files will be available in our premium plan. Each file is processed entirely in your browser for maximum privacy and speed.
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
