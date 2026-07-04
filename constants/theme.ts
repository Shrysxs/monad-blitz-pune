export const ANIMATION_DURATION = 0.2;

export const DECISION_COLORS = {
  BUY: "text-emerald-500",
  SELL: "text-red-500",
  HOLD: "text-amber-500",
} as const;

export const DECISION_BG = {
  BUY: "bg-emerald-500/10 border-emerald-500/20",
  SELL: "bg-red-500/10 border-red-500/20",
  HOLD: "bg-amber-500/10 border-amber-500/20",
} as const;

export const DECISION_STYLES = {
  BUY: {
    text: "text-emerald-500",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
    barColor: "bg-emerald-500",
    label: "BUY ACCORD",
    variant: "buy" as const,
  },
  SELL: {
    text: "text-red-500",
    border: "border-red-500/20",
    bg: "bg-red-500/10",
    barColor: "bg-red-500",
    label: "SELL ACCORD",
    variant: "sell" as const,
  },
  HOLD: {
    text: "text-amber-500",
    border: "border-amber-500/20",
    bg: "bg-amber-500/10",
    barColor: "bg-amber-500",
    label: "HOLD ACCORD",
    variant: "hold" as const,
  },
} as const;

