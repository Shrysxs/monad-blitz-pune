import type { Agent } from "@/types";

export const AGENTS: Agent[] = [
  {
    id: "value-hunter",
    name: "Value Hunter",
    focus: "Fundamentals, long-term value, cash flow, moat, low speculation",
    mustAlways: "reject hype",
  },
  {
    id: "momentum-trader",
    name: "Momentum Trader",
    focus: "Trend, breakouts, volume, market strength, short-term momentum",
    mustAlways: "prioritize trends",
  },
  {
    id: "macro-analyst",
    name: "Macro Analyst",
    focus:
      "Interest rates, liquidity, global economy, risk appetite, institutional flows",
    mustAlways: "think globally",
  },
  {
    id: "onchain-sleuth",
    name: "On-chain Sleuth",
    focus:
      "Wallet activity, whale movements, exchange inflows, TVL, token distribution",
    mustAlways: "think blockchain-first",
  },
  {
    id: "risk-guardian",
    name: "Risk Guardian",
    focus:
      "Downside, volatility, tail risk, portfolio exposure, capital preservation",
    mustAlways: "challenge every case, stay cautious",
  },
];
