import { NextResponse } from "next/server";
import { z } from "zod";
import { 
  AGENT_SYSTEM_PROMPTS, 
  buildMarketContextString, 
  callLLM, 
  generateMockOnChainMetrics,
  generateMockAgentResponse
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
      // Hardcode the last 3 agents for the demo to avoid API rate limits
      const shouldHardcode = agentId === "macro-analyst" || agentId === "onchain-sleuth" || agentId === "risk-guardian";
      
      if (shouldHardcode) {
        const mockRes = generateMockAgentResponse(agentId, cleanAsset);
        return {
          agentId,
          ...mockRes,
        } as AgentResponse;
      }

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
        console.error(`Error processing agent ${agentId}, falling back to custom mock:`, error);
        
        // Return a clean customized fallback decision for individual failures so the debate goes on
        const fallbackRes = generateMockAgentResponse(agentId, cleanAsset);
        return {
          agentId,
          ...fallbackRes,
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

