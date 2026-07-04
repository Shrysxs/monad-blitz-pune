"use client";

import { motion } from "framer-motion";
import { Users, Layers, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SYNDICATES } from "@/constants/syndicates";
import type { Syndicate } from "@/types";

interface SyndicateSelectorProps {
  onSelect: (syndicate: Syndicate) => void;
}

const getIcon = (id: string) => {
  switch (id) {
    case "monad-alpha":
      return <Users className="h-[18px] w-[18px] text-zinc-400" />;
    case "crypto-growth":
      return <TrendingUp className="h-[18px] w-[18px] text-zinc-400" />;
    case "macro-vision":
      return <Layers className="h-[18px] w-[18px] text-zinc-400" />;
    default:
      return <Users className="h-[18px] w-[18px] text-zinc-400" />;
  }
};

export function SyndicateSelector({ onSelect }: SyndicateSelectorProps) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
          Choose Your Syndicate
        </h2>
        <p className="text-zinc-400 max-w-md mx-auto text-sm">
          Select a committee of specialized AI agents with distinct investing philosophies to deliberate on your portfolio.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {SYNDICATES.map((syndicate, index) => (
          <motion.div
            key={syndicate.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="cursor-pointer"
            onClick={() => onSelect(syndicate)}
          >
            <Card className="h-full border border-[rgba(255,255,255,0.08)] bg-[#111113] hover:border-zinc-700/60 transition-colors duration-200 rounded-xl">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800/40 border border-[rgba(255,255,255,0.08)]">
                  {getIcon(syndicate.id)}
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-zinc-100">{syndicate.name}</CardTitle>
                  <CardDescription className="text-xs text-zinc-500 font-mono mt-0.5">{syndicate.focus}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  {syndicate.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
