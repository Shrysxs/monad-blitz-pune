import Link from "next/link";

import { AppHeader } from "@/components/layout/app-header";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";

export default function DemoPlaceholderPage() {
  return (
    <PageShell>
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center gap-4 px-6 py-16">
        <p className="text-sm text-zinc-500">Stage 1 scaffold — demo flow coming next</p>
        <h1 className="text-2xl font-semibold text-zinc-100">Demo route ready</h1>
        <p className="max-w-lg text-zinc-400">
          Syndicate selection, analysis, debate, and consensus screens will be wired
          in stages 3–5.
        </p>
        <Button asChild variant="secondary">
          <Link href="/">Back to landing</Link>
        </Button>
      </main>
    </PageShell>
  );
}
