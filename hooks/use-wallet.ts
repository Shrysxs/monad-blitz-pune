"use client";

import { useState, useEffect, useCallback } from "react";

const MONAD_TESTNET_CHAIN_ID = "0x279f"; // 10143 decimal

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
}

function getEthereum(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { ethereum?: EthereumProvider }).ethereum ?? null;
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);

  const isConnected = !!address;
  const isOnMonad = chainId === MONAD_TESTNET_CHAIN_ID;

  // Restore session on mount (if already authorized)
  useEffect(() => {
    const eth = getEthereum();
    if (!eth) return;

    eth
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        const list = accounts as string[];
        if (list.length > 0) setAddress(list[0]);
      })
      .catch(() => {});

    eth
      .request({ method: "eth_chainId" })
      .then((id) => setChainId(id as string))
      .catch(() => {});

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      setAddress(accounts.length > 0 ? accounts[0] : null);
    };

    const handleChainChanged = (...args: unknown[]) => {
      setChainId(args[0] as string);
    };

    eth.on("accountsChanged", handleAccountsChanged);
    eth.on("chainChanged", handleChainChanged);

    return () => {
      eth.removeListener("accountsChanged", handleAccountsChanged);
      eth.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const switchToMonad = useCallback(async (eth: EthereumProvider) => {
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MONAD_TESTNET_CHAIN_ID }],
      });
    } catch (switchErr: unknown) {
      const err = switchErr as { code?: number };
      if (err.code === 4902) {
        // Chain not added yet — add it
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: MONAD_TESTNET_CHAIN_ID,
              chainName: "Monad Testnet",
              nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
              rpcUrls: ["https://testnet-rpc.monad.xyz"],
              blockExplorerUrls: ["https://testnet.monadscan.com"],
            },
          ],
        });
      } else {
        throw switchErr;
      }
    }
  }, []);

  const connect = useCallback(async () => {
    const eth = getEthereum();
    if (!eth) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = (await eth.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        await switchToMonad(eth);
      }
    } catch (err) {
      console.error("Wallet connect failed:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [switchToMonad]);

  const disconnect = useCallback(() => {
    // window.ethereum doesn't have a real disconnect — we just clear local state
    setAddress(null);
  }, []);

  return {
    address,
    isConnected,
    isConnecting,
    isOnMonad,
    chainId,
    connect,
    disconnect,
  };
}
