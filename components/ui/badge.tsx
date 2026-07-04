import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-[rgba(255,255,255,0.08)] bg-[#18181B] text-zinc-300",
        buy: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
        sell: "border-red-500/20 bg-red-500/10 text-red-500",
        hold: "border-amber-500/20 bg-amber-500/10 text-amber-500",
        secondary: "border-[rgba(255,255,255,0.08)] bg-[#111113] text-zinc-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
