import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div
      className={`min-h-full flex flex-col bg-background text-foreground ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
