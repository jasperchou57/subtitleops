import { ArrowDownToLine, FileUp, RefreshCcw, ShieldCheck } from 'lucide-react';

interface ToolFileContractProps {
  input: string;
  result: string;
  keeps: string;
  changes: string;
}

const items = [
  { key: 'input', label: 'Input', icon: FileUp },
  { key: 'result', label: 'Result', icon: ArrowDownToLine },
  { key: 'keeps', label: 'Keeps', icon: ShieldCheck },
  { key: 'changes', label: 'Changes / limits', icon: RefreshCcw },
] as const;

export function ToolFileContract({
  input,
  result,
  keeps,
  changes,
}: ToolFileContractProps) {
  const values = { input, result, keeps, changes };

  return (
    <dl
      aria-label="File conversion details"
      className="relative mt-6 grid min-w-0 gap-3 text-left sm:grid-cols-2"
    >
      {items.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className="min-w-0 rounded-xl border bg-background/85 p-4"
        >
          <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
            <Icon aria-hidden="true" className="h-4 w-4" />
            {label}
          </dt>
          <dd className="mt-2 break-words text-sm leading-6 text-muted-foreground">
            {values[key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}
