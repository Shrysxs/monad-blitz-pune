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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border border-[rgba(255,255,255,0.08)] bg-[#111113] rounded-xl overflow-hidden">
        <CardContent className="p-6 flex flex-col gap-6 items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-xl font-semibold text-zinc-100">Decision Recorded</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-normal">
              The aggregate deliberation of the {syndicate?.name} syndicate has been successfully broadcast and permanently sealed on-chain.
            </p>
          </div>

          <div className="w-full bg-[#18181B] p-4 rounded-lg border border-[rgba(255,255,255,0.08)] flex flex-col gap-2.5 text-left text-xs font-mono text-zinc-400">
            <div className="flex justify-between">
              <span>Asset:</span>
              <span className="text-zinc-200">{asset}</span>
            </div>
            <div className="flex justify-between">
              <span>Decision:</span>
              <span className={consensus?.recommendation === "BUY" ? "text-emerald-500" : consensus?.recommendation === "SELL" ? "text-red-500" : "text-amber-500"}>
                {consensus?.recommendation}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span className="text-zinc-200">{consensus?.confidence}%</span>
            </div>
            <div className="flex justify-between">
              <span>Registry:</span>
              <span className="text-zinc-400 text-[10px] select-all">0x60Be62dD9B3ED768dbAAc54374b03Ea2F3C52D76</span>
            </div>
            {isSimulated && (
              <div className="flex justify-between text-zinc-500 items-center gap-1 pt-2 border-t border-[rgba(255,255,255,0.08)]">
                <Cpu className="h-[18px] w-[18px]" />
                <span className="text-[10px] uppercase font-semibold tracking-wider">Simulated broadcast</span>
              </div>
            )}
          </div>

          {txHash && (
            <div className="flex flex-col gap-1.5 w-full">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold font-mono">Transaction hash</span>
              <a
                href={isSimulated ? "#" : `https://testnet.monadscan.com/tx/${txHash}`}
                target={isSimulated ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 font-mono underline hover:no-underline transition-colors group"
              >
                {txHash.slice(0, 8)}...{txHash.slice(-8)}
                {!isSimulated && <ExternalLink className="h-[18px] w-[18px] opacity-60 group-hover:opacity-100 transition-opacity" />}
              </a>
            </div>
          )}

          <Button
            onClick={onReset}
            variant="outline"
            className="w-full h-10 border border-[rgba(255,255,255,0.08)] hover:bg-[#18181B] rounded-lg text-zinc-300 mt-2"
          >
            <RefreshCw className="mr-2 h-[18px] w-[18px]" />
            Analyze Another Token
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
