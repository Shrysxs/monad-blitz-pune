import { NextResponse } from "next/server";
import { getMarketsList, isMarketsListFallback } from "@/lib/market-data";

export async function GET() {
  try {
    const list = await getMarketsList();
    const assets = list.map((item) => ({
      id: item.id,
      symbol: item.symbol,
      name: item.name,
    }));
    
    // Set headers for caching in frontend browser as well
    const response = NextResponse.json({ 
      success: true, 
      assets,
      isFallback: isMarketsListFallback()
    });
    response.headers.set("Cache-Control", "public, max-age=60, s-maxage=60");
    return response;
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to load active tradeable assets list.";
    console.error("GET /api/assets failed:", error);
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

