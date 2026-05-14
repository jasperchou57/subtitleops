import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { SubtitleTool } from "@/lib/tools";

type ToolCardProps = {
  tool: Pick<SubtitleTool, "name" | "description" | "href" | "title">;
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={tool.href}
      title={tool.title}
      className="group flex items-center justify-between rounded-xl border p-5 hover:bg-accent transition-colors"
    >
      <div>
        <h3 className="font-semibold group-hover:underline underline-offset-4">
          {tool.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {tool.description}
        </p>
      </div>
      <ChevronRight
        className="ml-4 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
        aria-hidden="true"
      />
    </Link>
  );
}
