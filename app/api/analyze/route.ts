import { NextResponse } from "next/server";
import { 
  AGENT_SYSTEM_PROMPTS, 
  buildMarketContextString, 
  callLLM, 
  generateMockOnChainMetrics 
} from "@/lib/ai/agents";
import type { AgentId, MarketContext, AgentResponse } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { asset, marketContext } = body as { asset: string; marketContext: MarketContext };

    if (!asset || !marketContext) {
      return NextResponse.json(
        { success: false, error: "Missing asset or marketContext parameters" },
        { status: 400 }
      );
    }

    // 1. Generate the mocked on-chain metrics for On-chain Sleuth
    const onChainMetrics = generateMockOnChainMetrics(asset);

    // 2. Build the shared context block that all agents receive
    const sharedContextBlock = buildMarketContextString(marketContext, onChainMetrics);

    // 3. Define the list of 5 agents to query in parallel
    const agentIds: AgentId[] = [
      "value-hunter",
      "momentum-trader",
      "macro-analyst",
      "onchain-sleuth",
      "risk-guardian",
    ];

    // 4. Query all 5 agents in parallel
    const responsesPromise = agentIds.map(async (agentId) => {
      try {
        const rawRes = await callLLM(AGENT_SYSTEM_PROMPTS[agentId], sharedContextBlock);
        
        // Ensure agentId is correctly injected into the response object
        return {
          agentId,
          ...rawRes,
        } as AgentResponse;
      } catch (error: any) {
        console.error(`Error processing agent ${agentId}:`, error);
        
        // Fallback for individual agent failure, to prevent whole API from crashing
        return {
          agentId,
          decision: "HOLD" as const,
          confidence: 50,
          reasoning: `Analysis failed due to provider error: ${error.message || error}`,
          bullCase: "Not available",
          bearCase: "Not available",
          timeHorizon: "medium" as const,
        } as AgentResponse;
      }
    });

    const responses = await Promise.all(responsesPromise);

    return NextResponse.json({
      success: true,
      onChainMetrics,
      responses,
    });
  } catch (error: any) {
    console.error("API Analyze Route failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
