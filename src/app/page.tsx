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
                  <div key={product.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all">
                    <div className="flex flex-col md:flex-row justify-between gap-6 uppercase">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-black text-slate-800">{product.name}</h3>
                          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded">{product.category}</span>
                        </div>
                        <p className="text-sm text-slate-500 italic">Supplier: {product.supplier.name}</p>
                        <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-blue-500">
                          <p className="text-sm leading-relaxed text-slate-600 italic">
                            {product.matchReason}
                          </p>
                        </div>
                      </div>

                      <div className="md:w-64 space-y-4 md:border-l md:pl-6 border-slate-100 flex flex-col justify-center">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-xs font-bold text-slate-400 uppercase">Match Score</span>
                          <span className="text-2xl font-black text-blue-600">{product.matchScore}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-1000" 
                            style={{ width: `${product.matchScore}%` }}
                          ></div>
                        </div>
                        <div className="pt-2">
                          <p className="text-xl font-black text-slate-800">₹{product.pricePerSqm || "Custom"}/sqm</p>
                        </div>
                      </div>
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
