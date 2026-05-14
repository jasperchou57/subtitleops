import type { Metadata } from "next";
import { ToolCard } from "@/components/tools/tool-card";
import { JsonLd, toolsItemListJsonLd } from "@/components/seo/json-ld";
import { getSubtitleToolsByCategory, subtitleToolCategories, subtitleTools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Free Subtitle Tools — Convert, Extract & Draft Subtitles",
  description:
    "Browse all free subtitle tools on SubtitleOps. Convert between SRT, ASS, VTT, SBV, and TXT formats, extract transcript text, draft subtitles, or fix timing.",
  alternates: { canonical: "/tools" },
  openGraph: { url: "/tools" },
};

const toolsJsonLd = toolsItemListJsonLd(subtitleTools);

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <JsonLd data={toolsJsonLd} />
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        All Subtitle Tools
      </h1>
      <p className="text-muted-foreground mb-12">
        Pick a specific tool for dedicated features and format-specific guides.
        Every tool runs in your browser — no uploads, no sign-ups.
      </p>

      <div className="mb-12 grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
        {subtitleToolCategories.map((category) => (
          <p key={category.id}>{category.intro}</p>
        ))}
      </div>

      <div className="space-y-12">
        {subtitleToolCategories.map((category) => (
          <section key={category.id}>
            <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
            <p className="text-sm text-muted-foreground mb-5">{category.description}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {getSubtitleToolsByCategory(category.id).map((tool) => (
                <ToolCard key={tool.href} tool={tool} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
