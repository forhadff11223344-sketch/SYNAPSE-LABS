/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, ShieldCheck, Zap, MessageSquare, ArrowUpDown } from 'lucide-react';
import { CategoryType, Product } from '../types';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  products: Product[];
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  products
}: HeroProps) {

  const getCount = (cat: CategoryType) => {
    if (cat === 'all') return products.length;
    return products.filter(p => p.category === cat).length;
  };

  const categories: { label: string; value: CategoryType; count: string }[] = [
    { label: 'All Products', value: 'all', count: String(getCount('all')) },
    { label: 'Streaming', value: 'streaming', count: String(getCount('streaming')) },
    { label: 'VPN Networks', value: 'vpn', count: String(getCount('vpn')) },
    { label: 'Official Games', value: 'games', count: String(getCount('games')) },
    { label: 'Gift Cards', value: 'gift', count: String(getCount('gift')) },
    { label: 'Educational Tools', value: 'educational', count: String(getCount('educational')) },
  ];

  return (
    <div className="relative overflow-hidden bg-[#0A0A0B] border-b border-white/10 pb-12 pt-8 sm:pb-16 sm:pt-12">
      
      {/* Editorial Decorative Gradients */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Hero Left Content (Editorial Poster Vibe) */}
          <div className="text-left lg:col-span-7">
            <span className="inline-block px-3 py-1 bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white select-none">
              Digital Infrastructure
            </span>
            
            <h1 className="mt-6 text-[70px] sm:text-[92px] lg:text-[105px] leading-[0.82] font-black uppercase tracking-tighter italic select-none text-white">
              Your<br />Access<br /><span className="text-indigo-500">Unbound.</span>
            </h1>
            
            <p className="mt-8 text-base text-gray-400 font-light leading-relaxed max-w-xl">
              Premium digital licensing for the modern synapse. Global streaming networks, enterprise-grade anonymity tunnels, and curated gaming libraries delivered instantly.
            </p>

            {/* Asymmetrical inline trust metrics */}
            <div className="mt-12 flex flex-wrap gap-x-12 gap-y-6 items-end border-t border-white/10 pt-8">
              <div>
                <div className="text-3xl font-black text-white tracking-tight">24/7</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Instant Fulfillment</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div>
                <div className="text-3xl font-black text-white tracking-tight">14.2k</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Active Licenses</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div>
                <div className="text-3xl font-black text-white tracking-tight">99.9%</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 font-bold">Uptime SLA</div>
              </div>
            </div>

          </div>

          {/* Hero Right Controls Section */}
          <div className="lg:col-span-5">
            <div className="border border-white/10 bg-white/[0.02] p-8 relative">
              <div className="absolute top-0 left-0 w-8 h-px bg-indigo-500" />
              <div className="absolute top-0 left-0 w-px h-8 bg-indigo-500" />
              
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 block">
                Catalog Access Terminal
              </span>
              
              <h2 className="text-xl font-black uppercase text-white mb-6">
                Search & Filter Assets
              </h2>

              <div className="space-y-4">
                {/* Search Bar */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                    Keyword Query
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search Netflix, VPN, Elden Ring..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-none border border-white/10 bg-[#0A0A0B] py-3.5 pl-11 pr-4 text-xs text-white placeholder-gray-600 transition-colors focus:border-indigo-500 focus:outline-none"
                      id="search-input"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-wider"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Sorting */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                    Sort Index
                  </label>
                  <div className="relative">
                    <ArrowUpDown className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full rounded-none border border-white/10 bg-[#0A0A0B] py-3.5 pl-11 pr-8 text-xs text-white appearance-none cursor-pointer focus:border-indigo-500 focus:outline-none uppercase tracking-widest font-semibold"
                      id="sort-select"
                    >
                      <option value="popular">Popularity</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</div>
                  </div>
                </div>
              </div>

              {/* Secure Node Status Badge */}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Terminal Online
                </span>
                <span>SECURE SSL 256-BIT</span>
              </div>
            </div>
          </div>

        </div>

        {/* Category Selection Tabs */}
        <div className="mt-16 border-t border-b border-white/10">
          <nav className="flex flex-wrap justify-center sm:justify-start -mb-px" aria-label="Tabs">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`relative px-8 py-4 text-xs font-black uppercase tracking-widest transition-all duration-150 focus:outline-none border-r border-white/10 rounded-none ${
                    isActive
                      ? 'bg-white text-black font-black'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  id={`cat-tab-${cat.value}`}
                >
                  <span className="flex items-center gap-2.5">
                    {cat.label}
                    <span className={`text-[9px] px-1.5 py-0.5 font-bold ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-500'
                    }`}>
                      {cat.count}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </div>
  );
}
