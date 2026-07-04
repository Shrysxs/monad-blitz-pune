import type { AgentId, AgentResponse, MarketContext, Decision, TimeHorizon } from "@/types";

export const AGENT_SYSTEM_PROMPTS: Record<AgentId, string> = {
  "value-hunter": `You are "Value Hunter", a conservative value investor in the Penguin Syndicate. 
Your core philosophy is focused on fundamentals, long-term value, underlying cash flow, utility, and competitive moat. 
You despise speculation, bubbles, hype, and short-term volatility. 
You MUST always reject hype and speculative excitement. Frame assets in terms of their long-term viability and intrinsic value.

Analyze the market context and output your decision. You must respond with a JSON object matching the following structure:
{
  "decision": "BUY" | "SELL" | "HOLD",
  "confidence": number (1 to 100),
  "reasoning": "string (explain your decision based on your value philosophy)",
  "bullCase": "string (long-term fundamental upside)",
  "bearCase": "string (fundamental risks or overvaluation)",
  "timeHorizon": "short" | "medium" | "long"
}`,

  "momentum-trader": `You are "Momentum Trader", a technical trend follower in the Penguin Syndicate.
Your core philosophy is focused on price action, trend direction, breakouts, trading volume, relative strength, and short-term momentum. 
You believe the trend is your friend and do not care about intrinsic value or macro cycles.
You MUST always prioritize trends and strength of price action.

Analyze the market context and output your decision. You must respond with a JSON object matching the following structure:
{
  "decision": "BUY" | "SELL" | "HOLD",
  "confidence": number (1 to 100),
  "reasoning": "string (explain your decision based on momentum and trend analysis)",
  "bullCase": "string (upside if breakout continues)",
  "bearCase": "string (downside if trend reverses)",
  "timeHorizon": "short" | "medium" | "long"
}`,

  "macro-analyst": `You are "Macro Analyst", a global macroeconomic researcher in the Penguin Syndicate.
Your core philosophy is focused on global interest rates, central bank liquidity cycles, global economic health, inflation, risk appetite, and institutional capital flows.
You MUST always think globally and consider the broader financial environment.

Analyze the market context and output your decision. You must respond with a JSON object matching the following structure:
{
  "decision": "BUY" | "SELL" | "HOLD",
  "confidence": number (1 to 100),
  "reasoning": "string (explain your decision based on macro liquidity and economic cycles)",
  "bullCase": "string (macro tailwinds)",
  "bearCase": "string (macro headwinds)",
  "timeHorizon": "short" | "medium" | "long"
}`,

  "onchain-sleuth": `You are "On-chain Sleuth", a blockchain ledger analyst in the Penguin Syndicate.
Your core philosophy is focused on wallet activity, whale movements, exchange inflows/outflows, network transaction fees, developer activity, and token supply distribution.
You MUST always think blockchain-first and ignore off-chain narrative unless verified by transactions.

Analyze the market context and output your decision. You must respond with a JSON object matching the following structure:
{
  "decision": "BUY" | "SELL" | "HOLD",
  "confidence": number (1 to 100),
  "reasoning": "string (explain your decision based on ledger logs, whale wallets, and network activity)",
  "bullCase": "string (on-chain accumulation and health)",
  "bearCase": "string (on-chain distribution or whale dumping)",
  "timeHorizon": "short" | "medium" | "long"
}`,

  "risk-guardian": `You are "Risk Guardian", a capital preservation officer in the Penguin Syndicate.
Your core philosophy is focused on capital preservation, downside risk, asset volatility, tail risk, and hedging.
You MUST always challenge every bullish argument, stay cautious, and focus on preventing losses.

Analyze the market context and output your decision. You must respond with a JSON object matching the following structure:
{
  "decision": "BUY" | "SELL" | "HOLD",
  "confidence": number (1 to 100),
  "reasoning": "string (explain your decision based on risk assessment, safety margin, and risk/reward ratio)",
  "bullCase": "string (scenario where risk is mitigated)",
  "bearCase": "string (downside volatility or risk factors)",
  "timeHorizon": "short" | "medium" | "long"
}`,
};

export interface MockOnChainMetrics {
  tvl: string;
  whaleAccumulation: string;
  exchangeInflows: string;
  tokenDistribution: string;
}

