import type { MarketContext } from "@/types";

export function generateMarketContext(assetName: string): MarketContext {
  const ticker = assetName.toUpperCase().trim();
  
  if (ticker === "BTC" || ticker === "BITCOIN") {
    return {
      asset: "BTC",
      price: 118250,
      change24h: 2.4,
      fearGreedIndex: 74,
      volume24h: "$42.5B",
      sentiment: "Strongly Bullish",
      news: [
        "Bitcoin consolidates above $118k after ETF inflows surpass record levels",
        "Federal Reserve signals potential rate pauses, fueling risk-on appetite",
        "Whale wallets transfer over 12,000 BTC off exchanges into cold storage"
      ]
    };
  } else if (ticker === "ETH" || ticker === "ETHER" || ticker === "ETHEREUM") {
    return {
      asset: "ETH",
      price: 3120,
      change24h: -1.2,
      fearGreedIndex: 68,
      volume24h: "$18.1B",
      sentiment: "Neutral to Moderately Bullish",
      news: [
        "Ethereum gas fees hit multi-month lows as L2 transaction share dominates",
        "Staking yield yields compress slightly to 3.2%, matching yield curve expectations",
        "Smart money wallets rotating ETH holdings into high-yield DeFi yield strategies"
      ]
    };
  } else if (ticker === "MON" || ticker === "MONAD") {
    return {
      asset: "MON",
      price: 4.85,
      change24h: 14.2,
      fearGreedIndex: 85,
      volume24h: "$850M",
      sentiment: "Extremely Bullish",
      news: [
        "Monad testnet transactions surpass 2.5 billion, confirming 10,000 TPS parallel execution speed",
        "Developer activity surges with 120 new projects deploying ecosystem components",
        "Monad community metrics reach new highs ahead of public mainnet details"
      ]
    };
  } else {
    return {
      asset: ticker || "UNKNOWN",
      price: 1.25,
      change24h: 0.5,
      fearGreedIndex: 52,
      volume24h: "$24M",
      sentiment: "Neutral",
      news: [
        "Asset trading volumes remain flat amid macroeconomic uncertainty",
        "Social media mentions decline for low-cap crypto assets",
        "Development team schedules minor network upgrade for next month"
      ]
    };
  }
}
