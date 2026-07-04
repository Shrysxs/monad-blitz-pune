export const ANIMATION_DURATION = 0.2;

export const DECISION_COLORS = {
  BUY: "text-emerald-400",
  SELL: "text-red-400",
  HOLD: "text-amber-400",
} as const;

export const DECISION_BG = {
  BUY: "bg-emerald-500/10 border-emerald-500/30",
  SELL: "bg-red-500/10 border-red-500/30",
  HOLD: "bg-amber-500/10 border-amber-500/30",
} as const;

export const DECISION_STYLES = {
  BUY: {
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    barColor: "bg-emerald-500",
    label: "BUY ACCORD",
    variant: "buy" as const,
  },
  SELL: {
    text: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    barColor: "bg-red-500",
    label: "SELL ACCORD",
    variant: "sell" as const,
  },
  HOLD: {
    text: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    barColor: "bg-amber-500",
    label: "HOLD ACCORD",
    variant: "hold" as const,
  },
} as const;

