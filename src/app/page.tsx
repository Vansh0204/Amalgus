"use client";

import { useState } from "react";

export default function DiscoveryPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [intent, setIntent] = useState<any>(null);
  
  // Filters State
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minThickness, setMinThickness] = useState(0);
  const [maxThickness, setMaxThickness] = useState(30);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const categories = [
    "Float Glass",
    "Tempered Glass",
    "Laminated Safety Glass",
    "Insulated Glass Units (IGU)",
    "Mirrors",
    "Aluminium Hardware"
  ];

  const exampleQueries = [
    "Safe glass for a 5th floor balcony railing",
    "Soundproof partitions for a busy office",
    "Energy efficient windows for a south facing facade",
    "High-end mirrors for a luxury bathroom vanity",
    "Premium aluminium patch fittings for glass doors"
  ];

  const handleSearch = async () => {
    // Allow searching if there is a query OR a category selected
    if (!query.trim() && !category) return;
    setLoading(true);
    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          filters: {
            category: category || undefined,
            maxPrice,
            minThickness: minThickness > 0 ? minThickness : undefined,
            maxThickness: maxThickness < 30 ? maxThickness : undefined,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorStatus(data.error || "Something went wrong. Please check your API key.");
        setResults([]);
      } else {
        setResults(data.results || []);
        setIntent(data.intent || null);
        setErrorStatus(null);
      }
    } catch (error: any) {
      console.error("Search failed:", error);
      setErrorStatus("Connection failed. Are you online?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-gradient-to-r from-slate-900 to-blue-900 py-12 px-6 text-white text-center">
        <h1 className="text-5xl font-black tracking-tight mb-4">AmalGus</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
          India's Intelligent B2B Marketplace for Glass & Allied Products.
          Experience precision matching for your architectural needs.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <aside className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-6">
            <h2 className="text-lg font-bold border-b pb-4 text-slate-800">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-600 uppercase tracking-wider">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-600 uppercase tracking-wider">Max Price (₹/sqm)</label>
                <input 
                  type="range" 
                  min="500" 
                  max="10000" 
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                  <span>₹500</span>
                  <span className="font-bold text-blue-600">₹{maxPrice}+</span>
                  <span>₹10k</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-600 uppercase tracking-wider">Thickness (mm)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minThickness || ""} 
                    onChange={(e) => setMinThickness(parseInt(e.target.value))}
                    className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxThickness || ""} 
                    onChange={(e) => setMaxThickness(parseInt(e.target.value))}
                    className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-6 space-y-2">
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-slate-900 border border-slate-900 hover:bg-white hover:text-slate-900 text-white font-bold py-2.5 rounded-lg transition-all active:scale-95"
              >
                {loading ? "Applying..." : "Apply Filters"}
              </button>
              <button 
                onClick={() => { setCategory(""); setMaxPrice(10000); setMinThickness(0); setMaxThickness(30); }}
                className="w-full text-xs text-slate-400 hover:text-blue-600 transition-colors py-1 underline"
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
              <label className="block text-xl font-bold mb-4 text-slate-800">
                What do you need?
              </label>
              <textarea 
                className="w-full p-4 h-32 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none resize-none text-lg"
                placeholder="Example: I need safe 8mm glass for office cubicles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2 text-slate-800">
                  {exampleQueries.map((q, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setQuery(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={loading || (!query.trim() && !category)}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg active:scale-95"
                >
                  {loading ? "Discovering..." : "Find Best Matches"}
                </button>
                {errorStatus && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                ⚠️ {errorStatus}
              </div>
            )}
          </div>
            </div>

            {intent && !loading && (
              <div className="flex gap-4 items-center">
                <span className="text-sm font-bold text-slate-500 uppercase">Identified:</span>
                <span className="bg-white border px-3 py-1 rounded-full text-sm font-medium">{intent.detectedType}</span>
                <span className="bg-white border px-3 py-1 rounded-full text-sm font-medium">{intent.primaryNeed}</span>
              </div>
            )}

            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-10 text-slate-400">Loading matches...</div>
              ) : results.length > 0 ? (
                results.map((product: any) => (
                  <div key={product.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-blue-400 transition-all group overflow-hidden relative">
                    {/* Top Section: Title and Price */}
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase leading-tight mb-1">
                          {product.name}
                        </h3>
                        <p className="text-slate-500 font-medium italic underline decoration-slate-200 uppercase tracking-tighter">
                          {product.supplier.name}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="text-3xl font-black text-slate-900 leading-none">
                          ₹{product.pricePerSqm || "Custom"}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">PER SQM</div>
                      </div>
                    </div>

                    {/* Match Score Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Match Score</span>
                        <span className={`text-xl font-black ${product.matchScore > 70 ? 'text-green-500' : 'text-blue-500'}`}>
                          {product.matchScore}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${product.matchScore > 70 ? 'bg-green-500' : 'bg-blue-500'}`} 
                          style={{ width: `${product.matchScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Specifications Section */}
                    <div className="mb-8">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Specifications</div>
                      <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-tight">
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">{product.specs.thickness}</span>
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">{product.category}</span>
                        <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">{product.specs.colorTint}</span>
                        {product.specs.coating !== "None" && (
                          <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 italic">Coated</span>
                        )}
                      </div>
                    </div>

                    {/* Features and Usage */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Best For</div>
                        <p className="text-sm font-bold text-slate-700 uppercase tracking-tight leading-relaxed">
                          {product.tags.filter((t: string) => !["basic", "float", "tempered"].includes(t)).join(", ") || "General Construction"}
                        </p>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Key Feature</div>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Why this fits your requirement</div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {product.matchReason}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-100/50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 text-lg">Results will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 py-10 text-center text-slate-500 text-sm">
        <p>&copy; 2026 AmalGus Glass Marketplace.</p>
      </footer>
    </div>
  );
}
