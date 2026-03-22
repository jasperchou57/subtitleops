"use client";

import dynamic from "next/dynamic";

const UniversalConverter = dynamic(
  () => import("@/components/tools/universal-converter").then((mod) => mod.UniversalConverter),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border bg-card p-8 text-center">
        <div className="mx-auto h-24 w-full max-w-md rounded-lg bg-muted animate-pulse" />
        <div className="mt-4 mx-auto h-4 w-48 rounded bg-muted animate-pulse" />
      </div>
    ),
  }
);

export function LazyUniversalConverter() {
  return <UniversalConverter />;
}
