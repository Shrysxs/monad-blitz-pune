"use client";

import { motion } from "framer-motion";
import { Cpu, ShieldCheck, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ConsensusResult, Syndicate } from "@/types";

interface ConsensusPanelProps {
  consensus: ConsensusResult;
  syndicate: Syndicate;
  asset: string;
  isWritingContract: boolean;
  onRecord: () => void;
  onReset: () => void;
}

const getRecommendationDetails = (rec: string) => {
  switch (rec) {
    case "BUY":
      return {
        color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
        barColor: "bg-emerald-500",
        label: "BUY ACCORD",
      };
    case "SELL":
      return {
        color: "text-red-400 border-red-500/20 bg-red-500/5",
        barColor: "bg-red-500",
        label: "SELL ACCORD",
      };
    case "HOLD":
      default:
      return {
        color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
        barColor: "bg-amber-500",
        label: "HOLD ACCORD",
      };
  }
};

export function ConsensusPanel({
  consensus,
  syndicate,
  asset,
  isWritingContract,
  onRecord,
  onReset,
}: ConsensusPanelProps) {
  const details = getRecommendationDetails(consensus.recommendation);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border border-zinc-800 bg-zinc-950/60 rounded-[16px] overflow-hidden">
        <CardContent className="p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">Consensus Resolved</span>
            </div>
            <span className="text-xs text-zinc-500 font-mono">Syndicate: {syndicate.name}</span>
          </div>

          <div className="flex flex-col items-center text-center gap-2 py-4">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Syndicate Accord for {asset}</span>
            <h3 className={`text-5xl font-bold tracking-tighter ${details.color.split(" ")[0]}`}>
              {consensus.recommendation}
            </h3>
            <span className="text-sm text-zinc-400 font-semibold mt-1">
              Confidence Index: {consensus.confidence}%
            </span>
          </div>

          <div className="flex flex-col gap-4 border-y border-zinc-900 py-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Weighted Aggregated Certainty</span>
                <span className="font-semibold text-zinc-300">{consensus.confidence}%</span>
              </div>
              <Progress value={consensus.confidence} className="h-2 bg-zinc-900" indicatorClassName={details.barColor} />
            </div>

            <div className="flex justify-between items-center text-xs text-zinc-400 pt-2">
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
              className="flex-1 h-12 bg-purple-600 hover:bg-purple-500 text-zinc-100 font-semibold rounded-xl"
            >
              {isWritingContract ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Submitting to Monad...
                </>
              ) : (
                <>
                  <Layers className="mr-2 h-4 w-4" />
                  Record Decision on Monad Testnet
                </>
              )}
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              disabled={isWritingContract}
              className="h-12 border-zinc-800 hover:bg-zinc-900 rounded-xl text-zinc-300"
            >
              New Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
