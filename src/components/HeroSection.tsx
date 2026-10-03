import React from 'react';
import { Mic, ArrowRight, BookOpen, Layers, Coins, Building2 } from 'lucide-react';

interface HeroSectionProps {
  onStartVoice: () => void;
  onExploreTrades: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartVoice, onExploreTrades }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200 py-10 lg:py-14">
      {/* Decorative subtle Indian Tricolor accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-white to-emerald-600 opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Editorial Value Proposition */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-md w-fit mb-4">
              <span>MoSJE Grant-in-Aid (GIA) Component</span>
              <span aria-hidden="true">·</span>
              <span>PM-AJAY 2026 Initiative</span>
            </div>

            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] text-balance mb-4"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Empowering SC Communities Through Voice-Driven Livelihood Skilling
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-6">
              Break language and literacy barriers with an AI voice assistant that interviews beneficiaries in their native dialect, maps livelihood aspirations, and connects them directly with NSQF-certified vocational training and up to <strong className="text-slate-900 font-semibold">₹50,000 capital subsidies</strong>.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onStartVoice}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap active:scale-[0.98]"
              >
                <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Start Voice Interview (बोलकर बताएं)</span>
              </button>

              <button
                onClick={onExploreTrades}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-xs whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Explore NSQF Trades Catalog</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Trust and Accessibility Badges */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>8 Regional Dialects & Languages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Zero Form-Filling Required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>100% GIA Grant for SHG Clusters</span>
              </div>
            </div>
          </div>

          {/* Quantitative Evidence & Impact Summary Cards */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">PM-AJAY GIA National Deployment</h3>
                  <p className="text-xs text-slate-500">Real-time Ministry Perspective Plan Metrics</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">LIVE DATA</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Adarsh Villages</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">14,250</p>
                  <p className="text-xs text-slate-500 mt-1">SC-dominated clusters mapped</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Max Subsidy</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">₹50,000</p>
                  <p className="text-xs text-slate-500 mt-1">Capital grant for micro-enterprises</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>NSQF Trades</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">14+ Tracks</p>
                  <p className="text-xs text-slate-500 mt-1">Green energy, agri & crafts</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">IVR</span>
                    <span>Helpline 1800</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">Toll-Free</p>
                  <p className="text-xs text-slate-500 mt-1">Works on basic keypad phones</p>
                </div>
              </div>

              {/* Call to Action Quote Box */}
              <div className="mt-5 p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900">
                <span className="font-semibold block mb-0.5">SIH Problem Statement 26097 Goal:</span>
                Empathetic conversational AI that conducts natural interviews, eliminates administrative intimidation, and bridges the gap between beneficiary aspirations and market opportunities.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
