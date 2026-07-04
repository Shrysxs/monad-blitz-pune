# Penguin Protocol

> **An AI Investment Syndicate where five specialized agents independently debate, vote, and permanently seal their consensus on Monad.**

[![Monad Testnet](https://img.shields.io/badge/Monad-Testnet-purple)](https://testnet.monadscan.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## What It Does

Instead of asking a single AI for investment advice, Penguin Protocol assembles a **syndicate of five specialized AI agents**, each with a distinct investment philosophy:

| Agent | Philosophy |
|-------|-----------|
| **Value Hunter** | Fundamentals, moat, long-term intrinsic value — rejects hype |
| **Momentum Trader** | Price action, trend, breakouts, volume — follows the trend |
| **Macro Analyst** | Interest rates, liquidity, institutional flows — thinks globally |
| **On-chain Sleuth** | Whale activity, exchange flows, TVL, token distribution |
| **Risk Guardian** | Downside risk, volatility, capital preservation — stays cautious |

Each agent receives **live, real-time market data** (price, 24h change, volume, Fear & Greed index), reasons independently, and casts a weighted vote. A consensus engine resolves the debate into a **BUY / SELL / HOLD** recommendation — then seals it immutably on **Monad**.

---

## Demo Flow

```
Landing → Choose Syndicate → Search Asset → Analyze
    → Agents Think (live streaming) → Agents Vote
    → Consensus Engine → Record on Monad → ✓ Sealed
```

---

## Architecture

```
penguin-protocol/
├── app/                        # Next.js 15 App Router (frontend + API)
│   ├── api/
│   │   ├── analyze/route.ts    # Fetches live market data → runs 5 LLM agents in parallel
│   │   ├── assets/route.ts     # Returns live top-100 assets from CoinGecko
│   │   └── record/route.ts     # Writes decision on-chain via backend wallet
│   ├── demo/page.tsx           # Main app demo flow
│   └── page.tsx                # Landing page
├── components/
│   ├── layout/                 # AppHeader, PageShell
│   └── ui/                     # shadcn/ui primitives (Badge, Button, Card, etc.)
├── constants/
│   ├── agents.ts               # Agent definitions
│   ├── contract.ts             # Deployed contract address + ABI
│   ├── syndicates.ts           # Syndicate definitions
│   └── theme.ts                # Decision color tokens
├── contracts/                  # Foundry smart contract project
│   ├── src/PenguinRegistry.sol # On-chain decision registry
│   ├── test/                   # Forge tests
│   └── script/Deploy.s.sol     # Monad Testnet deploy script
├── features/
│   └── debate/                 # Core debate feature
│       ├── components/         # UI: AssetSelector, DebateArena, ConsensusPanel, SuccessModal
│       └── use-debate.ts       # State machine for the full debate flow
├── lib/
│   ├── ai/agents.ts            # LLM system prompts + Gemini/Groq/OpenRouter client
│   ├── chain.ts                # viem Monad chain config
│   ├── consensus.ts            # Weighted vote calculator
│   ├── market-data.ts          # Live CoinGecko + Fear & Greed fetching with 30s cache
│   └── utils.ts                # cn() utility
├── hooks/use-mounted.ts
└── types/index.ts              # Shared TypeScript types
```

---

## Data Sources

| Data | Source | Cached |
|------|--------|--------|
| Asset list (top 100) | CoinGecko `/coins/markets` | 60 s in-memory |
| Live price, volume, 24h change | CoinGecko `/simple/price` | 30 s per-token |
| Fear & Greed Index | alternative.me | 60 s in-memory |
| News / Sentiment | ❌ No free source | Labeled "Unavailable" |
| On-chain metrics | Mock (CONTEXT.md approved) | — |

---

## Local Setup

### Prerequisites

- Node.js 18+
- A free API key from at least one of: [Gemini](https://aistudio.google.com), [Groq](https://console.groq.com), [OpenRouter](https://openrouter.ai)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/penguin-protocol.git
cd penguin-protocol
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in your keys in `.env.local`:

```env
GEMINI_API_KEY=...
GROQ_API_KEY=...
OPENROUTER_API_KEY=...
MONAD_PRIVATE_KEY=0x...    # Backend wallet for on-chain recording
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

### Web App (Vercel)

```bash
npm run build        # verify build passes
vercel --prod        # deploy
```

Set all env vars from `.env.example` in your Vercel project settings.

### Smart Contract

See [`contracts/README.md`](./contracts/README.md) for full Foundry setup and Monad Testnet deploy instructions.

**Deployed contract:** `0x60Be62dD9B3ED768dbAAc54374b03Ea2F3C52D76` on Monad Testnet  
[View on Monadscan →](https://testnet.monadscan.com/address/0x60Be62dD9B3ED768dbAAc54374b03Ea2F3C52D76)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion |
| UI Components | shadcn/ui, Lucide React |
| AI | Gemini 1.5 Flash (primary) → Groq Llama-3.3-70b → OpenRouter Gemini 2.5 Flash |
| Blockchain | Monad Testnet, viem |
| Smart Contract | Solidity 0.8.20, Foundry |
| Market Data | CoinGecko (free tier), alternative.me Fear & Greed |

---

## Built at Monad Blitz Pune · Team Penguin
