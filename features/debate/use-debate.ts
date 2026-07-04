"use client";

import { useState } from "react";
import { createWalletClient, custom, createPublicClient, http } from "viem";
import { monadTestnet } from "@/lib/chain";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants/contract";
import { calculateConsensus } from "@/lib/consensus";
import type { 
  Syndicate, 
  MarketContext, 
  AgentResponse, 
  ConsensusResult,
  Step,
  MockOnChainMetrics
} from "@/types";

interface WindowWithEthereum {
  ethereum?: {
    request: (args: { method: string; params?: unknown[] }) => Promise<string[]>;
  };
}

export function useDebate() {
  const [step, setStep] = useState<Step>("select-syndicate");
  const [selectedSyndicate, setSelectedSyndicate] = useState<Syndicate | null>(null);
  const [asset, setAsset] = useState<string>("BTC");
  const [marketContext, setMarketContext] = useState<MarketContext | null>(null);
  
  const [agentResponses, setAgentResponses] = useState<AgentResponse[]>([]);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [consensus, setConsensus] = useState<ConsensusResult | null>(null);
  const [onChainMetrics, setOnChainMetrics] = useState<MockOnChainMetrics | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isWritingContract, setIsWritingContract] = useState<boolean>(false);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. Select Syndicate
  const handleSelectSyndicate = (syndicate: Syndicate) => {
    setSelectedSyndicate(syndicate);
    setStep("select-asset");
  };

  // 2. Select Asset & Start Debate
  const handleStartDebate = async (selectedAsset: string) => {
    setAsset(selectedAsset);
    setError(null);
    setStep("debating");
    setIsAnalyzing(true);
    setRevealedCount(0);
    setAgentResponses([]);
    setConsensus(null);
    setMarketContext(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset: selectedAsset,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || "Failed to analyze market context");
      }

      const data = (await response.json()) as {
        success: boolean;
        marketContext: MarketContext;
        onChainMetrics: MockOnChainMetrics;
        responses: AgentResponse[];
      };

      setOnChainMetrics(data.onChainMetrics);
      setMarketContext(data.marketContext);
      setAgentResponses(data.responses);
      setIsAnalyzing(false);

      // Trigger sequential reveal
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setRevealedCount(count);
        if (count >= 5) {
          clearInterval(interval);
          // Calculate consensus once all 5 are revealed
          const consensusRes = calculateConsensus(data.responses);
          setConsensus(consensusRes);
          setStep("consensus");
        }
      }, 800); // 800ms between each agent card reveal

    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Something went wrong during debate analysis.";
      setError(errMsg);
      setIsAnalyzing(false);
    }
  };

  // 3. Write Decision on Monad Testnet
  const handleRecordOnChain = async () => {
    if (!consensus || !marketContext) return;
    setIsWritingContract(true);
    setIsSimulated(false);
    setError(null);

    const hasEthereum = typeof window !== "undefined" && !!(window as WindowWithEthereum).ethereum;

    if (!hasEthereum) {
      // Fallback: Submit transaction on-chain via backend Syndicate Wallet
      try {
        console.log("No browser wallet detected. Executing on-chain write via Syndicate Agent Wallet...");
        const response = await fetch("/api/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            asset: marketContext.asset,
            decision: consensus.recommendation,
            confidence: consensus.confidence,
          }),
        });

        if (!response.ok) {
          const errData = (await response.json()) as { error?: string };
          throw new Error(errData.error || "Failed to record decision on-chain via Syndicate Wallet.");
        }

        const data = (await response.json()) as { txHash: string };
        setTxHash(data.txHash);
        setIsSimulated(false); // It is a real, confirmed Monad Testnet transaction!
        setIsWritingContract(false);
        setStep("success");
      } catch (err: unknown) {
        console.error("Backend contract write failed:", err);
        const errMsg = err instanceof Error ? err.message : "Failed to record decision on-chain via Syndicate Wallet.";
        setError(errMsg);
        setIsWritingContract(false);
      }
      return;
    }

    try {
      const ethereum = (window as WindowWithEthereum).ethereum;
      if (!ethereum) throw new Error("No ethereum provider found");
      
      // Request accounts
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0] as `0x${string}`;

      // Request chain switch
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x279f" }], // 10143 in hex is 0x279f
        });
      } catch (switchError: unknown) {
        const switchErr = switchError as { code?: number };
        // If chain is not added, add it
        if (switchErr.code === 4902) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x279f",
                chainName: "Monad Testnet",
                nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
                rpcUrls: ["https://testnet-rpc.monad.xyz"],
                blockExplorerUrls: ["https://testnet.monadscan.com"],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }

      // Initialize viem clients
      const walletClient = createWalletClient({
        account,
        chain: monadTestnet,
        transport: custom(ethereum),
      });

      const publicClient = createPublicClient({
        chain: monadTestnet,
        transport: http(),
      });

      // Write contract
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "recordDecision",
        account,
        args: [
          marketContext.asset,
          consensus.recommendation,
          BigInt(consensus.confidence),
          BigInt(Math.floor(Date.now() / 1000)),
        ],
      });

      setTxHash(hash);
      
      // Wait for block confirmation
      await publicClient.waitForTransactionReceipt({ hash });

      setIsWritingContract(false);
      setStep("success");
    } catch (err: unknown) {
      console.error("Contract call failed:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to submit transaction to Monad.";
      setError(errMsg);
      setIsWritingContract(false);
    }
  };

  const handleReset = () => {
    setStep("select-syndicate");
    setSelectedSyndicate(null);
    setAsset("BTC");
    setMarketContext(null);
    setAgentResponses([]);
    setRevealedCount(0);
    setConsensus(null);
    setTxHash(null);
    setError(null);
  };

  return {
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
  };
}
