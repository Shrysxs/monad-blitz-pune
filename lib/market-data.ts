import type { MarketContext } from "@/types";

export interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

export const FALLBACK_ASSETS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "tether", symbol: "USDT", name: "Tether" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "shiba-inu", symbol: "SHIB", name: "Shiba Inu" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink" },
  { id: "tron", symbol: "TRX", name: "TRON" },
  { id: "matic-network", symbol: "MATIC", name: "Polygon" },
  { id: "litecoin", symbol: "LTC", name: "Litecoin" },
  { id: "near", symbol: "NEAR", name: "NEAR Protocol" },
  { id: "uniswap", symbol: "UNI", name: "Uniswap" },
  { id: "pepe", symbol: "PEPE", name: "Pepe" },
  { id: "stellar", symbol: "XLM", name: "Stellar" },
  { id: "aptos", symbol: "APT", name: "Aptos" },
  { id: "sui", symbol: "SUI", name: "Sui" },
  { id: "fantom", symbol: "FTM", name: "Fantom" },
  { id: "optimism", symbol: "OP", name: "Optimism" },
  { id: "arbitrum", symbol: "ARB", name: "Arbitrum" },
  { id: "render-token", symbol: "RNDR", name: "Render" },
  { id: "hedera-hashgraph", symbol: "HBAR", name: "Hedera" },
  { id: "kaspa", symbol: "KAS", name: "Kaspa" },
  { id: "cosmos", symbol: "ATOM", name: "Cosmos" },
  { id: "stacks", symbol: "STX", name: "Stacks" },
  { id: "filecoin", symbol: "FIL", name: "Filecoin" }
];

// Global cached variables
let cachedMarkets: CoinGeckoMarketData[] = [];
let lastFetchMarkets = 0;

let cachedFnG: { value: number; classification: string } | null = null;
let lastFetchFnG = 0;

export function isMarketsListFallback(): boolean {
  return lastFetchMarkets === 0;
}

interface CachedPrice {
  price: number;
  change24h: number;
  volume24h: string;
  timestamp: number;
}
const priceCache = new Map<string, CachedPrice>();

const CACHE_DURATION = 60000; // 60 seconds for list
const PRICE_CACHE_DURATION = 30000; // 30 seconds for specific prices

export async function getMarketsList(): Promise<CoinGeckoMarketData[]> {
  const now = Date.now();
  if (cachedMarkets.length > 0 && now - lastFetchMarkets < CACHE_DURATION) {
    return cachedMarkets;
  }

  try {
    console.log("Fetching markets list from CoinGecko...");
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error(`CoinGecko markets fetch failed with status ${response.status}`);
    }
    interface GeckMarketItem {
      id: string;
      symbol: string;
      name: string;
      current_price: number;
      total_volume: number;
      price_change_percentage_24h?: number;
    }
    const data = (await response.json()) as GeckMarketItem[];
    cachedMarkets = data.map((item) => ({
      id: String(item.id),
      symbol: String(item.symbol).toUpperCase(),
      name: String(item.name),
      current_price: Number(item.current_price),
      total_volume: Number(item.total_volume),
      price_change_percentage_24h: Number(item.price_change_percentage_24h || 0),
    }));
    lastFetchMarkets = now;
    return cachedMarkets;
  } catch (error) {
    console.error("Failed to fetch CoinGecko markets list:", error);
    if (cachedMarkets.length > 0) {
      console.log("Returning stale cached markets list...");
      return cachedMarkets;
    }
    console.log("Returning fallback markets list...");
    return FALLBACK_ASSETS.map((item) => ({
      id: item.id,
      symbol: item.symbol,
      name: item.name,
      current_price: 0,
      total_volume: 0,
      price_change_percentage_24h: 0,
    }));
  }
}

export async function getFearAndGreed(): Promise<{ value: number; classification: string }> {
  const now = Date.now();
  if (cachedFnG && now - lastFetchFnG < CACHE_DURATION) {
    return cachedFnG;
  }

  try {
    console.log("Fetching Fear & Greed index from alternative.me...");
    const response = await fetch("https://api.alternative.me/fng/?limit=1");
    if (!response.ok) {
      throw new Error(`Fear & Greed API failed with status ${response.status}`);
    }
    const data = (await response.json()) as {
      data?: Array<{ value: string; value_classification: string }>;
    };
    const item = data.data?.[0];
    if (item) {
      cachedFnG = {
        value: parseInt(item.value, 10),
        classification: item.value_classification,
      };
      lastFetchFnG = now;
      return cachedFnG;
    }
    throw new Error("Invalid Fear & Greed API response structure");
  } catch (error) {
    console.error("Failed to fetch Fear & Greed Index:", error);
    if (cachedFnG) {
      console.log("Returning stale cached Fear & Greed...");
      return cachedFnG;
    }
    return { value: 50, classification: "Neutral" };
  }
}

