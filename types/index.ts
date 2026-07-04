export type Decision = "BUY" | "SELL" | "HOLD";

export type TimeHorizon = "short" | "medium" | "long";

export interface AgentResponse {
  agentId: AgentId;
  decision: Decision;
  confidence: number;
  reasoning: string;
  bullCase: string;
  bearCase: string;
  timeHorizon: TimeHorizon;
}

export type AgentId =
  | "value-hunter"
  | "momentum-trader"
  | "macro-analyst"
  | "onchain-sleuth"
  | "risk-guardian";

export type SyndicateId = "monad-alpha" | "crypto-growth" | "macro-vision";

export interface Syndicate {
  id: SyndicateId;
  name: string;
  description: string;
  focus: string;
}

export interface Agent {
  id: AgentId;
  name: string;
  focus: string;
  mustAlways: string;
}

export interface MarketContext {
  asset: string;
  price: number;
  change24h: number;
  fearGreedIndex: number;
  volume24h: string;
  sentiment: string;
  news: string[];
}

export interface ConsensusResult {
  recommendation: Decision;
  confidence: number;
  voteBreakdown: Record<Decision, number>;
}

export interface OnChainRecord {
  asset: string;
  decision: Decision;
  confidence: number;
  timestamp: number;
}
