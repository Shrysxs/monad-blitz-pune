import { NextResponse } from "next/server";
import { z } from "zod";
import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { monadTestnet } from "@/lib/chain";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants/contract";

// Input validation schema
const recordSchema = z.object({
  asset: z.string().min(1).max(10),
  decision: z.enum(["BUY", "SELL", "HOLD"]),
  confidence: z.number().int().min(1).max(100),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = recordSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters. Please provide valid asset, decision, and confidence." },
        { status: 400 }
      );
    }

    const { asset, decision, confidence } = result.data;

    const privateKey = process.env.MONAD_PRIVATE_KEY;
    if (!privateKey || !privateKey.startsWith("0x")) {
      return NextResponse.json(
        { success: false, error: "Server error. Monad private key is not configured correctly." },
        { status: 500 }
      );
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`);

    // Create a client with public actions to query/wait for receipts
    const client = createWalletClient({
      account,
      chain: monadTestnet,
      transport: http(),
    }).extend(publicActions);

    console.log(`Sending contract call recordDecision via backend wallet ${account.address} for asset ${asset}...`);

    const hash = await client.writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "recordDecision",
      args: [
        asset,
        decision,
        BigInt(confidence),
        BigInt(Math.floor(Date.now() / 1000)),
      ],
    });

    console.log(`Transaction sent. Tx Hash: ${hash}. Waiting for confirmation...`);

    // Wait for the transaction to be mined/confirmed (typically 1 block)
    const receipt = await client.waitForTransactionReceipt({ hash });
    
    console.log(`Transaction confirmed in block ${receipt.blockNumber}. Status: ${receipt.status}`);

    if (receipt.status !== "success") {
      throw new Error(`Transaction reverted on-chain. Status: ${receipt.status}`);
    }

    return NextResponse.json({
      success: true,
      txHash: hash,
      blockNumber: Number(receipt.blockNumber),
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Failed to record decision on-chain via backend:", error);
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
