import { GoogleGenerativeAI } from "@google/generative-ai";
import { MATCHING_SYSTEM_PROMPT, getMatchingUserMessage } from "./matchingPrompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function matchProducts(buyerQuery: string, products: any[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  // 1. OPTIMIZATION: HEURISTIC PRE-FILTERING
  // Reduce 60 products down to 15 candidates to speed up LLM processing
  const queryLower = buyerQuery.toLowerCase();
  const candidates = products
    .map(p => {
      let candidateScore = 0;
      const searchableText = `${p.name} ${p.category} ${p.tags.join(' ')} ${p.description}`.toLowerCase();
      
      // Keyword matching
      const keywords = queryLower.split(' ').filter(word => word.length > 2);
      keywords.forEach(word => {
        if (searchableText.includes(word)) candidateScore += 10;
      });

      // Special handling for thickness
      const thicknessMatch = queryLower.match(/\d+mm/);
      if (thicknessMatch && p.specs.thickness.includes(thicknessMatch[0])) candidateScore += 50;

      return { product: p, candidateScore };
    })
    .sort((a, b) => b.candidateScore - a.candidateScore)
    .slice(0, 30) // Increased for better variety
    .map(c => c.product);

  // 2. OPTIMIZATION: PARALLEL RACING
  const primaryModels = ["gemini-3.1-flash-lite", "gemini-1.5-flash-8b", "gemini-3-flash"];
  
  try {
    const result = await Promise.any(
      primaryModels.map(async (modelName) => {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" },
        });
        const prompt = `${MATCHING_SYSTEM_PROMPT}\n\n${getMatchingUserMessage(buyerQuery, candidates)}`;
        const res = await model.generateContent(prompt);
        return JSON.parse(res.response.text());
      })
    );
    return result;
  } catch (error: any) {
    console.warn("Parallel AI matching failed, using Local Fallback.");
    return localFallback(buyerQuery, products);
  }
}

function localFallback(buyerQuery: string, products: any[]) {
  const queryLower = buyerQuery.toLowerCase();
  
  // Extract requested thickness if present (e.g., "6mm")
  const requestedThickness = queryLower.match(/(\d+)mm/)?.[0];

  const topMatches = products
    .map(p => {
      let score = 15; // Lower base score
      const matched = [];
      const pThickness = p.specs.thickness.toLowerCase();

      // HEAVY PRIORITY: Thickness Match
      if (requestedThickness) {
        if (pThickness.includes(requestedThickness)) {
          score += 60; // Huge boost for 6mm if 6mm requested
          matched.push(requestedThickness);
        } else if (/\d+mm/.test(pThickness)) {
          score -= 40; // Penalty for wrong thickness
        }
      }

      // HEAVY PRIORITY: Category Match
      const categoryKeywords = ["float", "tempered", "toughened", "laminated", "mirror", "igu", "dgu", "hardware", "fitting", "hinge"];
      categoryKeywords.forEach(cat => {
        if (queryLower.includes(cat) && (p.category.toLowerCase().includes(cat) || p.name.toLowerCase().includes(cat))) {
          score += 40; // Massive boost for matching the requested glass type
          matched.push(cat);
        }
      });

      // Keyword matching
      p.tags.forEach((t: string) => {
        if (queryLower.includes(t.toLowerCase()) && !matched.includes(t.toLowerCase())) {
          score += 15;
          matched.push(t);
        }
      });

      return { 
        productId: p.id, 
        score: Math.max(0, Math.min(score, 98)), 
        matchReason: matched.length > 0 
          ? `[Local Logic] High relevance for ${matched.join(', ')}.`
          : `[Local Logic] Fallback match for glass products.`,
        matchedAttributes: matched
      };
    })
    .sort((a, b) => b.score - a.score)
    .filter(m => m.score > 20) // Filter out low quality results
    .slice(0, 12);

  return { 
    matches: topMatches, 
    intentAnalysis: { detectedType: "Smart Search", primaryNeed: "Quick Match", safetyRequirement: "standard", suggestedThickness: "6" } 
  };
}
