"use client";

import { useState, useEffect } from "react";
import { createWalletClient, custom, createPublicClient, http } from "viem";
import { monadTestnet } from "@/lib/chain";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants/contract";
import { generateMarketContext } from "@/features/market-context/mock";
import { calculateConsensus } from "@/lib/consensus";
import type { 
  Syndicate, 
  MarketContext, 
  AgentResponse, 
  ConsensusResult 
} from "@/types";

export type Step = "select-syndicate" | "select-asset" | "debating" | "consensus" | "success";

export function useDebate() {
  const [step, setStep] = useState<Step>("select-syndicate");
  const [selectedSyndicate, setSelectedSyndicate] = useState<Syndicate | null>(null);
  const [asset, setAsset] = useState<string>("BTC");
  const [marketContext, setMarketContext] = useState<MarketContext | null>(null);
  
  const [agentResponses, setAgentResponses] = useState<AgentResponse[]>([]);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [consensus, setConsensus] = useState<ConsensusResult | null>(null);
  const [onChainMetrics, setOnChainMetrics] = useState<any>(null);
  
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

    const context = generateMarketContext(selectedAsset);
    setMarketContext(context);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset: selectedAsset,
          marketContext: context,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze market context");
      }

      const data = await response.json();
      setOnChainMetrics(data.onChainMetrics);
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

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during debate analysis.");
      setIsAnalyzing(false);
    }
  };

  // 3. Write Decision on Monad Testnet
  const handleRecordOnChain = async () => {
    if (!consensus || !marketContext) return;
    setIsWritingContract(true);
    setIsSimulated(false);
    setError(null);

    const hasEthereum = typeof window !== "undefined" && (window as any).ethereum;

    if (!hasEthereum) {
      // Fallback: Simulate transaction for demo since no Web3 wallet is injected
      console.warn("No Web3 wallet detected, falling back to simulated transaction");
      setTimeout(() => {
        const fakeHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        setTxHash(fakeHash);
        setIsSimulated(true);
        setIsWritingContract(false);
        setStep("success");
      }, 2000);
      return;
    }

    try {
      const ethereum = (window as any).ethereum;
      
      // Request accounts
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];

      // Request chain switch
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x279f" }], // 10143 in hex is 0x279f
        });
      } catch (switchError: any) {
        // If chain is not added, add it
        if (switchError.code === 4902) {
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
    } catch (err: any) {
      console.error("Contract call failed:", err);
      setError(err.message || "Failed to submit transaction to Monad.");
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
