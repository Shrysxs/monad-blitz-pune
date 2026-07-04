"use client";

import { useState } from "react";
import { ArrowLeft, Play, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Syndicate } from "@/types";


interface AssetSelectorProps {
  syndicate: Syndicate;
  onBack: () => void;
  onStart: (asset: string) => void;
}

export function AssetSelector({ syndicate, onBack, onStart }: AssetSelectorProps) {
  const [ticker, setTicker] = useState("");
  const quickTickers = ["BTC", "ETH", "MON"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onStart(ticker.trim().toUpperCase());
    }
  };

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
          Provide a cryptocurrency ticker. The syndicate will formulate a real-time market context, independently debate, and reach a consensus recommendation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="ticker" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Enter Token Ticker
          </label>
          <div className="flex gap-3">
            <Input
              id="ticker"
              placeholder="e.g. BTC, ETH, SOL, MON"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="bg-zinc-950/60 border-zinc-800 text-zinc-100 focus-visible:ring-purple-600 h-12 text-lg rounded-xl"
              required
            />
            <Button type="submit" disabled={!ticker.trim()} className="h-12 px-6 rounded-xl font-medium">
              Start Debate
              <Play className="ml-2 h-4 w-4 fill-current" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Quick Select
          </span>
          <div className="flex gap-2">
            {quickTickers.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="px-4 py-2 text-sm bg-zinc-950/40 border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-900/40 cursor-pointer rounded-xl text-zinc-300 hover:text-zinc-100 transition-all duration-200"
                onClick={() => onStart(t)}
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
