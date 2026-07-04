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
          <Badge variant="default">Monad Blitz Pune · MVP</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            AI Investment Syndicates
          </h1>
          <p className="text-lg leading-8 text-zinc-400">
            Five specialized agents independently analyze an asset, debate their
            views, vote, and permanently record a transparent consensus on Monad.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/demo">
                Launch Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {SYNDICATES.map((syndicate) => (
            <Card key={syndicate.id}>
              <CardHeader>
                <CardTitle>{syndicate.name}</CardTitle>
                <CardDescription>{syndicate.focus}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">{syndicate.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-zinc-300">
            <Users className="h-4 w-4 text-purple-400" />
            <h2 className="text-sm font-medium uppercase tracking-wider">
              Five-agent syndicate
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((agent) => (
              <Card key={agent.id} className="bg-zinc-950/50">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{agent.name}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
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
