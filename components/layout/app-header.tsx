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
      <div className="h-9 w-36 rounded-lg bg-[#18181B] border border-[rgba(255,255,255,0.08)] animate-pulse" />
    );
  }

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={isConnecting}
        className="flex items-center gap-2 h-9 px-4 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-medium hover:bg-zinc-200 active:scale-[1.01] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Wallet className="h-[18px] w-[18px]" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-9 px-3 rounded-lg bg-[#111113] border border-[rgba(255,255,255,0.08)] text-zinc-300 text-xs font-mono hover:bg-[#18181B] transition-all duration-150"
      >
        {/* Status dot */}
        <span
          className={`h-2 w-2 rounded-full ${isOnMonad ? "bg-emerald-500" : "bg-amber-500"} shrink-0`}
        />
        {truncateAddress(address!)}
        <ChevronDown className={`h-[18px] w-[18px] text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111113] shadow-lg z-50 overflow-hidden">
          {/* Chain badge */}
          <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
              Network
            </span>
            <span
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                isOnMonad ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isOnMonad ? "bg-emerald-500" : "bg-amber-500"}`} />
              {isOnMonad ? "Monad Testnet" : "Wrong Network"}
            </span>
          </div>

          {/* Address */}
          <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-1.5">
              Address
            </p>
            <p className="text-xs font-mono text-zinc-200 break-all">{address}</p>
          </div>

          {/* Actions */}
          <div className="p-2 flex flex-col gap-1">
            <button
              onClick={copyAddress}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-[#18181B] transition-colors text-left"
            >
              <Copy className="h-[18px] w-[18px] text-zinc-500" />
              {copied ? "Copied!" : "Copy Address"}
            </button>
            <a
              href={`https://testnet.monadscan.com/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-[#18181B] transition-colors"
            >
              <ExternalLink className="h-[18px] w-[18px] text-zinc-500" />
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
    <header className="border-b border-[rgba(255,255,255,0.08)] bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-100">
            <Bird className="h-[18px] w-[18px]" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            Penguin Protocol
          </span>
        </Link>

        {/* Center: Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            href="/demo"
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-[#18181b] rounded-lg transition-colors"
          >
            Demo
          </Link>
          <Link
            href="/marketplace"
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-[#18181b] rounded-lg transition-colors"
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
