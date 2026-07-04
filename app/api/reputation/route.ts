import { NextResponse } from "next/server";
import { createPublicClient, http, parseAbiItem } from "viem";
import { monadTestnet } from "@/lib/chain";
import { CONTRACT_ADDRESS } from "@/constants/contract";

// Parsed event ABI for DecisionRecorded
const DECISION_RECORDED_EVENT = parseAbiItem(
  "event DecisionRecorded(string asset, string decision, uint256 confidence, uint256 timestamp, address indexed sender)"
);

export interface OnChainDecision {
  asset: string;
  decision: "BUY" | "SELL" | "HOLD";
  confidence: number;
  timestamp: number;
  sender: string;
  txHash: string;
  blockNumber: number;
}

export interface ReputationStats {
  total: number;
  buyCount: number;
  sellCount: number;
  holdCount: number;
  avgConfidence: number;
}

// 30-second server-side cache
let cachedDecisions: OnChainDecision[] = [];
let cachedStats: ReputationStats | null = null;
let lastFetched = 0;
const CACHE_DURATION = 30_000;

export async function GET() {
  const now = Date.now();

  if (cachedDecisions.length > 0 && now - lastFetched < CACHE_DURATION) {
    return NextResponse.json(
      { success: true, decisions: cachedDecisions, stats: cachedStats },
      { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } }
    );
  }

  try {
    const client = createPublicClient({
      chain: monadTestnet,
      transport: http(),
    });

    // Fetch all DecisionRecorded logs from the beginning of the contract
    const logs = await client.getLogs({
      address: CONTRACT_ADDRESS,
      event: DECISION_RECORDED_EVENT,
      fromBlock: 0n,
      toBlock: "latest",
    });

    const decisions: OnChainDecision[] = logs
      .map((log) => {
        const { asset, decision, confidence, timestamp, sender } =
          log.args as {
            asset: string;
            decision: string;
            confidence: bigint;
            timestamp: bigint;
            sender: string;
          };

        return {
          asset,
          decision: decision as "BUY" | "SELL" | "HOLD",
          confidence: Number(confidence),
          timestamp: Number(timestamp),
          sender,
          txHash: log.transactionHash ?? "",
          blockNumber: Number(log.blockNumber ?? 0n),
        };
      })
      // Most recent first
      .sort((a, b) => b.blockNumber - a.blockNumber);

    const total = decisions.length;
    const buyCount = decisions.filter((d) => d.decision === "BUY").length;
    const sellCount = decisions.filter((d) => d.decision === "SELL").length;
    const holdCount = decisions.filter((d) => d.decision === "HOLD").length;
    const avgConfidence =
      total > 0
        ? Math.round(
            decisions.reduce((sum, d) => sum + d.confidence, 0) / total
          )
        : 0;

    const stats: ReputationStats = {
      total,
      buyCount,
      sellCount,
      holdCount,
      avgConfidence,
    };

    cachedDecisions = decisions;
    cachedStats = stats;
    lastFetched = now;

    return NextResponse.json(
      { success: true, decisions, stats },
      { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } }
    );
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Failed to fetch on-chain data";
    console.error("GET /api/reputation failed:", error);

    // Return stale cache on error if available
    if (cachedDecisions.length > 0) {
      return NextResponse.json({
        success: true,
        decisions: cachedDecisions,
        stats: cachedStats,
        stale: true,
      });
    }

    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
