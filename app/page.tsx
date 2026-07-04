import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AGENTS } from "@/constants/agents";
import { SYNDICATES } from "@/constants/syndicates";

export default function LandingPage() {
  return (
    <PageShell>
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 py-16">
        <section className="flex max-w-3xl flex-col gap-6">
          <div className="self-start">
            <Badge variant="default">Monad Blitz Pune · MVP</Badge>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            AI Investment Syndicates
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed">
            Five specialized agents independently analyze an asset, debate their
            views, vote, and permanently record a transparent consensus on Monad.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild size="lg">
              <Link href="/demo">
                Launch Demo
                <ArrowRight className="h-[18px] w-[18px]" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/marketplace">
                Agent Reputation
                <ArrowRight className="h-[18px] w-[18px]" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          {SYNDICATES.map((syndicate) => (
            <Card key={syndicate.id} className="hover:border-zinc-700/60">
              <CardHeader className="p-6">
                <CardTitle className="text-sm font-semibold tracking-tight text-zinc-200">{syndicate.name}</CardTitle>
                <CardDescription className="text-xs text-zinc-500 mt-1 font-normal">{syndicate.focus}</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <p className="text-sm text-zinc-400 leading-relaxed font-normal">{syndicate.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <Users className="h-[18px] w-[18px]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider font-mono">
              Five-agent syndicate
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((agent) => (
              <Card key={agent.id} className="hover:border-zinc-700/60">
                <CardHeader className="p-6">
                  <CardTitle className="text-sm font-semibold text-zinc-200">{agent.name}</CardTitle>
                  <CardDescription className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-normal">
                    {agent.focus}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
