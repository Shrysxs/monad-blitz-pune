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
      return <Users className="h-5 w-5 text-purple-400" />;
    case "crypto-growth":
      return <TrendingUp className="h-5 w-5 text-emerald-400" />;
    case "macro-vision":
      return <Layers className="h-5 w-5 text-cyan-400" />;
    default:
      return <Users className="h-5 w-5 text-purple-400" />;
  }
};

export function SyndicateSelector({ onSelect }: SyndicateSelectorProps) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
          Choose Your Syndicate
        </h2>
        <p className="text-zinc-400 max-w-md mx-auto">
          Select a committee of specialized AI agents with distinct investing philosophies to deliberate on your portfolio.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {SYNDICATES.map((syndicate, index) => (
          <motion.div
            key={syndicate.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => onSelect(syndicate)}
          >
            <Card className="h-full border border-zinc-800 bg-zinc-950/40 hover:border-purple-500/50 hover:bg-zinc-900/30 transition-all duration-300 rounded-[16px]">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800">
                  {getIcon(syndicate.id)}
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-100">{syndicate.name}</CardTitle>
                  <CardDescription className="text-xs text-purple-400 font-medium">{syndicate.focus}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 leading-relaxed">
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
