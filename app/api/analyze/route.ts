import { NextResponse } from "next/server";
import { z } from "zod";
import { 
  AGENT_SYSTEM_PROMPTS, 
  buildMarketContextString, 
  callLLM, 
  generateMockOnChainMetrics 
} from "@/lib/ai/agents";
import { fetchMarketContext } from "@/lib/market-data";
import type { AgentId, AgentResponse } from "@/types";

// Input validation schema
const analyzeSchema = z.object({
  asset: z.string().min(1).max(10),
});

// Timeout helper to prevent any slow LLM agent call from hanging the API
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = analyzeSchema.safeParse(json);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid ticker. Asset must be a non-empty string under 10 characters." },
        { status: 400 }
      );
    }

    const { asset } = result.data;
    const cleanAsset = asset.trim().toUpperCase();

    // 2. Fetch real-time market context (Binance API with static fallback)
    const marketContext = await fetchMarketContext(cleanAsset);

    // 3. Generate mocked ledger metrics for On-chain Sleuth (explicitly allowed)
    const onChainMetrics = generateMockOnChainMetrics(cleanAsset);

    // 4. Build shared context block
    const sharedContextBlock = buildMarketContextString(marketContext, onChainMetrics);

    const agentIds: AgentId[] = [
      "value-hunter",
      "momentum-trader",
      "macro-analyst",
      "onchain-sleuth",
      "risk-guardian",
    ];

    // 5. Query agents in parallel with a 12-second timeout per call
    const responsesPromise = agentIds.map(async (agentId) => {
      try {
        const rawRes = await withTimeout(
          callLLM(AGENT_SYSTEM_PROMPTS[agentId], sharedContextBlock),
          12000, // 12 seconds timeout per agent
          `Agent ${agentId} deliberation timed out`
        );
        
        return {
          agentId,
          ...rawRes,
        } as AgentResponse;
      } catch (error: unknown) {
        const errMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error processing agent ${agentId}:`, error);
        
        // Return a clean fallback decision for individual failures so the debate goes on
        return {
          agentId,
          decision: "HOLD" as const,
          confidence: 50,
          reasoning: `Analysis fallback due to deliberation timeout or api error: ${errMessage}`,
          bullCase: "Fundamentals stabilizing",
          bearCase: "High macro variance",
          timeHorizon: "medium" as const,
        } as AgentResponse;
      }
    });

    const responses = await Promise.all(responsesPromise);

    return NextResponse.json({
      success: true,
      marketContext,
      onChainMetrics,
      responses,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("API Analyze Route failed:", error);
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