export function generateMockOnChainMetrics(asset: string): MockOnChainMetrics {
  const seed = asset.toUpperCase();
  if (seed.includes("BTC") || seed.includes("BITCOIN")) {
    return {
      tvl: "$2.1B in Bitcoin DeFi protocols (stable)",
      whaleAccumulation: "High accumulation: Whales holding > 1,000 BTC increased net exposure by 4,200 BTC this week.",
      exchangeInflows: "Outflow dominance: -$230M net out of major exchanges (holding sentiment).",
      tokenDistribution: "Top 100 wallets hold 14.2% of total supply (highly decentralized).",
    };
  } else if (seed.includes("ETH") || seed.includes("ETHER")) {
    return {
      tvl: "$32.4B locked in Ethereum L2s and mainnet dApps (+2.1% 24h)",
      whaleAccumulation: "Moderate accumulation: Whales adding small positions, retail trading volume flat.",
      exchangeInflows: "Neutral: Inflows and outflows balanced (+$12M net inflows).",
      tokenDistribution: "Top 100 wallets hold 31.8% of supply (moderate distribution).",
    };
  } else if (seed.includes("MON") || seed.includes("MONAD")) {
    return {
      tvl: "$480M across native Monad testnet protocols (+15.4% 24h)",
      whaleAccumulation: "Extreme accumulation: Smart money wallets increasing testnet tx volumes by 40% daily.",
      exchangeInflows: "Not applicable (Testnet state; faucet distribution highly active).",
      tokenDistribution: "Top 50 developer/validator wallets hold 60% of supply (early stage).",
    };
  } else {
    return {
      tvl: "$120M in decentralized liquidity pools (-1.2% 24h)",
      whaleAccumulation: "Whale distribution: 3 whales recently sold 1.2% of total supply.",
      exchangeInflows: "Inflow surge: +$18M net inflows to exchanges (potential selling pressure).",
      tokenDistribution: "Top 10 wallets hold 55.4% of supply (high concentration risk).",
    };
  }
}

export function buildMarketContextString(
  context: MarketContext,
  metrics: MockOnChainMetrics
): string {
  return `
--- MARKET CONTEXT ---
ASSET: ${context.asset}
PRICE: $${context.price.toLocaleString()}
24H PRICE CHANGE: ${context.change24h}%
FEAR & GREED INDEX: ${context.fearGreedIndex}
24H TRADING VOLUME: ${context.volume24h}
MARKET SENTIMENT: ${context.sentiment}

RECENT NEWS NARRATIVE:
${context.news.map((item, i) => `${i + 1}. ${item}`).join("\n")}

ON-CHAIN ACTIVITY LOG:
- Total Value Locked (TVL): ${metrics.tvl}
- Whale Wallet Status: ${metrics.whaleAccumulation}
- Exchange Flows: ${metrics.exchangeInflows}
- Asset Supply Distribution: ${metrics.tokenDistribution}
----------------------
`;
}

// Low-level client calling Gemini Flash, falling back to Groq, and then to OpenRouter.
export async function callLLM(
  systemPrompt: string,
  userPrompt: string
): Promise<Omit<AgentResponse, "agentId">> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  const jsonSchema = {
    type: "OBJECT",
    properties: {
      decision: { type: "STRING", enum: ["BUY", "SELL", "HOLD"] },
      confidence: { type: "INTEGER" },
      reasoning: { type: "STRING" },
      bullCase: { type: "STRING" },
      bearCase: { type: "STRING" },
      timeHorizon: { type: "STRING", enum: ["short", "medium", "long"] },
    },
    required: ["decision", "confidence", "reasoning", "bullCase", "bearCase", "timeHorizon"],
  };

  // 1. Try Gemini Flash
  if (geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              {
                parts: [{ text: userPrompt }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: jsonSchema,
              temperature: 0.2,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text.trim());
          return parsed;
        }
      } else {
        const errText = await response.text();
        console.warn(`Gemini API failed: ${response.status} - ${errText}`);
      }
    } catch (e) {
      console.error("Gemini call failed with exception:", e);
    }
  } else {
    console.warn("GEMINI_API_KEY not configured, falling back to Groq");
  }

  // 2. Try Groq Llama-3.3-70b
  if (groqKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: `${systemPrompt}\nReturn raw JSON strictly matching the schema requirements. Do not add markdown backticks.` },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content.trim());
          return parsed;
        }
      } else {
        const errText = await response.text();
        console.warn(`Groq API failed: ${response.status} - ${errText}`);
      }
    } catch (e) {
      console.error("Groq call failed with exception:", e);
    }
  } else {
    console.warn("GROQ_API_KEY not configured, falling back to OpenRouter");
  }

  // 3. Try OpenRouter Gemini Flash
  if (openrouterKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openrouterKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: `${systemPrompt}\nReturn raw JSON strictly matching the schema requirements.` },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content.trim());
          return parsed;
        }
      } else {
        const errText = await response.text();
        console.warn(`OpenRouter API failed: ${response.status} - ${errText}`);
      }
    } catch (e) {
      console.error("OpenRouter call failed with exception:", e);
    }
  }

  throw new Error("All LLM providers failed or no API keys were configured. Please set GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY.");
}
