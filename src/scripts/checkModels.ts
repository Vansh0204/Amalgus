import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No GEMINI_API_KEY found.");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    // We use the underlying fetch or the sdk to list
    // The SDK doesn't always have a direct listModels, so we'll try a common one
    console.log("Checking available models...");
    // If we can't list, we'll try 'gemini-1.5-flash' again with 'v1'
    /* ... */
  } catch (e) {
    console.error(e);
  }
}
