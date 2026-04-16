import { NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { matchProducts } from "@/lib/geminiService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, filters } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    // 1. Pre-filtering logic
    let filteredProducts = [...MOCK_PRODUCTS];

    if (filters) {
      // Category Filter (Exact Match)
      if (filters.category) {
        filteredProducts = filteredProducts.filter(
          (p) => p.category.toLowerCase() === filters.category.toLowerCase()
        );
      }

      // Max Price Filter
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(
          (p) => p.pricePerSqm > 0 && p.pricePerSqm <= filters.maxPrice
        );
      }

      // Thickness Filter (Min/Max Range)
      if (filters.minThickness || filters.maxThickness) {
        filteredProducts = filteredProducts.filter((p) => {
          // Simple numeric extraction from strings like "6mm" or "10.38mm"
          const thicknessNum = parseFloat(p.specs.thickness);
          if (isNaN(thicknessNum)) return true; // Include if non-numeric for safety

          if (filters.minThickness && thicknessNum < filters.minThickness)
            return false;
          if (filters.maxThickness && thicknessNum > filters.maxThickness)
            return false;
          return true;
        });
      }
    }

    // 2. Call the Claude Intelligent Matching Engine
    // We pass only the filtered products to Claude to optimize tokens and relevance
    const matchResults = await matchProducts(query, filteredProducts);

    // 3. Merge matching scores/reasons with full product metadata
    const enrichedResults = matchResults.matches
      .map((match) => {
        const product = MOCK_PRODUCTS.find((p) => p.id === match.productId);
        if (!product) return null;

        return {
          ...product,
          matchScore: match.score,
          matchReason: match.matchReason,
          matchedAttributes: match.matchedAttributes,
        };
      })
      .filter(Boolean);

    return NextResponse.json(
      {
        results: enrichedResults,
        intent: matchResults.intentAnalysis,
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    console.error("[API_MATCH_ERROR]:", error);
    
    const isMissingKey = error.message?.includes("GEMINI_API_KEY");
    const status = isMissingKey ? 501 : 500;
    const message = isMissingKey 
      ? "Gemini API Key is missing. Please add GEMINI_API_KEY to your .env.local file. You can get a free key at aistudio.google.com"
      : (error.message || "Failed to process matching request");

    return NextResponse.json(
      { error: message },
      { status, headers: corsHeaders() }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

/**
 * Common CORS headers for development
 */
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
