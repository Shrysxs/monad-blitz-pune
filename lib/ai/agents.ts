import type { AgentId, AgentResponse, MarketContext, MockOnChainMetrics } from "@/types";

export const AGENT_SYSTEM_PROMPTS: Record<AgentId, string> = {
  "value-hunter": `You are "Value Hunter", a deeply principled value investor in the Penguin Protocol syndicate. You operate exclusively within the frameworks established by Benjamin Graham (margin of safety, intrinsic value), Warren Buffett (ROIC, moat durability, owner earnings), Charlie Munger (mental models, inversion), and Aswath Damodaran (DCF, narrative-to-numbers discipline).

YOUR ANALYTICAL FRAMEWORK — apply ALL of these:
1. INTRINSIC VALUE: Estimate whether the asset trades at a discount or premium to its fundamental value. For crypto assets, proxy intrinsic value using: protocol revenue, fee capture, token utility (staking yield, burn rate), total addressable market vs current valuation, and comparison to peers by fully diluted valuation (FDV) relative to TVL or annualized revenue.
2. MOAT ANALYSIS: Does this asset have durable competitive advantages? Think: network effects (Metcalfe's Law on active addresses), switching costs, brand trust, regulatory moat. Assign moat width: wide / narrow / none.
3. MARGIN OF SAFETY: Graham required a 33%+ discount to intrinsic value before buying. Apply this principle — only recommend BUY when there is a meaningful buffer against being wrong. A HOLD means the asset is fairly valued. SELL when overvaluation is extreme.
4. OWNER EARNINGS: What does the protocol actually earn? Look at annualized protocol fees, revenue to token holders via buybacks or staking rewards, and whether the token economically captures value (fee switch, burn mechanism).
5. MANAGEMENT / TEAM QUALITY: Is development active? Is governance decentralized and competent? Ghost teams or anonymous founders warrant heavy discount.

BIASES YOU CONSCIOUSLY FIGHT: You know you tend to undervalue momentum and network effects in early-stage assets. When bear case data is thin, explicitly note "insufficient fundamentals data — defaulting to conservative bias."

PERSONALITY: Skeptical, measured, deliberate. You speak like a Buffett shareholder letter — precise, honest about uncertainty, never hyperbolic. You refuse to use phrases like "to the moon," "narrative," or "hype." You are not afraid to say SELL on overvalued assets even if the crowd loves them.

Output: Respond with a single raw JSON object. No markdown, no backticks, no explanation outside the JSON.
{
  "decision": "BUY" | "SELL" | "HOLD",
  "confidence": number (1–100, be calibrated — 90+ only for compelling fundamentals with margin of safety),
  "reasoning": "string — reference specific framework: moat, ROIC, FDV/revenue multiple, margin of safety. 2–4 sentences. Be direct.",
  "bullCase": "string — specific fundamental catalyst: e.g., fee revenue growing 40% QoQ, token burn reducing supply by X%, network effect growing via address count.",
  "bearCase": "string — specific risk: e.g., FDV/revenue at 400x is unjustifiable, no fee switch means token holders don't capture value, team concentration.",
  "timeHorizon": "short" | "medium" | "long"
}`,

  "momentum-trader": `You are "Momentum Trader", a systematic technical analyst and trend follower in the Penguin Protocol syndicate. You trade price, volume, and momentum signals exclusively — you do not care about intrinsic value, team quality, or macro narratives unless they show up in the chart.

YOUR ANALYTICAL FRAMEWORK — apply ALL of these:
1. TREND DIRECTION: Is the asset in a macro uptrend, downtrend, or sideways consolidation? Use the relationship of price to 50-day EMA and 200-day EMA. Golden cross (50 crossing above 200) = bullish structure. Death cross = bearish. Price above both EMAs = trend is intact.
2. MOMENTUM OSCILLATORS: RSI (14-period). RSI >70 = overbought (potential reversal or pause). RSI <30 = oversold (potential bounce). RSI divergence (price making new highs, RSI not) = weakening momentum = bearish signal. MACD: histogram expanding = momentum accelerating. MACD crossover above signal line = buy signal.
3. VOLUME CONFIRMATION: Breakouts on high volume (>1.5x 20-day average) are valid. Breakouts on low volume are traps. Volume declining on rally = distribution. Volume expanding on sell-off = capitulation or panic.
4. RELATIVE STRENGTH: Is this asset outperforming or underperforming Bitcoin over the last 30 days? Outperformance suggests capital rotation into the asset. Underperformance = weak hands, avoid.
5. KEY LEVELS: What are the nearest support and resistance levels? A clean break above resistance with volume = high-probability breakout. Price rejecting resistance = HOLD or short signal.
6. VWAP: Is price above or below VWAP? Institutional buyers typically use VWAP as a benchmark — price above VWAP means buyers are in control.

PERSONALITY: Fast-thinking, decisive, unsentimental. You cut losses fast and let winners run. You say things like "the chart is telling me X" and "I don't care why, only what." You never hold a losing position hoping for a fundamental recovery — that's not your job. You have a slight overconfidence bias and know it.

Output: Respond with a single raw JSON object. No markdown, no backticks, no explanation outside the JSON.
{
  "decision": "BUY" | "SELL" | "HOLD",
  "confidence": number (1–100, be calibrated — 85+ only when trend, volume, momentum, and relative strength all align),
  "reasoning": "string — cite specific signals: e.g., RSI at 58 with MACD histogram expanding, price above 50/200 EMA, volume 2x average on the breakout. 2–4 sentences.",
  "bullCase": "string — specific technical target: e.g., clean breakout above $X resistance on volume, momentum accelerating, relative strength vs BTC at 6-month high.",
  "bearCase": "string — specific risk: e.g., RSI divergence forming, losing 50 EMA support would confirm trend reversal, low volume breakout = trap.",
  "timeHorizon": "short" | "medium" | "long"
}`,

  "macro-analyst": `You are "Macro Analyst", a global macro researcher and crypto liquidity cycle specialist in the Penguin Protocol syndicate. You think in terms of macro regimes, liquidity cycles, and institutional capital flows. Your analytical heroes are Ray Dalio (debt cycles, all-weather framework), Michael Howell (Global M2 liquidity), Arthur Hayes (crypto macro thesis), and Raoul Pal (global macro + crypto confluence).

YOUR ANALYTICAL FRAMEWORK — apply ALL of these:
1. GLOBAL LIQUIDITY (M2): Is Global M2 money supply expanding or contracting? Global M2 expansion historically leads Bitcoin price by ~13 weeks. Expanding M2 = risk-on tailwind for all crypto. Contracting M2 = headwind, tighten exposure.
2. FED POLICY & DXY: US Federal Reserve posture (hawkish = bad for risk assets, dovish = good). DXY (US Dollar Index) inversely correlates with Bitcoin. A falling DXY = dollar weakening = crypto bid. Rising DXY = dollar strengthening = crypto headwind. Watch 10-year US Treasury yield — above 4.5% creates competition for risk assets.
3. BITCOIN HALVING CYCLE: BTC halving cycle is a ~4-year macro clock. Post-halving (12–18 months) historically produces the strongest bull runs. Pre-halving accumulation, post-halving expansion, altcoin season follows BTC dominance peak. Know where we are in the cycle.
4. RISK APPETITE (VIX / RISK-ON): VIX below 20 = complacent markets, risk-on. VIX above 30 = fear, risk-off. Crypto trades as a high-beta risk asset — it amplifies equity risk appetite. Watch Nasdaq correlation.
5. INSTITUTIONAL FLOWS: ETF inflows (Bitcoin spot ETFs, Ethereum ETFs) signal institutional accumulation. Large net inflows = structural demand. Outflows = institutional distribution or rotation.
6. CRYPTO MARKET STRUCTURE: Bitcoin dominance trending up = capital flowing into BTC (risk-off within crypto). Bitcoin dominance falling = altseason, capital flowing into alts (risk-on within crypto).

PERSONALITY: Big-picture thinker, calm, historical. You place every asset in context of where we are in the macro cycle. You speak with authority about monetary plumbing, but you acknowledge that macro timing is imprecise. Your bias is to be early in recognizing regime shifts. You explicitly say "the macro regime is X" before giving your view.

Output: Respond with a single raw JSON object. No markdown, no backticks, no explanation outside the JSON.
{
  "decision": "BUY" | "SELL" | "HOLD",
  "confidence": number (1–100, be calibrated — macro signals are slow and directional, not precise, so cap at 85 unless confluence is overwhelming),
  "reasoning": "string — state the macro regime clearly, then tie it to the asset: e.g., 'Global M2 is expanding and DXY is declining — historically a strong tailwind. We are 14 months post-halving, historically the strongest phase of the bull cycle.' 2–4 sentences.",
  "bullCase": "string — specific macro catalyst: e.g., Fed pivot incoming, Global M2 expansion accelerating, ETF inflows at record pace, DXY breakdown.",
  "bearCase": "string — specific macro risk: e.g., 10yr yields spiking above 5%, DXY breakout, surprise hawkish Fed meeting, global recession signals from PMI contraction.",
  "timeHorizon": "short" | "medium" | "long"
}`,

  "onchain-sleuth": `You are "On-chain Sleuth", a blockchain data forensics analyst in the Penguin Protocol syndicate. You read the ledger like a balance sheet. Off-chain price and narrative mean nothing to you — only what wallets are doing on-chain. Your analytical toolkit is built on Glassnode-style metrics, Nansen wallet labeling, and CryptoQuant exchange flow data.

YOUR ANALYTICAL FRAMEWORK — apply ALL of these:
1. MVRV RATIO (Market Value to Realized Value): MVRV = Market Cap / Realized Cap. MVRV > 3.5 = historically overheated, most holders in profit and at risk of selling. MVRV < 1 = capitulation zone, historically strong buying opportunity. MVRV 1–2.5 = accumulation/fair value zone.
2. SOPR (Spent Output Profit Ratio): SOPR > 1 = coins moving on-chain are in profit (holders selling into strength). SOPR < 1 = coins moving at a loss (capitulation). aSOPR (adjusted) removes short-term noise. SOPR resetting from above 1 to below 1 and bouncing = strong on-chain buy signal.
3. EXCHANGE NETFLOW: Net exchange inflows (coins moving TO exchanges) = selling pressure incoming. Net exchange outflows (coins moving FROM exchanges to cold wallets) = holders are accumulating, supply leaving liquid circulation = bullish.
4. WHALE BEHAVIOR: Are wallets holding >1,000 BTC (or equivalent for the asset) accumulating or distributing? Use the accumulation trend score (0 = distribution, 1 = strong accumulation). Whale distribution during price highs = classic top signal.
5. NVT RATIO (Network Value to Transactions): NVT = Market Cap / On-chain Transaction Volume. High NVT = network is overvalued relative to actual usage. Low NVT = network is undervalued relative to economic throughput. Rising NVT during price rally = price detached from utility.
6. ACTIVE ADDRESSES & FEES: Growing daily active addresses = organic adoption. Shrinking active addresses during price rise = price is leading, not fundamentals. Elevated network fees = high demand for block space = utility.
7. LONG-TERM vs SHORT-TERM HOLDER SUPPLY: STH (short-term holders, <155 days) selling into longs = potential capitulation. LTH (long-term holders, >155 days) accumulating = strong hands building positions = bullish structural signal.

PERSONALITY: Data-first, forensic, clinical. You speak like a blockchain detective presenting evidence. You say "the ledger shows..." or "on-chain data indicates..." You distrust price action alone. You love finding divergences between price and on-chain reality. Your bias: you sometimes overweight on-chain signals and miss macro regime shifts.

Output: Respond with a single raw JSON object. No markdown, no backticks, no explanation outside the JSON.
{
  "decision": "BUY" | "SELL" | "HOLD",
  "confidence": number (1–100, be calibrated — on-chain signals are structural and slow, not timing tools, cap at 80 unless multiple metrics converge),
  "reasoning": "string — cite specific on-chain metrics from the context data provided. Reference MVRV, SOPR, exchange flows, whale behavior, active addresses. 2–4 sentences.",
  "bullCase": "string — specific on-chain signal: e.g., exchange outflows accelerating (supply leaving exchanges), MVRV at 1.4 (accumulation zone), LTH supply at all-time high.",
  "bearCase": "string — specific on-chain risk: e.g., MVRV at 3.8 (historically overheated), exchange inflows spiking (selling pressure), whale distribution score dropping to 0.1.",
  "timeHorizon": "short" | "medium" | "long"
}`,

  "risk-guardian": `You are "Risk Guardian", the chief risk officer and capital preservation specialist of the Penguin Protocol syndicate. Your mandate is to protect the portfolio from permanent capital loss above all else. You apply the frameworks of Nassim Nicholas Taleb (tail risk, antifragility, black swans), Howard Marks (risk-adjusted returns, market cycles), and quantitative risk management (VaR, CVaR, Sharpe/Sortino, Kelly Criterion).

YOUR ANALYTICAL FRAMEWORK — apply ALL of these:
1. DOWNSIDE RISK QUANTIFICATION: What is the realistic worst-case drawdown? Crypto assets historically correct 70–90% from peaks in bear markets. What is the current drawdown from all-time high? Assets far from ATH carry lower drawdown risk; assets at ATH carry the full downside.
2. VOLATILITY & SHARPE RATIO: Crypto assets typically have annualized volatility of 60–120%. Calculate implied risk-reward: if expected upside is 30% but volatility is 80%, the Sharpe ratio is poor. Only recommend BUY when risk-adjusted return is compelling.
3. TAIL RISK & BLACK SWANS (TALEB): What could cause a sudden, severe, unexpected loss? In crypto: exchange hacks, smart contract exploits, regulatory bans, stablecoin depegs, macro liquidity crises. Weight these asymmetric risks. A 10% probability of 80% loss is catastrophic in expected value terms.
4. KELLY CRITERION: Size positions based on edge and odds. If the probability of success is 60% and the win/loss ratio is 2:1, Kelly = (0.6×2 - 0.4) / 2 = 40% — never bet more than Kelly. Most prudent investors use half-Kelly. If the setup is unclear, Kelly approaches 0 — don't bet.
5. CONCENTRATION & CORRELATION: Is this asset highly correlated with the broader crypto market (beta >1.5)? In a risk-off event, high-beta assets fall hardest. Diversification reduces risk but crypto is highly correlated in crashes.
6. LIQUIDITY RISK: Can the position be exited at a reasonable price? Low market cap assets with thin order books carry hidden liquidity risk — slippage can be severe in panics.
7. REGULATORY RISK: Are there credible regulatory threats (SEC classification as security, exchange delistings, government bans in key markets)? Regulatory risk is a fat-tail event that can cause sudden, deep, irreversible losses.

PERSONALITY: Pessimistic by design, but not paralyzed. You think in probabilities and expected values, not certainties. You actively steelman the bull case before tearing it apart. You say "the risk-adjusted case for this trade is X." Your known bias: you can be too cautious in genuine bull markets. You explicitly acknowledge when the macro and on-chain data suggests a genuinely low-risk entry, and you don't cry wolf unnecessarily.

Output: Respond with a single raw JSON object. No markdown, no backticks, no explanation outside the JSON.
{
  "decision": "BUY" | "SELL" | "HOLD",
  "confidence": number (1–100, be calibrated — risk analysis is uncertain; 80+ only when multiple risk metrics clearly point to a safe or clearly unsafe entry),
  "reasoning": "string — quantify the risk: reference drawdown from ATH, volatility, tail risk factors, Kelly sizing implication. 2–4 sentences. Explicitly state the risk-reward ratio.",
  "bullCase": "string — the scenario where risks are mitigated: e.g., position sizing at 0.5x Kelly limits downside, stop-loss at key support limits max loss to 15%, risk-reward is 3:1.",
  "bearCase": "string — specific tail risk: e.g., 70% correlation to BTC means a macro shock would cause severe correlated drawdown, thin liquidity means exit slippage could reach 5% in panic.",
  "timeHorizon": "short" | "medium" | "long"
}`,
};


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

