import Link from '@/compat/next-link';
import { ArrowRight, Layers3 } from 'lucide-react';

export function ToolWorkflowPush() {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-left">
      <div className="flex items-start gap-3">
        <Layers3
          aria-hidden="true"
          className="mt-0.5 h-5 w-5 shrink-0 text-blue-700"
        />
        <div>
          <p className="text-sm font-semibold text-blue-950">
            Running this workflow more than once?
          </p>
          <p className="mt-1 text-sm leading-6 text-blue-950/75">
            SubtitleOps Free handles one file locally. Pro and Studio are in
            private beta for batch runs, reusable presets, project history,
            review, and team workflows.
          </p>
          <Link
            href="/pricing"
            title="Compare SubtitleOps workflow plans and beta availability"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800 underline underline-offset-4 hover:text-blue-950"
          >
            Compare workflow plans
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
