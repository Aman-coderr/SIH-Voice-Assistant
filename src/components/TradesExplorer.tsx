import React, { useState } from 'react';
import { Search, Filter, Sparkles, Clock, GraduationCap, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { NSQF_TRADES_DATASET } from '../data/nsqfTrades';
import { NSQFTrade } from '../types/pmajay';

interface TradesExplorerProps {
  onSelectTrade: (trade: NSQFTrade) => void;
}

export const TradesExplorer: React.FC<TradesExplorerProps> = ({ onSelectTrade }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const categories = [
    'All',
    'Green Energy',
    'Automotive & EV',
    'Agriculture & Food',
    'Apparel & Handloom',
    'Construction & Plumbing',
    'Electronics & IT',
    'Healthcare & Sanitation',
  ];

  const levels = ['All', '3', '4'];

  const filteredTrades = NSQF_TRADES_DATASET.filter((trade) => {
    const matchesSearch =
      trade.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.key_modules.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || trade.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || trade.nsqf_level.toString() === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header and Filter Controls */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded w-fit mb-1">
              <span>National Skills Qualifications Framework (NSQF)</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              PM-AJAY GIA Skilling & Enterprise Catalog
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified vocational courses with up to ₹50,000 capital subsidies and 100% SHG cluster grants.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            {filteredTrades.length} Courses Available
          </span>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by trade name, keywords, or skills (e.g. Solar, Tailor, EV)..."
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer text-slate-700"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Sectors (सभी क्षेत्र)' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer text-slate-700"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl === 'All' ? 'All Levels' : `NSQF Level ${lvl}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Trades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrades.map((trade) => (
          <div
            key={trade.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {trade.category}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  Level {trade.nsqf_level}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug mb-2">
                {trade.trade}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                {trade.desc}
              </p>

              {/* Capital Subsidy Callout */}
              <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-xl border border-amber-200/80 mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-950 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    PM-AJAY Capital Subsidy:
                  </span>
                  <span className="font-bold text-amber-900 font-mono tabular-nums">
                    ₹{trade.capital_subsidy_inr.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/80 line-clamp-2">
                  {trade.gia_benefit}
                </p>
              </div>

              {/* Key Specs */}
              <div className="space-y-1.5 text-[11px] text-slate-500 mb-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Duration:
                  </span>
                  <strong className="text-slate-800 font-mono">{trade.duration_hours} Hours</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" /> Eligibility:
                  </span>
                  <strong className="text-slate-800 truncate max-w-[170px]" title={trade.eligibility}>
                    {trade.eligibility}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Wage Potential:</span>
                  <strong className="text-emerald-700 font-medium font-mono">{trade.wage_potential_monthly}</strong>
                </div>
              </div>

              {/* Key Modules */}
              <div className="mb-4">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Core Practical Modules:
                </span>
                <div className="flex flex-wrap gap-1">
                  {trade.key_modules.slice(0, 3).map((mod, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => onSelectTrade(trade)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Enroll / Generate Scheme Pass</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
