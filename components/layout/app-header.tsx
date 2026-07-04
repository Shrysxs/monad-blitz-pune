"use client";

import Link from "next/link";
import { Bird, Wallet, Copy, ChevronDown, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useMounted } from "@/hooks/use-mounted";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function WalletButton() {
  const { address, isConnected, isConnecting, isOnMonad, connect } = useWallet();
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  // SSR guard — render skeleton until mounted
  if (!mounted) {
    return (
      <div className="h-9 w-36 rounded-xl bg-zinc-900/60 border border-zinc-800/60 animate-pulse" />
    );
  }

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={isConnecting}
        className="flex items-center gap-2 h-9 px-4 rounded-xl bg-purple-600/15 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-600/25 hover:border-purple-400/50 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Wallet className="h-3.5 w-3.5" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-9 px-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-xs font-mono hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-150"
      >
        {/* Status dot */}
        <span
          className={`h-2 w-2 rounded-full ${isOnMonad ? "bg-emerald-400" : "bg-amber-400"} shrink-0`}
        />
        {truncateAddress(address!)}
        <ChevronDown className={`h-3 w-3 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-[14px] border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 z-50 overflow-hidden">
          {/* Chain badge */}
          <div className="px-4 py-3 border-b border-zinc-900 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
              Network
            </span>
            <span
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                isOnMonad ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isOnMonad ? "bg-emerald-400" : "bg-amber-400"}`} />
              {isOnMonad ? "Monad Testnet" : "Wrong Network"}
            </span>
          </div>

          {/* Address */}
          <div className="px-4 py-3 border-b border-zinc-900">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-1.5">
              Address
            </p>
            <p className="text-xs font-mono text-zinc-200 break-all">{address}</p>
          </div>

          {/* Actions */}
          <div className="p-2 flex flex-col gap-1">
            <button
              onClick={copyAddress}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-900 transition-colors text-left"
            >
              <Copy className="h-3.5 w-3.5 text-zinc-500" />
              {copied ? "Copied!" : "Copy Address"}
            </button>
            <a
              href={`https://testnet.monadscan.com/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-900 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
              View on Monadscan
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export function AppHeader() {
  return (
    <header className="border-b border-zinc-800/80 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
            <Bird className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            Penguin Protocol
          </span>
        </Link>

        {/* Center: Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            href="/demo"
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
          >
            Demo
          </Link>
          <Link
            href="/marketplace"
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
          >
            Marketplace
          </Link>
        </nav>

        {/* Right: Wallet */}
        <WalletButton />
      </div>
    </header>
  );
}
