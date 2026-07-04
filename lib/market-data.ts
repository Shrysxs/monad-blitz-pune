import type { MarketContext } from "@/types";
import { generateMarketContext } from "@/features/market-context/mock";

/**
 * Fetches real-time price, volume, and 24h change from public Binance API.
 * Falls back to mock data if not listed on Binance (e.g., testnet MON) or on network failures.
 */
export async function fetchMarketContext(assetName: string): Promise<MarketContext> {
  const ticker = assetName.toUpperCase().trim();
  
  try {
    const symbol = `${ticker}USDT`;
    
    // Set a 4-second timeout on the network fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, {
      signal: controller.signal,
      next: { revalidate: 60 } // Cache context for 60 seconds to avoid spamming the API
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const price = parseFloat(data.lastPrice);
      const change24h = parseFloat(data.priceChangePercent);
      const quoteVolume = parseFloat(data.quoteVolume);
      
      let volume24h = `$${(quoteVolume / 1e9).toFixed(2)}B`;
      if (quoteVolume < 1e9) {
        volume24h = `$${(quoteVolume / 1e6).toFixed(2)}M`;
      }

      // Compute dynamic sentiment based on price action
      let sentiment = "Neutral";
      if (change24h > 4.0) {
        sentiment = "Strongly Bullish";
      } else if (change24h > 1.0) {
        sentiment = "Moderately Bullish";
      } else if (change24h < -4.0) {
        sentiment = "Strongly Bearish";
      } else if (change24h < -1.0) {
        sentiment = "Moderately Bearish";
      }

      // Compute dynamic Fear & Greed index based on 24h price direction
      let fearGreedIndex = 50;
      if (change24h > 0) {
        fearGreedIndex = Math.min(95, Math.round(50 + change24h * 3));
      } else {
        fearGreedIndex = Math.max(5, Math.round(50 + change24h * 3));
      }

      // Dynamic news narrative generated using the real price action
      const trendVerb = change24h >= 0 ? "strengthens" : "softens";
      const accumulationText = change24h >= 0 
        ? "suggesting institutional accumulation during current momentum"
        : "triggering cautionary reviews from derivative and spot markets";

      const news = [
        `Market logs indicate ${ticker} trading volumes are active, as the spot price settles at $${price.toLocaleString()}.`,
        `Short-term indicators display a 24h change of ${change24h >= 0 ? "+" : ""}${change24h}%, ${trendVerb} overall sentiment index.`,
        `Ledger metrics indicate high net wallet distribution trends, ${accumulationText}.`
      ];

      return {
        asset: ticker,
        price,
        change24h,
        fearGreedIndex,
        volume24h,
        sentiment,
        news,
      };
    }
  } catch (error) {
    console.warn(`Could not fetch live Binance price for ticker ${ticker}, falling back to static generator.`, error);
  }

  // Fallback to static mock database (useful for MON/Testnet tokens)
  return generateMarketContext(ticker);
}
