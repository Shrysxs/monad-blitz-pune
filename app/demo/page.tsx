"use client";

import { useDebate } from "@/features/debate/use-debate";
import { SyndicateSelector } from "@/features/debate/components/syndicate-selector";
import { AssetSelector } from "@/features/debate/components/asset-selector";
import { DebateArena } from "@/features/debate/components/debate-arena";
import { ConsensusPanel } from "@/features/debate/components/consensus-panel";
import { SuccessModal } from "@/features/debate/components/success-modal";
import { AppHeader } from "@/components/layout/app-header";
import { PageShell } from "@/components/layout/page-shell";
import { AlertCircle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoPage() {
  const {
    step,
    setStep,
    selectedSyndicate,
    asset,
    marketContext,
    agentResponses,
    revealedCount,
    consensus,
    onChainMetrics,
    isAnalyzing,
    isWritingContract,
    isSimulated,
    txHash,
    error,
    handleSelectSyndicate,
    handleStartDebate,
    handleRecordOnChain,
    handleReset,
  } = useDebate();

  const getStepNumber = () => {
    switch (step) {
      case "select-syndicate":
        return 1;
      case "select-asset":
        return 2;
      case "debating":
        return 3;
      case "consensus":
        return 4;
      case "success":
        return 5;
    }
  };

  return (
    <PageShell>
      <AppHeader />
      
      {/* Step Stepper Header */}
      <div className="border-b border-[rgba(255,255,255,0.08)] bg-[#111113]/30 py-4">
        <div className="mx-auto flex max-w-6xl justify-between items-center px-6">
          <div className="flex gap-3 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <span className={getStepNumber() === 1 ? "text-zinc-100 font-semibold" : ""}>1. Syndicate</span>
            <span className="text-zinc-800">&rarr;</span>
            <span className={getStepNumber() === 2 ? "text-zinc-100 font-semibold" : ""}>2. Asset</span>
            <span className="text-zinc-800">&rarr;</span>
            <span className={getStepNumber() === 3 ? "text-zinc-100 font-semibold" : ""}>3. Debate</span>
            <span className="text-zinc-800">&rarr;</span>
            <span className={getStepNumber() === 4 ? "text-zinc-100 font-semibold" : ""}>4. Consensus</span>
            <span className="text-zinc-800">&rarr;</span>
            <span className={getStepNumber() === 5 ? "text-zinc-100 font-semibold" : ""}>5. On-Chain Seal</span>
          </div>

          {step !== "select-syndicate" && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
            >
              <RotateCcw className="h-[18px] w-[18px]" />
              Reset Flow
            </button>
          )}
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 border border-red-500/20 bg-red-500/5 text-red-400 text-sm p-4 rounded-lg max-w-2xl mx-auto w-full"
            >
              <AlertCircle className="h-[18px] w-[18px] flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Stepper Screens */}
          {step === "select-syndicate" && (
            <motion.div
              key="select-syndicate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <SyndicateSelector onSelect={handleSelectSyndicate} />
            </motion.div>
          )}

          {step === "select-asset" && (
            <motion.div
              key="select-asset"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <AssetSelector
                syndicate={selectedSyndicate!}
                onBack={() => setStep("select-syndicate")}
                onStart={handleStartDebate}
              />
            </motion.div>
          )}

          {/* Debating Arena Screen */}
          {step === "debating" && (
            <motion.div
              key="debating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1 items-start">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest font-mono">
                  {isAnalyzing ? "Preparing Shared Market Context" : "Syndicate Deliberating"}
                </span>
                <h2 className="text-2xl font-semibold text-zinc-100 mt-1">
                  {isAnalyzing ? "Synthesizing News & Ledger Metrics..." : `Committee Deliberation: ${asset}`}
                </h2>
                <p className="text-xs text-zinc-400 max-w-xl mt-1 leading-relaxed">
                  Each agent evaluates the asset independently from their distinct philosophy. Revealing arguments...
                </p>
              </div>

              <DebateArena
                marketContext={marketContext}
                agentResponses={agentResponses}
                revealedCount={revealedCount}
                isAnalyzing={isAnalyzing}
                onChainMetrics={onChainMetrics}
              />
            </motion.div>
          )}

          {/* Consensus Screen */}
          {step === "consensus" && (
            <motion.div
              key="consensus"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-8"
            >
              <div className="flex flex-col gap-1 items-start">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest font-mono">
                  Deliberation Concluded
                </span>
                <h2 className="text-2xl font-semibold text-zinc-100 mt-1">
                  Consensus Summary
                </h2>
              </div>

              <div className="grid gap-10 lg:grid-cols-[1fr_380px] items-start">
                <div className="flex flex-col gap-6">
                  <DebateArena
                    marketContext={marketContext}
                    agentResponses={agentResponses}
                    revealedCount={revealedCount}
                    isAnalyzing={false}
                    onChainMetrics={onChainMetrics}
                  />
                </div>

                <div className="flex flex-col gap-6">
                  <ConsensusPanel
                    consensus={consensus!}
                    syndicate={selectedSyndicate!}
                    asset={asset}
                    isWritingContract={isWritingContract}
                    onRecord={handleRecordOnChain}
                    onReset={handleReset}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Screen */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-8"
            >
              <div className="flex flex-col gap-1 items-start">
                <span className="text-[10px] text-emerald-500 font-semibold uppercase tracking-widest font-mono">
                  Sealed on Monad
                </span>
                <h2 className="text-2xl font-semibold text-zinc-100 mt-1">
                  Transaction Sealed
                </h2>
              </div>

              <div className="grid gap-10 lg:grid-cols-[1fr_380px] items-start">
                <div className="flex flex-col gap-6">
                  <DebateArena
                    marketContext={marketContext}
                    agentResponses={agentResponses}
                    revealedCount={revealedCount}
                    isAnalyzing={false}
                    onChainMetrics={onChainMetrics}
                  />
                </div>

                <div className="flex flex-col gap-6">
                  <SuccessModal
                    txHash={txHash}
                    consensus={consensus}
                    syndicate={selectedSyndicate}
                    asset={asset}
                    isSimulated={isSimulated}
                    onReset={handleReset}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageShell>
  );
}
