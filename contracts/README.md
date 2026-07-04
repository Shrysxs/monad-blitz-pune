# PenguinRegistry — Smart Contract

> Minimal on-chain registry that permanently records AI syndicate decisions on Monad.

## Contract

**`PenguinRegistry.sol`** — a single-function contract that emits an immutable event every time the Penguin Protocol AI syndicate reaches consensus.

```solidity
function recordDecision(
    string calldata asset,       // e.g. "BTC"
    string calldata decision,    // "BUY" | "SELL" | "HOLD"
    uint256 confidence,          // 1-100
    uint256 timestamp            // Unix epoch
) external;
```

Every call emits `DecisionRecorded(asset, decision, confidence, timestamp, sender)` — permanently verifiable on-chain.

### Deployed Address (Monad Testnet)

```
0x60Be62dD9B3ED768dbAAc54374b03Ea2F3C52D76
```

Explorer: [testnet.monadscan.com](https://testnet.monadscan.com/address/0x60Be62dD9B3ED768dbAAc54374b03Ea2F3C52D76)

---

## Toolchain

Built with [Foundry](https://book.getfoundry.sh/). Install it with:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

---

## Commands

### Build

```bash
cd contracts
forge build
```

### Test

```bash
forge test -vv
```

### Format

```bash
forge fmt
```

### Deploy to Monad Testnet

Set your private key:

```bash
export PRIVATE_KEY=0x...
```

Then run the deploy script:

```bash
forge script script/Deploy.s.sol:Deploy \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -vvvv
```

After deployment, copy the printed address into [`constants/contract.ts`](../constants/contract.ts).

### Verify on Monadscan

```bash
forge verify-contract <DEPLOYED_ADDRESS> src/PenguinRegistry.sol:PenguinRegistry \
  --chain-id 10143 \
  --verifier blockscout \
  --verifier-url https://testnet.monadscan.com/api
```

---

## Network Details

| Property      | Value                              |
|---------------|------------------------------------|
| Network       | Monad Testnet                      |
| Chain ID      | 10143                              |
| RPC URL       | `https://testnet-rpc.monad.xyz`    |
| Block Explorer| `https://testnet.monadscan.com`    |
| Currency      | MON                                |
