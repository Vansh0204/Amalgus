# 💎 AmalGus Discovery: AI-Powered Glass Marketplace Matchmaker

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Gemini](https://img.shields.io/badge/Google_Gemini-3.1-4285F4?style=for-the-badge&logo=google-gemini)
![Anthropic](https://img.shields.io/badge/Anthropic_Claude-3.5-D97757?style=for-the-badge&logo=anthropic)

## 🚀 Project Overview
AmalGus Discovery is an intelligent search and matching layer for India's premier glass B2B/B2C marketplace. It transforms vague natural language queries into precise product recommendations by understanding architectural requirements, safety standards (IS 2553), and industry-specific terminology.

**Live Demo:** [Link Placeholder]

---

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI Architecture**: React with Tailwind CSS
- **AI Engines**: 
    - **Primary**: Google Gemini 1.5/3.1 (High-speed Free Tier)
    - **Enterprise**: Anthropic Claude 3.5 Sonnet (Expert Matching Logic)
- **Language**: TypeScript

---

## 🏃 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vansh0204/Amalgus.git
   cd amalgus-discovery
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```text
   # For Gemini (Free Tier)
   GEMINI_API_KEY=your_google_ai_studio_key
   
   # For Claude (Premium Tier)
   ANTHROPIC_API_KEY=your_anthropic_key
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to see the marketplace in action.

---

## 🧠 How the Intelligent Matching Works

AmalGus Discovery uses a **Multi-Stage Matching Pipeline** to ensure both speed and precision:

1.  **Semantic Pre-filtering**: To minimize LLM latency, the system performs a local heuristic scan of the 60+ product catalog, identifying the top 30 candidates based on keyword overlap and attribute matching.
2.  **LLM Reasoning (Claude/Gemini)**: The AI acts as a glass industry expert. It analyzes the buyer's natural language (e.g., "safe glass for a high-rise balcony") and cross-references it with product specs (thickness, toughening, certification).
3.  **Dynamic Scoring**: Products are scored from 0-100 based on fit. The AI generates "Match Reasons" in buyer-friendly language, translating technical specs into functional benefits.
4.  **Parallel Racing**: The system "races" multiple AI models simultaneously (Gemini 3.1 Flash, 1.5 Flash, etc.) to deliver the first successful response, bypassing temporary server spikes.

---

## 🤖 AI Tools Used & Impact
- **Claude 3.5 Sonnet**: Used to architect the domain-specific system prompts and the core matching logic. Its deep understanding of safety standards (like IS 2553) was critical for accurate reasoning.
- **Antigravity (AI Coding Assistant)**: Used for rapid prototyping of the complete project structure, API routes, and high-fidelity Tailwind UI.
- **Gemini 1.5/3.1**: Integrated as a cost-effective production engine to provide high-speed responses within the free tier.

---

## ⚖️ Key Assumptions & Trade-offs
- **Mock Data**: The current version uses a generated JSON catalog of 60 products. In production, this would be replaced by a Live SQL/NoSQL database.
- **No Vector DB (Yet)**: For a catalog of <500 items, LLM-based candidate selection is faster and more cost-effective than managing a dedicated Vector Database like Pinecone.
- **LLM Latency**: AI-based matching takes ~1-3 seconds. We mitigate this with loading skeletons and parallel model fallbacks.

---

## 🔍 Example Queries to Try
- *"I need some safe tempered glass for a double-height window sill."*
- *"Soundproof partitions for a busy office in Mumbai."*
- *"High-end bronze mirrors for a luxury hotel vanity."*
- *"What aluminium fittings do I need for a frameless glass door?"*

---

## 🚀 Future Improvements
- [ ] **Image Search**: Upload a photo of a glass finish to find matches.
- [ ] **Quant Pricing**: Real-time price calculation based on custom dimensions and shipping locations.
- [ ] **Vector Search Integration**: Transition to RAG (Retrieval-Augmented Generation) as the catalog grows beyond 1,000 items.
- [ ] **Supplier Chat**: Direct AI-assisted communication bridge between buyers and glass fabricators.

---
*Created with ❤️ for the Indian Glass Industry.*
