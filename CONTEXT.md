# Penguin Protocol

**Version:** MVP (Monad Blitz Pune)
**Project Type:** Hackathon MVP with production-grade architecture
**Team:** Penguin

---

## What it does

Penguin Protocol is a decentralized AI Investment Syndicate. Instead of asking a single AI model for investment advice, users pick a syndicate of five specialized AI agents, each with a distinct investing philosophy. The agents independently analyze an asset, debate, and vote. A consensus engine combines the votes into one transparent recommendation (BUY / SELL / HOLD), and the final decision is permanently recorded on Monad.

**The goal is not autonomous trading — it's transparent, explainable, autonomous decision-making.**

One-line pitch for judges:
> "We built an AI investment syndicate where multiple autonomous agents debate investment opportunities, vote independently, and permanently record their collective decision on Monad."

Everything in the product should reinforce this one story. If a feature doesn't support it, don't build it.

---

## Problem

Today's AI investment tools are a single black box: `User → ChatGPT → BUY/SELL`. That means no transparency, no disagreement, no accountability, no specialization, no reputation. Real investment firms don't work this way — they have specialized roles (PMs, macro analysts, risk analysts, quants, fundamental analysts) who debate before deciding. Penguin Protocol recreates that process with AI agents.

---

## MVP Scope

**In scope:** landing → syndicate selection → analysis → debate → consensus → on-chain recording.

**Explicitly out of scope for MVP** (do not build unless asked):
Authentication, portfolio, trading, wallet management, notifications, database, user profiles, settings, history, charts dashboard, admin panel.

This is intentional — the MVP optimizes for one perfect interaction, not feature breadth.

---

## User Journey

Landing Page → Launch Demo → Choose Syndicate → Choose Asset → Generate Market Context → AI Debate Begins → Each Agent Thinks → Each Agent Votes → Consensus Engine → Recommendation → Decision Recorded on Monad → Transaction Success

### Demo script (for judges)
1. Judge opens the app — landing page explains "AI Investment Syndicates."
2. Judge clicks **Launch Demo**, sees three syndicates, selects **Monad Alpha**.
3. Judge searches **BTC**, clicks **Analyze**.
4. No loading spinner — agent cards appear and start "thinking" one by one, streaming reasoning live.
5. Agents disagree/agree, votes and confidence scores animate in.
6. Consensus engine resolves to a recommendation, e.g. **BUY, 84% confidence**.
7. Decision is recorded on Monad — transaction succeeds, decision is immutable, agent reputation updates.

---

## Syndicates (exactly 3 for MVP)

| Syndicate | Focus |
|---|---|
| Monad Alpha | General investment syndicate |
| Crypto Growth | Higher risk tolerance |
| Macro Vision | Macro-focused |

Syndicate creation by users is a future feature — not in MVP.

---

## Agents (exactly 5 — do not add more)

Every agent receives identical shared market context, plus its own unique system prompt. Prompts must never overlap in reasoning style.

| Agent | Focus | Must always... |
|---|---|---|
| **Value Hunter** | Fundamentals, long-term value, cash flow, moat, low speculation | reject hype |
| **Momentum Trader** | Trend, breakouts, volume, market strength, short-term momentum | prioritize trends |
| **Macro Analyst** | Interest rates, liquidity, global economy, risk appetite, institutional flows | think globally |
| **On-chain Sleuth** | Wallet activity, whale movements, exchange inflows, TVL, token distribution (mock data for MVP; real on-chain metrics later) | think blockchain-first |
| **Risk Guardian** | Downside, volatility, tail risk, portfolio exposure, capital preservation | challenge every case, stay cautious |

Each agent's response must return: **Decision, Confidence, Reasoning, Bull Case, Bear Case, Time Horizon.**

---

## Debate Flow

1. All agents receive identical market context (e.g. BTC price $118,000, 24h +2%, Fear & Greed 71, volume, bullish news, positive sentiment).
2. Each agent reasons independently — no agent sees another's answer.
3. Each returns its structured response (decision/confidence/reasoning/bull/bear/horizon).

## Consensus Engine

- **Input:** 5 agent responses.
- **Output:** BUY / SELL / HOLD.
- **MVP version:** simple weighted voting.
- **Future:** dynamic weighting based on historical reputation/performance.

---

## Monad's Role

Monad is **not** used for trading — it's used for trust. Every important decision becomes immutable on-chain. Recorded fields: asset, timestamp, votes, confidence, recommendation, syndicate, transaction hash. This is what proves transparency to the user/judge.

**Smart contract: minimal, single contract, one function.**
```
recordDecision(asset, decision, confidence, timestamp) → emits Event
```
Nothing more for MVP.

---

## AI

AI reasoning must be **real**, not faked/mocked. Use free-tier models, in this preferred order:
1. Gemini Flash
2. Groq
3. OpenRouter

---

## Technical Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Lucide icons
- **Backend:** Next.js API routes only — no database, no auth, no microservices, no queues, no Redis, no Prisma, no Postgres. Everything backend-side can be mocked except the AI calls and the on-chain write.
- **Blockchain:** Monad, viem

## Folder Structure

```
app/
components/
features/
lib/
hooks/
constants/
types/
public/
```
- Business logic → `features/`
- Shared/reusable UI → `components/`
- Never mix UI and business logic in the same file.

---

## Design Language

- Dark mode only. Background almost black, cards dark gray, accent purple.
- BUY = green, SELL = red.
- Typography: Geist. Spacing: 8-point grid. Border radius: 16px. Shadows: minimal.
- Animations: Framer Motion, ~200ms, smooth — never playful or flashy.
- Visual inspiration: Apple, Linear, Perplexity, Bloomberg.

### UX philosophy
The app should feel alive, not like it's loading:
- No spinners — agent cards animate into a "thinking" state with typing animations.
- Votes appear sequentially, confidence bars animate in.
- Consensus card expands once resolved.
- Transaction confirmation appears clearly at the end.
- It should feel like watching a real investment committee deliberate in real time.

---

## Coding Philosophy

- Readable over clever. Simple over abstract. Composition over inheritance.
- Never prematurely optimize.
- One responsibility per function, one purpose per component.
- Avoid unnecessary dependencies — don't over-engineer.

## Instructions for AI Coding Agents

You are assisting in building Penguin Protocol. Your responsibilities:
- Maintain clean architecture; keep components modular and reusable.
- Write production-quality React + TypeScript.
- Prefer server components unless client-side interactivity is required.
- Use Tailwind consistently; use shadcn/ui where it helps, but don't force it if a simpler custom component is cleaner.
- Do not build anything outside MVP scope unless explicitly asked.
- Preserve the product philosophy at every step: transparency, explainability, debate, consensus.
- Every piece of work should strengthen the core demo: five specialized agents independently analyze → debate through their outputs → reach consensus → record the decision on Monad.