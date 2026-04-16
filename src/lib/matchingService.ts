import Anthropic from "@anthropic-ai/sdk";
import { MATCHING_SYSTEM_PROMPT, getMatchingUserMessage } from "./matchingPrompt";

// Initialize Anthropic client with the API key from environment variables
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface MatchResult {
  productId: string;
  score: number;
  matchReason: string;
  matchedAttributes: string[];
}

export interface MatchingResponse {
  matches: MatchResult[];
  intentAnalysis: {
    detectedType: string;
    primaryNeed: string;
    safetyRequirement: "low" | "medium" | "high";
    suggestedThickness: string;
  };
}

/**
 * Intelligent product matching function using Anthropic Claude API.
 * 
 * @param buyerQuery natural language query from the buyer
 * @param products list of products from the catalog
 * @returns parsed JSON matching results
 */
export async function matchProducts(
  buyerQuery: string,
  products: any[]
): Promise<MatchingResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not defined in the environment.");
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: MATCHING_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: getMatchingUserMessage(buyerQuery, products),
        },
      ],
    });

    // Extract the raw text from the response
    const block = response.content[0];
    if (block.type !== "text") {
      throw new Error("Unexpected response type from Anthropic API");
    }

    const rawJson = block.text.trim();

    try {
      const results: MatchingResponse = JSON.parse(rawJson);
      return results;
    } catch (parseError) {
      console.error("Failed to parse matching engine JSON:", rawJson);
      throw new Error("Matching engine returned invalid JSON format.");
    }
  } catch (error: any) {
    console.error("Anthropic API Error:", error.message || error);
    
    // Fallback or re-throw based on context
    throw new Error(
      `Failed to match products: ${error.message || "Unknown error"}`
    );
  }
}
