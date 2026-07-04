"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AGENTS } from "@/constants/agents";
import type { AgentResponse, MarketContext, AgentId, MockOnChainMetrics } from "@/types";

interface DebateArenaProps {
  marketContext: MarketContext | null;
  agentResponses: AgentResponse[];
  revealedCount: number;
  isAnalyzing: boolean;
  onChainMetrics: MockOnChainMetrics | null;
}

const THINKING_LOGS: Record<AgentId, string[]> = {
  "value-hunter": [
    "Computing FDV/revenue multiple vs sector peers...",
    "Applying Graham margin of safety — need 33%+ discount to intrinsic value...",
    "Assessing protocol moat width: network effects, switching costs, fee capture...",
    "Damodaran DCF — bridging narrative to numbers on owner earnings...",
  ],
  "momentum-trader": [
    "Reading RSI (14-period) and MACD histogram divergence...",
    "Checking price vs 50-day and 200-day EMA structure...",
    "Measuring relative strength vs BTC over rolling 30-day window...",
    "Validating breakout with volume — need >1.5x 20-day average...",
  ],
  "macro-analyst": [
    "Assessing Global M2 liquidity expansion rate vs 13-week lag model...",
    "Checking DXY trend — dollar strength/weakness vs crypto correlation...",
    "Positioning in BTC halving cycle — post-halving expansion vs pre-peak...",
    "Analyzing VIX regime and institutional ETF flow data...",
  ],
  "onchain-sleuth": [
    "Computing MVRV ratio — market cap vs realized cap for profit/loss map...",
    "Reading SOPR signal — are coins moving in profit or at a loss?",
    "Scanning exchange netflow — inflows signal selling pressure, outflows = accumulation...",
    "Profiling LTH vs STH supply distribution and whale accumulation score...",
  ],
  "risk-guardian": [
    "Calculating max drawdown from ATH and historical bear market precedent...",
    "Running Kelly Criterion sizing — estimating edge and win/loss ratio...",
    "Stress-testing tail risk: exchange hack, regulatory ban, liquidity crisis...",
    "Computing Sharpe/Sortino ratio — is the risk-adjusted return worth it?",
  ],
};

