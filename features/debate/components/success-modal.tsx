"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, Cpu, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ConsensusResult, Syndicate } from "@/types";

interface SuccessModalProps {
  txHash: string | null;
  consensus: ConsensusResult | null;
  syndicate: Syndicate | null;
  asset: string;
  isSimulated: boolean;
  onReset: () => void;
}

export function SuccessModal({
  txHash,
  consensus,
  syndicate,
  asset,
  isSimulated,
  onReset,
}: SuccessModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border border-emerald-500/20 bg-zinc-950/60 rounded-[16px] overflow-hidden">
        <CardContent className="p-6 flex flex-col gap-6 items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-8 w-8 animate-bounce" />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-xl font-bold text-zinc-100">Decision Recorded!</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The aggregate deliberation of the {syndicate?.name} syndicate has been successfully broadcast and permanently sealed on-chain.
            </p>
          </div>

          <div className="w-full bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex flex-col gap-2.5 text-left text-xs font-mono text-zinc-400">
            <div className="flex justify-between">
              <span>Asset:</span>
              <span className="text-zinc-200">{asset}</span>
            </div>
            <div className="flex justify-between">
              <span>Decision:</span>
              <span className={consensus?.recommendation === "BUY" ? "text-emerald-400" : consensus?.recommendation === "SELL" ? "text-red-400" : "text-amber-400"}>
                {consensus?.recommendation}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span className="text-zinc-200">{consensus?.confidence}%</span>
            </div>
            <div className="flex justify-between">
              <span>Registry:</span>
              <span className="text-purple-400 text-[10px] select-all">0x60Be62dD9B3ED768dbAAc54374b03Ea2F3C52D76</span>
            </div>
            {isSimulated && (
              <div className="flex justify-between text-purple-400 items-center gap-1 pt-1.5 border-t border-zinc-900">
                <Cpu className="h-3 w-3" />
                <span className="text-[10px] uppercase font-semibold tracking-wider">Simulated broadcast</span>
              </div>
            )}
          </div>

          {txHash && (
            <div className="flex flex-col gap-1.5 w-full">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Transaction hash</span>
              <a
                href={isSimulated ? "#" : `https://testnet.monadscan.com/tx/${txHash}`}
                target={isSimulated ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-mono underline hover:no-underline transition-colors group"
              >
                {txHash.slice(0, 8)}...{txHash.slice(-8)}
                {!isSimulated && <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />}
              </a>
            </div>
          )}

          <Button
            onClick={onReset}
            className="w-full h-12 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 font-medium rounded-xl mt-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Analyze Another Token
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
