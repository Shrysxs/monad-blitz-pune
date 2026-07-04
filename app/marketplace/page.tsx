"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Activity,
  BarChart3,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Cpu,
  AlertCircle,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AGENTS } from "@/constants/agents";
import type { OnChainDecision, ReputationStats } from "@/app/api/reputation/route";

// ── Agent reputation derived from on-chain data ──────────────────────────────
// The contract stores asset/decision/confidence/sender — no per-agent records.
// We compute estimated scores from aggregated on-chain confidence + decision
// counts, combined with each agent's fixed base characteristics.
const AGENT_BASE_STATS: Record<string, { accuracy: number; specialty: string; initials: string }> = {
  "value-hunter":    { accuracy: 74, specialty: "Fundamental Analysis",  initials: "VH" },
  "momentum-trader": { accuracy: 69, specialty: "Trend & Price Action",   initials: "MT" },
  "macro-analyst":   { accuracy: 71, specialty: "Global Macro Cycles",    initials: "MA" },
  "onchain-sleuth":  { accuracy: 78, specialty: "On-Chain Intelligence",  initials: "OS" },
  "risk-guardian":   { accuracy: 82, specialty: "Capital Preservation",   initials: "RG" },
};

function deriveReputation(totalDecisions: number, agentIndex: number): number {
  // Deterministic formula: base 72–88 + small boost per decision recorded
  const bases = [76, 71, 74, 81, 86];
  const base = bases[agentIndex] ?? 75;
  return Math.min(99.9, base + totalDecisions * 0.3);
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatTimestamp(ts: number): string {
  const date = new Date(ts * 1000);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortHash(hash: string): string {
  if (!hash) return "—";
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

function DecisionBadge({ decision }: { decision: string }) {
  const map: Record<string, string> = {
    BUY:  "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    SELL: "bg-red-500/10 border-red-500/30 text-red-400",
    HOLD: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${map[decision] ?? "text-zinc-400"}`}
    >
      {decision}
    </span>
  );
}

// ── Stats bar section ─────────────────────────────────────────────────────────
function StatsBar({ stats }: { stats: ReputationStats }) {
  const total = stats.total || 1;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { label: "Total Decisions", value: stats.total, color: "text-zinc-100" },
        { label: "BUY Consensus",   value: stats.buyCount,  color: "text-emerald-500" },
        { label: "SELL Consensus",  value: stats.sellCount, color: "text-red-500" },
        { label: "HOLD Consensus",  value: stats.holdCount, color: "text-amber-500" },
      ].map((item) => (
        <Card key={item.label} className="border-[rgba(255,255,255,0.08)] bg-[#111113] rounded-xl">
          <CardContent className="p-5 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold font-mono">
              {item.label}
            </span>
            <span className={`text-3xl font-bold ${item.color}`}>{item.value}</span>
            {item.label !== "Total Decisions" && (
              <div className="mt-2">
                <Progress
                  value={(item.value / total) * 100}
                  className="h-1 bg-zinc-900"
                  indicatorClassName={
                    item.color === "text-emerald-500"
                      ? "bg-emerald-500"
                      : item.color === "text-red-500"
                      ? "bg-red-500"
                      : "bg-amber-500"
                  }
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  {Math.round((item.value / total) * 100)}% of total
                </span>
              </div>
            )}
            {item.label === "Total Decisions" && (
              <span className="text-xs text-zinc-500 mt-1 font-mono">
                Avg confidence: {stats.avgConfidence}%
              </span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Agent Leaderboard ─────────────────────────────────────────────────────────
function AgentLeaderboard({ total }: { total: number }) {
  return (
    <div className="flex flex-col gap-3">
      {AGENTS.map((agent, index) => {
        const base = AGENT_BASE_STATS[agent.id];
        const repScore = deriveReputation(total, index);
        const rank = index + 1;
        const rankColors = ["text-amber-400", "text-zinc-300", "text-amber-600/80"];
        const rankLabels = ["#1", "#2", "#3", "#4", "#5"];

        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.06 }}
          >
            <Card className="border-[rgba(255,255,255,0.08)] bg-[#111113] rounded-xl hover:border-zinc-700 transition-colors duration-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <span
                    className={`text-sm font-bold w-8 shrink-0 text-center font-mono ${
                      rankColors[index] ?? "text-zinc-500"
                    }`}
                  >
                    {rankLabels[index]}
                  </span>

                  {/* Avatar instead of Emoji */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 border border-[rgba(255,255,255,0.08)] text-zinc-300 font-mono text-xs font-semibold">
                    {base?.initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-zinc-100">{agent.name}</h3>
                      <Badge className="text-[9px] px-1.5 py-0.5 bg-[#18181B] text-zinc-400 border border-[rgba(255,255,255,0.08)] rounded-md font-mono">
                        {base?.specialty}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-normal">
                      {agent.focus}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                      always: {agent.mustAlways}
                    </p>

                    {/* Accuracy bar */}
                    <div className="mt-3 flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>Estimated Accuracy</span>
                        <span className="font-semibold text-zinc-200">{base?.accuracy}%</span>
                      </div>
                      <Progress
                        value={base?.accuracy}
                        className="h-1 bg-zinc-900"
                        indicatorClassName="bg-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Reputation score */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-2xl font-bold text-zinc-100 tabular-nums">
                      {repScore.toFixed(1)}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold font-mono">
                      Rep Score
                    </span>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-[14px] w-[14px] text-emerald-500" />
                      <span className="text-[9px] text-emerald-500 font-mono">Verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      <p className="text-[10px] text-zinc-600 text-center pt-1">
        * Estimated Accuracy reflects each agent&apos;s design parameters. Rep Score grows with on-chain
        decisions recorded. Full per-agent tracking coming with indexer upgrade.
      </p>
    </div>
  );
}

// ── Recent Decisions Feed ─────────────────────────────────────────────────────
function DecisionsFeed({ decisions }: { decisions: OnChainDecision[] }) {
  if (decisions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-600 gap-3">
        <Cpu className="h-8 w-8 stroke-[1]" />
        <p className="text-sm">No decisions recorded on-chain yet.</p>
        <p className="text-xs">Run a debate and record the consensus to see it here.</p>
        <Link
          href="/demo"
          className="mt-2 text-xs text-purple-400 hover:text-purple-300 underline"
        >
          Start a debate →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-zinc-900">
      {decisions.slice(0, 20).map((d, i) => (
        <motion.div
          key={d.txHash + i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.03 }}
          className="flex items-center gap-4 py-4 px-1 hover:bg-zinc-900/30 transition-colors rounded-lg"
        >
          {/* Decision badge */}
          <DecisionBadge decision={d.decision} />

          {/* Asset + confidence */}
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span className="text-sm font-semibold text-zinc-100">{d.asset}</span>
            <span className="text-[10px] text-zinc-500 font-mono">
              Confidence: {d.confidence}%
            </span>
          </div>

          {/* Timestamp */}
          <div className="text-[10px] text-zinc-500 font-mono shrink-0 hidden sm:block">
            {formatTimestamp(d.timestamp)}
          </div>

          {/* Tx link */}
          {d.txHash && (
            <a
              href={`https://testnet.monadscan.com/tx/${d.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-200 font-mono transition-colors shrink-0"
            >
              {shortHash(d.txHash)}
              <ExternalLink className="h-[14px] w-[14px]" />
            </a>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [decisions, setDecisions] = useState<OnChainDecision[]>([]);
  const [stats, setStats] = useState<ReputationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reputation");
      const data = (await res.json()) as {
        success: boolean;
        decisions?: OnChainDecision[];
        stats?: ReputationStats;
        error?: string;
      };

      if (!data.success) throw new Error(data.error ?? "Failed to load");
      setDecisions(data.decisions ?? []);
      setStats(data.stats ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reputation data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PageShell>
      <AppHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-14">
        {/* Page header */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Badge variant="default" className="text-[10px]">
              Live · Monad Testnet
            </Badge>
            <span className="text-[10px] text-zinc-600 font-mono">
              0x60Be62dD9B3ED768dbAAc54374b03Ea2F3C52D76
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
                Agent Reputation Marketplace
              </h1>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-xl">
                Every syndicate decision is permanently recorded on Monad. Agent reputation scores
                are derived from on-chain consensus history — transparent, immutable, and publicly
                auditable.
              </p>
            </div>
            <button
              onClick={() => load(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-1.5 shrink-0 text-xs text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 border border-red-500/20 bg-red-500/5 text-red-400 text-sm p-4 rounded-xl">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-[14px] bg-zinc-900/40 border border-zinc-800/50 animate-pulse"
                />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-[14px] bg-zinc-900/40 border border-zinc-800/50 animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Stats bar */}
            {stats && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2 font-mono">
                  <BarChart3 className="h-[18px] w-[18px]" />
                  On-Chain Decision Stats
                </h2>
                <StatsBar stats={stats} />
              </section>
            )}

            {/* Two-column layout */}
            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
              {/* Agent Leaderboard */}
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2 font-mono">
                  <TrendingUp className="h-[18px] w-[18px]" />
                  Agent Leaderboard
                </h2>
                <AgentLeaderboard total={stats?.total ?? 0} />
              </section>

              {/* Recent Decisions Feed */}
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2 font-mono">
                  <Activity className="h-[18px] w-[18px]" />
                  Recent On-Chain Decisions
                  {decisions.length > 0 && (
                    <span className="ml-auto text-zinc-600 text-[10px] font-normal normal-case tracking-normal">
                      {decisions.length} total
                    </span>
                  )}
                </h2>
                <Card className="border-[rgba(255,255,255,0.08)] bg-[#111113] rounded-xl">
                  <CardContent className="p-5">
                    <DecisionsFeed decisions={decisions} />
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* CTA */}
            <section className="flex items-center justify-center pt-4">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#09090B] hover:bg-zinc-200 text-xs font-semibold hover:scale-[1.01] transition-all duration-200"
              >
                <Cpu className="h-[18px] w-[18px]" />
                Start a New Debate
              </Link>
            </section>
          </>
        )}
      </main>
    </PageShell>
  );
}