/**
 * Fetches real-time price, volume, 24h change from cached CoinGecko markets
 * and Fear & Greed index.
 */
export async function fetchMarketContext(assetName: string): Promise<MarketContext> {
  const ticker = assetName.toUpperCase().trim();
  
  let markets: CoinGeckoMarketData[] = [];
  try {
    markets = await getMarketsList();
  } catch (err) {
    console.warn("fetchMarketContext: failed to get markets list, using fallback metadata mapping", err);
  }
  
  // Find coin in the top 100 markets list
  let coin = markets.find(
    (m) => m.symbol === ticker || m.id.toLowerCase() === ticker.toLowerCase()
  );
  
  if (!coin) {
    const fallback = FALLBACK_ASSETS.find(
      (m) => m.symbol === ticker || m.id.toLowerCase() === ticker.toLowerCase()
    );
    if (!fallback) {
      throw new Error(
        `Ticker "${ticker}" not found in active tradeable assets list. Please search for a top cryptocurrency (e.g. BTC, ETH, SOL).`
      );
    }
    coin = {
      id: fallback.id,
      symbol: fallback.symbol,
      name: fallback.name,
      current_price: 0,
      total_volume: 0,
      price_change_percentage_24h: 0,
    };
  }

  const now = Date.now();
  const cachedVal = priceCache.get(coin.id);
  
  let livePrice = coin.current_price;
  let liveChange = coin.price_change_percentage_24h;
  let volume24h = "";

  if (cachedVal && now - cachedVal.timestamp < PRICE_CACHE_DURATION) {
    console.log(`Using cached price data for ${coin.id}...`);
    livePrice = cachedVal.price;
    liveChange = cachedVal.change24h;
    volume24h = cachedVal.volume24h;
  } else {
    try {
      console.log(`Fetching live price details for ${coin.id} from CoinGecko simple price...`);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error(`CoinGecko simple price API returned status ${response.status}`);
      }
      interface SimplePriceResponse {
        [key: string]: {
          usd: number;
          usd_24h_vol: number;
          usd_24h_change: number;
        };
      }
      const data = (await response.json()) as SimplePriceResponse;
      const details = data[coin.id];
      if (!details || details.usd === undefined) {
        throw new Error(`CoinGecko simple price response is missing data for ${coin.id}`);
      }
      livePrice = details.usd;
      liveChange = details.usd_24h_change;
      
      const rawVol = details.usd_24h_vol;
      if (rawVol >= 1e9) {
        volume24h = `$${(rawVol / 1e9).toFixed(2)}B`;
      } else if (rawVol >= 1e6) {
        volume24h = `$${(rawVol / 1e6).toFixed(2)}M`;
      } else {
        volume24h = `$${rawVol.toLocaleString()}`;
      }

      // Cache it
      priceCache.set(coin.id, {
        price: livePrice,
        change24h: liveChange,
        volume24h,
        timestamp: now,
      });
    } catch (error) {
      console.error(`Failed to fetch live price details for ${coin.id}:`, error);
      if (cachedVal) {
        console.log(`Returning expired cached price data as backup for ${coin.id}...`);
        livePrice = cachedVal.price;
        liveChange = cachedVal.change24h;
        volume24h = cachedVal.volume24h;
      } else if (coin.current_price > 0) {
        console.log(`Returning market-list backup price for ${coin.id}...`);
        livePrice = coin.current_price;
        liveChange = coin.price_change_percentage_24h;
        const rawVol = coin.total_volume;
        if (rawVol >= 1e9) {
          volume24h = `$${(rawVol / 1e9).toFixed(2)}B`;
        } else if (rawVol >= 1e6) {
          volume24h = `$${(rawVol / 1e6).toFixed(2)}M`;
        } else {
          volume24h = `$${rawVol.toLocaleString()}`;
        }
      } else {
        throw new Error(
          `Failed to fetch live market price for "${coin.name}" (${ticker}) due to CoinGecko rate limits. Please wait a few seconds and try again.`
        );
      }
    }
  }

  const fng = await getFearAndGreed();

  return {
    asset: coin.symbol,
    price: livePrice,
    change24h: Number(liveChange.toFixed(2)),
    fearGreedIndex: fng.value,
    volume24h,
    sentiment: "Unavailable (No Free Source)",
    news: ["Recent news feed is unavailable under the free tier API."],
  };
}

