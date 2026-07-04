import Link from "next/link";
import { Bird } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-zinc-800/80 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
            <Bird className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            Penguin Protocol
          </span>
        </Link>
      </div>
    </header>
  );
}