export function DebateArena({
  marketContext,
  agentResponses,
  revealedCount,
  isAnalyzing,
  onChainMetrics
}: DebateArenaProps) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* 1. Shared Market Context Banner */}
      {!marketContext ? (
        <div className="border border-zinc-800/80 bg-zinc-950/40 rounded-[16px] p-6 flex items-center justify-center min-h-[90px] animate-pulse">
          <div className="flex items-center gap-3 text-zinc-500 font-mono text-xs">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
            <span>Fetching real-time market indices & query ledger events from Monad Network...</span>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-zinc-800/80 bg-zinc-950/40 rounded-[16px] p-6 grid gap-6 md:grid-cols-4 items-center"
        >
          <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-zinc-800/80 pb-4 md:pb-0">
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Shared Market Context</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-semibold text-zinc-100">{marketContext.asset}</h3>
              <span className="text-xs text-zinc-400 font-mono">${marketContext.price.toLocaleString()}</span>
            </div>
            <span className={`text-xs font-semibold ${marketContext.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {marketContext.change24h >= 0 ? "+" : ""}{marketContext.change24h}% (24h)
            </span>
          </div>

          <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-zinc-800/80 pb-4 md:pb-0 md:pl-4">
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Fear & Greed Index</span>
            <span className="text-lg font-semibold text-zinc-100">{marketContext.fearGreedIndex}</span>
            <span className="text-xs text-zinc-400">Category: {marketContext.fearGreedIndex >= 70 ? "Greed" : marketContext.fearGreedIndex <= 30 ? "Fear" : "Neutral"}</span>
          </div>

          <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-zinc-800/80 pb-4 md:pb-0 md:pl-4">
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Aggregate Sentiment</span>
            <span className="text-lg font-semibold text-zinc-100">{marketContext.sentiment}</span>
            <span className="text-xs text-zinc-400">Volume 24h: {marketContext.volume24h}</span>
          </div>

          <div className="flex flex-col gap-1 md:pl-4">
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">On-Chain Ledger</span>
            <span className="text-xs text-zinc-300 truncate">{onChainMetrics?.whaleAccumulation || "Loading metrics..."}</span>
            <span className="text-[10px] text-purple-400 font-mono">Monad Testnet (Chain ID 10143)</span>
          </div>
        </motion.div>
      )}

      {/* 2. Agents Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((agent, index) => {
          const isRevealed = index < revealedCount;
          const isCurrentThinking = index === revealedCount && !isAnalyzing;
          const response = isRevealed ? agentResponses.find((r) => r.agentId === agent.id) : null;

          return (
            <Card
              key={agent.id}
              className={`relative overflow-hidden border transition-all duration-300 rounded-[16px] min-h-[340px] flex flex-col ${
                isRevealed
                  ? "border-zinc-800 bg-zinc-950/40"
                  : isCurrentThinking
                  ? "border-purple-500 bg-zinc-950/60 shadow-[0_0_15px_rgba(147,51,234,0.15)]"
                  : "border-zinc-900 bg-zinc-950/10 opacity-30 select-none"
              }`}
            >
              {/* Card Header */}
              <CardHeader className="p-5 border-b border-zinc-900/60 pb-3 flex flex-row items-center justify-between space-y-0">
                <div className="flex flex-col gap-0.5">
                  <CardTitle className="text-base text-zinc-100 font-semibold">{agent.name}</CardTitle>
                  <span className="text-[10px] text-zinc-500 font-mono lowercase tracking-wider">{agent.mustAlways}</span>
                </div>
                {isRevealed && response && (
                  <Badge variant={response.decision.toLowerCase() as "buy" | "sell" | "hold"} className="px-2 py-0.5 text-xs font-semibold rounded-md">
                    {response.decision}
                  </Badge>
                )}
              </CardHeader>

              {/* Card Content */}
              <CardContent className="p-5 flex-1 flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {isRevealed && response ? (
                    /* Revealed State */
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-4 h-full"
                    >
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs text-zinc-400">
                          <span>Confidence</span>
                          <span className="font-semibold text-zinc-200">{response.confidence}%</span>
                        </div>
                        <Progress value={response.confidence} className="h-1.5 bg-zinc-900" indicatorClassName="bg-purple-500" />
                      </div>

                      <div className="flex-1 flex flex-col gap-3">
                        <p className="text-xs text-zinc-300 leading-relaxed italic">
                          &quot;{response.reasoning}&quot;
                        </p>

                        <div className="grid grid-cols-2 gap-3 border-t border-zinc-900/60 pt-3 text-[10px]">
                          <div className="flex flex-col gap-1">
                            <span className="text-zinc-500 uppercase tracking-wider font-semibold">Bull Case</span>
                            <span className="text-zinc-300">{response.bullCase}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-zinc-500 uppercase tracking-wider font-semibold">Bear Case</span>
                            <span className="text-zinc-300">{response.bearCase}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] border-t border-zinc-900/60 pt-2 text-zinc-500 font-mono">
                        <span>Horizon: {response.timeHorizon}</span>
                        <span>reputation: 98.4</span>
                      </div>
                    </motion.div>
                  ) : isCurrentThinking ? (
                    /* Thinking State */
                    <ThinkingLog agentId={agent.id} />
                  ) : (
                    /* Waiting Queue State */
                    <div className="flex flex-col items-center justify-center h-full my-auto text-zinc-600 gap-2">
                      <Terminal className="h-6 w-6 stroke-[1.5]" />
                      <span className="text-xs">Awaiting context logs...</span>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ThinkingLog({ agentId }: { agentId: AgentId }) {
  const [logIndex, setLogIndex] = useState(0);
  const logs = THINKING_LOGS[agentId];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev < logs.length - 1 ? prev + 1 : prev));
    }, 200); // cycle through logs quickly
    return () => clearInterval(interval);
  }, [logs]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full font-mono text-[10px] text-zinc-400 gap-3 justify-center py-6"
    >
      <div className="flex items-center gap-2 text-purple-400">
        <Cpu className="h-4 w-4 animate-pulse" />
        <span className="font-semibold uppercase tracking-wider">Deliberating...</span>
      </div>

      <div className="flex flex-col gap-1 bg-zinc-950/80 p-3 rounded-lg border border-zinc-900/50 min-h-[100px] justify-end">
        {logs.slice(0, logIndex + 1).map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={`truncate ${i === logIndex ? "text-purple-300" : "text-zinc-600"}`}
          >
            &gt; {log}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
