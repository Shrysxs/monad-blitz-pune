"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Play, Cpu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Syndicate } from "@/types";

interface AssetSelectorProps {
  syndicate: Syndicate;
  onBack: () => void;
  onStart: (asset: string) => void;
}

interface AssetInfo {
  id: string;
  symbol: string;
  name: string;
}

export function AssetSelector({ syndicate, onBack, onStart }: AssetSelectorProps) {
  const [ticker, setTicker] = useState("");
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  // Fetch real assets from backend on mount
  useEffect(() => {
    fetch("/api/assets")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.assets)) {
          setAssets(data.assets);
          if (data.isFallback) {
            setIsFallback(true);
          }
        } else {
          console.warn("Assets API did not return success, using local fallback");
          setIsFallback(true);
          setAssets([
            { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
            { id: "ethereum", symbol: "ETH", name: "Ethereum" },
            { id: "tether", symbol: "USDT", name: "Tether" },
            { id: "binancecoin", symbol: "BNB", name: "BNB" },
            { id: "solana", symbol: "SOL", name: "Solana" },
            { id: "ripple", symbol: "XRP", name: "Ripple" },
            { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
            { id: "cardano", symbol: "ADA", name: "Cardano" },
            { id: "shiba-inu", symbol: "SHIB", name: "Shiba Inu" },
            { id: "polkadot", symbol: "DOT", name: "Polkadot" },
            { id: "chainlink", symbol: "LINK", name: "Chainlink" },
            { id: "uniswap", symbol: "UNI", name: "Uniswap" },
            { id: "sui", symbol: "SUI", name: "Sui" }
          ]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load assets, using local fallback:", err);
        setIsFallback(true);
        setAssets([
          { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
          { id: "ethereum", symbol: "ETH", name: "Ethereum" },
          { id: "tether", symbol: "USDT", name: "Tether" },
          { id: "binancecoin", symbol: "BNB", name: "BNB" },
          { id: "solana", symbol: "SOL", name: "Solana" },
          { id: "ripple", symbol: "XRP", name: "Ripple" },
          { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
          { id: "cardano", symbol: "ADA", name: "Cardano" },
          { id: "shiba-inu", symbol: "SHIB", name: "Shiba Inu" },
          { id: "polkadot", symbol: "DOT", name: "Polkadot" },
          { id: "chainlink", symbol: "LINK", name: "Chainlink" },
          { id: "uniswap", symbol: "UNI", name: "Uniswap" },
          { id: "sui", symbol: "SUI", name: "Sui" }
        ]);
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTicker = ticker.trim().toUpperCase();
    if (cleanTicker) {
      // Confirm asset exists in live list before proceeding
      const exists = assets.some((a) => a.symbol === cleanTicker || a.id.toLowerCase() === cleanTicker.toLowerCase());
      if (exists) {
        onStart(cleanTicker);
      } else {
        alert(`Ticker "${cleanTicker}" not found in active assets list. Please choose a coin from the list.`);
      }
    }
  };

  // Filter list matching search input
  const filteredAssets = ticker.trim()
    ? assets
        .filter(
          (a) =>
            a.symbol.toLowerCase().includes(ticker.toLowerCase()) ||
            a.name.toLowerCase().includes(ticker.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const quickSymbols = ["BTC", "ETH", "SOL", "BNB"];

  return (
    <div className="flex flex-col gap-8 w-full max-w-xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm w-fit transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Syndicates
      </button>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-purple-400">
          <Cpu className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Syndicate active</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
          Analyze Asset with {syndicate.name}
        </h2>
        <p className="text-zinc-400 text-sm">
          Select or search for a real-time cryptocurrency. The syndicate will formulate market indices, independently debate, and record their consensus on Monad.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="ticker" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Enter Token Ticker or Name
          </label>
          <div className="flex gap-3 relative">
            <div className="relative flex-1">
              <Input
                id="ticker"
                placeholder={isLoading ? "Loading assets..." : "e.g. BTC, ETH, SOL, BNB"}
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // delay blur to allow suggestion clicks
                disabled={isLoading}
                autoComplete="off"
                className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus-visible:ring-purple-600 h-12 text-lg rounded-xl w-full"
                required
              />
              
              {/* Autocomplete Suggestions dropdown */}
              {isFocused && filteredAssets.length > 0 && (
                <div className="absolute z-10 w-full mt-1.5 bg-zinc-950 border border-zinc-850 rounded-xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto">
                  {filteredAssets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        setTicker(asset.symbol);
                        onStart(asset.symbol);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-purple-950/20 hover:text-zinc-100 transition-colors flex justify-between items-center border-b border-zinc-900 last:border-0"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-200">{asset.name}</span>
                        <span className="text-[10px] text-zinc-500 uppercase">{asset.id}</span>
                      </div>
                      <Badge variant="secondary" className="bg-zinc-900 border-zinc-800 text-zinc-400 text-xs">
                        {asset.symbol}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !ticker.trim()}
              className="h-12 px-6 rounded-xl font-medium"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Start Debate
                  <Play className="ml-2 h-4 w-4 fill-current" />
                </>
              )}
            </Button>
          </div>
          {isFallback && (
            <p className="text-xs text-amber-500/80 mt-1 flex items-center gap-1.5 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              CoinGecko API rate-limited or offline. Active tradeable assets list running on real offline fallback.
            </p>
          )}
        </div>


        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Quick Select
          </span>
          <div className="flex gap-2">
            {isLoading ? (
              <span className="text-xs text-zinc-600 font-mono">Loading active list...</span>
            ) : (
              quickSymbols.map((sym) => {
                const coin = assets.find((a) => a.symbol === sym);
                if (!coin) return null;
                return (
                  <Badge
                    key={sym}
                    variant="secondary"
                    className="px-4 py-2 text-sm bg-zinc-950/40 border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-900/40 cursor-pointer rounded-xl text-zinc-300 hover:text-zinc-100 transition-all duration-200"
                    onClick={() => onStart(sym)}
                  >
                    {sym}
                  </Badge>
                );
              })
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