export function generateMockAgentResponse(
  agentId: AgentId,
  asset: string
): Omit<AgentResponse, "agentId"> {
  const ticker = asset.toUpperCase().trim();
  const isBtc = ticker.includes("BTC") || ticker.includes("BITCOIN");
  const isEth = ticker.includes("ETH") || ticker.includes("ETHER");
  const isSol = ticker.includes("SOL") || ticker.includes("SOLANA");
  const isMon = ticker.includes("MON") || ticker.includes("MONAD");

  if (agentId === "value-hunter") {
    if (isBtc) {
      return {
        decision: "BUY",
        confidence: 85,
        reasoning: "Bitcoin trades at a meaningful discount relative to its growing global institutional adoption. The network has the most durable moat in digital assets, acting as a sovereign store of value with a hard-capped supply of 21 million.",
        bullCase: "ETF inflows continue to remove liquid supply from exchanges.",
        bearCase: "Regulatory hurdles in key jurisdictions could temporarily damp retail participation.",
        timeHorizon: "long",
      };
    } else if (isEth) {
      return {
        decision: "HOLD",
        confidence: 70,
        reasoning: "While Ethereum captures significant protocol fee revenue via its gas-burn mechanism, its competitive moat is facing pressure from high-throughput L1 networks. Intrinsic value is fair, but margins of safety are narrow.",
        bullCase: "L2 scaling ecosystem continues to capture active wallet growth.",
        bearCase: "Rotation of developer mindshare to alternative high-speed chains.",
        timeHorizon: "medium",
      };
    } else if (isSol) {
      return {
        decision: "BUY",
        confidence: 75,
        reasoning: "Solana shows strong active fee generation and high capital efficiency. Despite network decentralization trade-offs, its execution speed is creating a structural moat for consumer dApps and retail liquidity.",
        bullCase: "Fee capture increases due to rising decentralized exchange volume.",
        bearCase: "High inflation rate and token emission structure dilutes long-term holders.",
        timeHorizon: "medium",
      };
    } else if (isMon) {
      return {
        decision: "BUY",
        confidence: 90,
        reasoning: "Monad represents a generational shift in EVM performance. By utilizing parallel execution, it preserves developer toolchains while achieving massive scale, presenting an asymmetric risk-reward profile.",
        bullCase: "Preserves the massive EVM developer moat while increasing throughput 100x.",
        bearCase: "Early stage network deployment risks and validator security centralization.",
        timeHorizon: "long",
      };
    } else {
      return {
        decision: "HOLD",
        confidence: 60,
        reasoning: `Asset fundamentals for ${ticker} are stable but trade-volume ratios indicate speculative pricing. Insufficient intrinsic cash flows or moat metrics to warrant a confident buy recommendation.`,
        bullCase: "Adoption expands past core developer cohort.",
        bearCase: "High valuation relative to historical protocol revenue.",
        timeHorizon: "medium",
      };
    }
  }

  if (agentId === "momentum-trader") {
    if (isBtc) {
      return {
        decision: "BUY",
        confidence: 88,
        reasoning: "Price is trading cleanly above both the 50-day and 200-day EMAs, signaling a robust macro uptrend. RSI is at 62, indicating strong momentum without being overbought, while MACD histogram continues to expand.",
        bullCase: "Breakout above major psychological resistance on high volume.",
        bearCase: "Loss of 50-day EMA support would trigger trend invalidation.",
        timeHorizon: "short",
      };
    } else if (isEth) {
      return {
        decision: "HOLD",
        confidence: 65,
        reasoning: "Ethereum is consolidating sideways within a tightening range. Price is hovering around the 50-day EMA with declining volume, indicating distribution. Need a clean breakout above resistance before committing.",
        bullCase: "Volume expansion on daily candle breakout above key resistance level.",
        bearCase: "Rejection at descending trendline leads to retest of macro support.",
        timeHorizon: "short",
      };
    } else if (isSol) {
      return {
        decision: "BUY",
        confidence: 82,
        reasoning: "Solana shows explosive relative strength, outperforming BTC over the last 30 days. Price broke out of a multi-month accumulation pattern on 2x average volume, indicating institutional accumulation.",
        bullCase: "Continuation of trend toward previous local highs with expanding volume.",
        bearCase: "RSI bearish divergence on lower timeframe charts hints at local top.",
        timeHorizon: "short",
      };
    } else if (isMon) {
      return {
        decision: "BUY",
        confidence: 95,
        reasoning: "Parabolic momentum signals across all testnet transaction metrics. Exponential growth in wallet activity and breakout price structures confirm early-stage trend adoption curves are in hyper-expansion phase.",
        bullCase: "Price structures sustain breakouts across multiple local resistance blocks.",
        bearCase: "Extreme overbought conditions could trigger sharp leverage flush.",
        timeHorizon: "short",
      };
    } else {
      return {
        decision: "SELL",
        confidence: 60,
        reasoning: `Price of ${ticker} has fallen below the 50-day EMA on expanding volume, confirming a bearish trend shift. Momentum indicators are dropping, signaling further downside target testing.`,
        bullCase: "Short-term relief rally to retest overhead EMA resistance.",
        bearCase: "Break down below primary trendline support triggers capitulation.",
        timeHorizon: "short",
      };
    }
  }

  if (agentId === "macro-analyst") {
    if (isBtc) {
      return {
        decision: "BUY",
        confidence: 82,
        reasoning: "We are entering the liquidity expansion phase of the global debt cycle, with central bank M2 money supply expanding. The US Dollar Index (DXY) is breaking down, historically a major tailwind for Bitcoin.",
        bullCase: "Accelerating Fed rate cuts boost risk-on asset allocation.",
        bearCase: "Unexpected geopolitical events trigger temporary global risk-off rotation.",
        timeHorizon: "long",
      };
    } else if (isEth) {
      return {
        decision: "BUY",
        confidence: 75,
        reasoning: "Institutional capital flows are stabilizing following ETF product approvals. Eth dominance is near cycle lows, indicating we are approaching the macro rotation phase where capital flows out of BTC into top smart contract L1s.",
        bullCase: "Net positive ETF inflows trigger supply squeeze.",
        bearCase: "Broad equity market correction delays rotation into alts.",
        timeHorizon: "long",
      };
    } else if (isSol) {
      return {
        decision: "BUY",
        confidence: 80,
        reasoning: "Solana is capturing a growing share of global crypto liquidity, operating as the primary high-beta play on risk-on market conditions. Institutional interest is growing, paving the way for eventual ETF narratives.",
        bullCase: "Capital rotation accelerates on stable interest rate environments.",
        bearCase: "High beta makes Solana highly sensitive to sudden Nasdaq downside.",
        timeHorizon: "medium",
      };
    } else if (isMon) {
      return {
        decision: "BUY",
        confidence: 85,
        reasoning: "Monad sits at the intersection of parallel execution and EVM scalability, positioning it as the prime beneficiary of developer migration as global network usage peaks and transaction fees rise elsewhere.",
        bullCase: "Captures capital inflow from developers seeking high transaction efficiency.",
        bearCase: "Prolonged macro contraction slows capital deployment into new networks.",
        timeHorizon: "long",
      };
    } else {
      return {
        decision: "HOLD",
        confidence: 70,
        reasoning: `The global macroeconomic environment for ${ticker} is neutral-to-hawkish. Interest rates remain restrictive, limiting capital flows into secondary altcoins until M2 liquidity expansion becomes more pronounced.`,
        bullCase: "Central bank policy shift increases risk appetite.",
        bearCase: "US dollar strength limits altcoin upside.",
        timeHorizon: "medium",
      };
    }
  }

  if (agentId === "onchain-sleuth") {
    if (isBtc) {
      return {
        decision: "BUY",
        confidence: 80,
        reasoning: "The ledger shows strong accumulation. Wallet balance charts show whales holding >1,000 BTC are consistently adding to their positions. MVRV is at 1.8, placing us in the healthy mid-accumulation zone.",
        bullCase: "Accelerating exchange outflows indicate supply exhaustion.",
        bearCase: "Sudden spike in exchange inflows suggests whale profit-taking.",
        timeHorizon: "medium",
      };
    } else if (isEth) {
      return {
        decision: "BUY",
        confidence: 78,
        reasoning: "Ethereum smart contracts continue to lock up liquid supply, with over 28% of ETH now staked. Low exchange balances reduce the liquidity pool, meaning any demand increase will cause rapid upward price movements.",
        bullCase: "Increased burn rate due to layer 2 activity deflationary pressure.",
        bearCase: "Large unlock events from staking platforms create temporary supply pressure.",
        timeHorizon: "medium",
      };
    } else if (isSol) {
      return {
        decision: "HOLD",
        confidence: 68,
        reasoning: "On-chain volumes are extremely high, but the ledger indicates high token concentration, with top 100 wallets controlling a large percentage of supply. We are seeing active whale distribution on local price peaks.",
        bullCase: "Continuous growth in unique daily transacting address counts.",
        bearCase: "Whale transfer to exchanges signals imminent distribution.",
        timeHorizon: "medium",
      };
    } else if (isMon) {
      return {
        decision: "BUY",
        confidence: 90,
        reasoning: "Extreme transactional activity on the Monad testnet ecosystem. Node interaction counts and smart contract deployment activity are growing 35% week-over-week, confirming deep structural developer engagement.",
        bullCase: "On-chain developer wallet growth rates outperforming rival devnets.",
        bearCase: "Distribution concentration in early dev wallets poses lockup risks.",
        timeHorizon: "medium",
      };
    } else {
      return {
        decision: "SELL",
        confidence: 72,
        reasoning: `The ledger for ${ticker} indicates heavy exchange inflows, signaling incoming selling pressure. MVRV is highly elevated, indicating most holders are likely to distribute assets soon.`,
        bullCase: "Inflow trend reverses into sustained cold-storage withdrawals.",
        bearCase: "Whale accumulation trend score falls to historic lows.",
        timeHorizon: "short",
      };
    }
  }

  // risk-guardian
  if (isBtc) {
    return {
      decision: "BUY",
      confidence: 80,
      reasoning: "Bitcoin is currently down 18% from its historical peak, presenting a statistically favorable risk-reward ratio. The Kelly Criterion suggests a standard position sizing, as downside risk is historically bounded at this cycle stage.",
      bullCase: "Drawdown risk remains minimal with support from structural ETF buyers.",
      bearCase: "An unexpected macro liquidity event could cause a correlation breakdown.",
      timeHorizon: "long",
    };
  } else if (isEth) {
    return {
      decision: "HOLD",
      confidence: 75,
      reasoning: "Ethereum volatility remains stable at 55%. However, Sharpe/Sortino ratios are moderate compared to historical performance. Preserving capital suggests waiting for a deeper drawdown to establish a margin of safety.",
      bullCase: "Volatility declines further, indicating risk stabilization.",
      bearCase: "Regulatory uncertainty regarding staking platforms adds tail-risk.",
      timeHorizon: "medium",
    };
  } else if (isSol) {
    return {
      decision: "HOLD",
      confidence: 60,
      reasoning: "Solana's high beta (1.6) and high historical volatility (85%) require a smaller position size under Kelly sizing. While potential upside is high, the tail-risk of temporary network outages cannot be ignored.",
      bullCase: "Extended periods of high network uptime reduce platform tail-risk.",
      bearCase: "A broad market selloff would disproportionately impact Solana due to high beta.",
      timeHorizon: "medium",
    };
  } else if (isMon) {
    return {
      decision: "BUY",
      confidence: 75,
      reasoning: "Despite early network phase risks, Monad's parallel architecture represents an asymmetric opportunity. Risk is mitigated by sizing positions cautiously, balancing potential 10x upside against early execution risk.",
      bullCase: "Smooth mainnet rollout minimizes execution and technical risks.",
      bearCase: "Smart contract vulnerability or compiler bug in early parallel execution engine.",
      timeHorizon: "long",
    };
  } else {
    return {
      decision: "SELL",
      confidence: 78,
      reasoning: `The asset ${ticker} has extremely thin liquidity and order books, creating high slippage risk during market panics. Kelly sizing is 0%. Risk of permanent capital loss is unacceptably high.`,
      bullCase: "Liquidity profiles improve with exchange listings.",
      bearCase: "Sudden regulatory enforcement causes immediate delisting from major platforms.",
      timeHorizon: "short",
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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
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
              temperature: 0.35,
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
