import React from 'react';
import { Phone, Shield, Volume2, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'kiosk' | 'ivr' | 'whatsapp' | 'trades' | 'roadmap';
  setActiveTab: (tab: 'kiosk' | 'ivr' | 'whatsapp' | 'trades' | 'roadmap') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Official Government Top Micro-Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-200">Government of India</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Ministry of Social Justice and Empowerment (MoSJE)</span>
            <span aria-hidden="true" className="hidden sm:inline text-slate-600">·</span>
            <span className="hidden sm:inline text-amber-400 font-medium">SIH 2026 Problem ID: 26097</span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-slate-400">
            <span>Toll-Free National Helpline: <strong className="text-white font-mono">1800-11-2529</strong></span>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-sm font-bold text-lg font-serif">
            अ
          </div>
          <div>
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); setActiveTab('kiosk'); }}
              className="text-lg font-bold tracking-tight text-slate-900 hover:text-amber-700 transition-colors block"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              PM-AJAY Livelihood Voice
            </a>
            <p className="text-xs text-slate-500 hidden sm:block">
              NSQF Skilling & GIA Capital Subsidy Assistant
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
          <button
            onClick={() => setActiveTab('kiosk')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'kiosk'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Voice Kiosk
          </button>
          <button
            onClick={() => setActiveTab('ivr')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'ivr'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            1800-IVR Phone
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            WhatsApp Bot
          </button>
          <button
            onClick={() => setActiveTab('trades')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'trades'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            NSQF Catalog
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            Perspective Roadmap
          </button>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ivr')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Toll-Free Call</span>
            <span className="font-mono text-amber-950 font-semibold">1800-PM-AJAY</span>
          </button>
          <button
            onClick={() => setActiveTab('kiosk')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Speak Now</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-slate-100 bg-slate-50/90 scrollbar-none text-xs">
        <button
          onClick={() => setActiveTab('kiosk')}
          className={`px-3 py-1 font-medium rounded-md whitespace-nowrap ${
            activeTab === 'kiosk' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Voice Kiosk
        </button>
        <button
          onClick={() => setActiveTab('ivr')}
          className={`px-3 py-1 font-medium rounded-md whitespace-nowrap ${
            activeTab === 'ivr' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          1800-IVR Phone
        </button>
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`px-3 py-1 font-medium rounded-md whitespace-nowrap ${
            activeTab === 'whatsapp' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          WhatsApp Bot
        </button>
        <button
          onClick={() => setActiveTab('trades')}
          className={`px-3 py-1 font-medium rounded-md whitespace-nowrap ${
            activeTab === 'trades' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          NSQF Trades
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-3 py-1 font-medium rounded-md whitespace-nowrap ${
            activeTab === 'roadmap' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Perspective Roadmap
        </button>
      </div>
    </header>
  );
};
