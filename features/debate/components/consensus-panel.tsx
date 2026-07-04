"use client";

import { motion } from "framer-motion";
import { ShieldCheck, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DECISION_STYLES } from "@/constants/theme";
import type { ConsensusResult, Syndicate } from "@/types";

interface ConsensusPanelProps {
  consensus: ConsensusResult;
  syndicate: Syndicate;
  asset: string;
  isWritingContract: boolean;
  onRecord: () => void;
  onReset: () => void;
}

export function ConsensusPanel({
  consensus,
  syndicate,
  asset,
  isWritingContract,
  onRecord,
  onReset,
}: ConsensusPanelProps) {
  const details = DECISION_STYLES[consensus.recommendation];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border border-[rgba(255,255,255,0.08)] bg-[#111113] rounded-xl overflow-hidden">
        <CardContent className="p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <ShieldCheck className="h-[18px] w-[18px] text-zinc-400" />
              <span className="text-xs font-semibold uppercase tracking-wider font-mono">Consensus Resolved</span>
            </div>
            <span className="text-xs text-zinc-500 font-mono">Syndicate: {syndicate.name}</span>
          </div>

          <div className="flex flex-col items-center text-center gap-2 py-4">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono">Syndicate Accord for {asset}</span>
            <h3 className={`text-5xl font-bold tracking-tighter ${details.text}`}>
              {consensus.recommendation}
            </h3>
            <span className="text-sm text-zinc-400 font-semibold mt-1">
              Confidence Index: {consensus.confidence}%
            </span>
          </div>

          <div className="flex flex-col gap-4 border-y border-[rgba(255,255,255,0.08)] py-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Weighted Aggregated Certainty</span>
                <span className="font-semibold text-zinc-300">{consensus.confidence}%</span>
              </div>
              <Progress value={consensus.confidence} className="h-2 bg-zinc-900" indicatorClassName={details.barColor} />
            </div>

            <div className="flex justify-between items-center text-xs text-zinc-400 pt-2 font-mono">
              <span>Debate Votes</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  BUY: {Math.round(consensus.voteBreakdown.BUY)}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  SELL: {Math.round(consensus.voteBreakdown.SELL)}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  HOLD: {Math.round(consensus.voteBreakdown.HOLD)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={onRecord}
              disabled={isWritingContract}
              className="flex-1 h-10 bg-white hover:bg-zinc-200 text-[#09090B] font-medium rounded-lg"
            >
              {isWritingContract ? (
                <>
                  <RefreshCw className="mr-2 h-[18px] w-[18px] animate-spin" />
                  Submitting to Monad...
                </>
              ) : (
                <>
                  <Layers className="mr-2 h-[18px] w-[18px]" />
                  Record Decision on Monad Testnet
                </>
              )}
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              disabled={isWritingContract}
              className="h-10 border border-[rgba(255,255,255,0.08)] hover:bg-[#18181B] rounded-lg text-zinc-300"
            >
              New Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
