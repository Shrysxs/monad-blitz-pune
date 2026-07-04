import type { AgentResponse, ConsensusResult, Decision } from "@/types";

/**
 * Computes the consensus recommendation and confidence from 5 agent responses.
 * Uses a simple weighted voting model where each agent's vote is weighted by their self-reported confidence.
 */
export function calculateConsensus(responses: AgentResponse[]): ConsensusResult {
  const voteBreakdown: Record<Decision, number> = {
    BUY: 0,
    SELL: 0,
    HOLD: 0,
  };

  // 1. Calculate the weighted sum of votes for each decision
  responses.forEach((res) => {
    const decision = res.decision;
    const confidence = res.confidence;
    voteBreakdown[decision] += confidence;
  });

  // 2. Find the winning decision
  let recommendation: Decision = "HOLD";
  let maxWeight = -1;

  (Object.keys(voteBreakdown) as Decision[]).forEach((decision) => {
    if (voteBreakdown[decision] > maxWeight) {
      maxWeight = voteBreakdown[decision];
      recommendation = decision;
    }
  });

  // 3. Compute the overall consensus confidence
  // We calculate it as: winning_weight / total_weight of all votes
  const totalWeight = voteBreakdown.BUY + voteBreakdown.SELL + voteBreakdown.HOLD;
  
  let confidence = 50; // default fallback if totalWeight is 0
  if (totalWeight > 0) {
    confidence = Math.round((voteBreakdown[recommendation] / totalWeight) * 100);
  }

  return {
    recommendation,
    confidence,
    voteBreakdown,
  };
}
