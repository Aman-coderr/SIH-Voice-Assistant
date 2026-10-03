import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { VoiceAssistantKiosk } from './components/VoiceAssistantKiosk';
import { IVRPhoneSimulator } from './components/IVRPhoneSimulator';
import { WhatsAppVoiceBot } from './components/WhatsAppVoiceBot';
import { TradesExplorer } from './components/TradesExplorer';
import { PerspectivePlanDashboard } from './components/PerspectivePlanDashboard';
import { BeneficiaryReportModal } from './components/BeneficiaryReportModal';
import { BeneficiaryProfile, NSQFRecommendation, NSQFTrade } from './types/pmajay';
import { Shield, Phone, Sparkles, Building2, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'kiosk' | 'ivr' | 'whatsapp' | 'trades' | 'roadmap'>('kiosk');
  const [selectedTradeForModal, setSelectedTradeForModal] = useState<NSQFRecommendation | null>(null);
  const [activeProfileForModal, setActiveProfileForModal] = useState<BeneficiaryProfile | undefined>(undefined);

  // Convert NSQFTrade to NSQFRecommendation for modal
  const handleSelectTradeFromExplorer = (trade: NSQFTrade) => {
    const recommendation: NSQFRecommendation = {
      trade_id: trade.id,
      trade_name: trade.trade,
      nsqf_level: trade.nsqf_level,
      sector: trade.sector,
      match_score: 95,
      match_reason: 'सीधे कैटलॉग से चयनित पाठ्यक्रम।',
      pm_ajay_benefit: trade.gia_benefit,
      capital_subsidy: `₹${trade.capital_subsidy_inr.toLocaleString('en-IN')}`,
      training_duration: `${trade.duration_hours} घंटे`,
      entry_qualification: trade.eligibility,
      career_path: trade.cluster_grant_applicable ? 'Self-Employed Micro-Enterprise' : 'Wage Employment Linkage',
      training_partner: 'NSFDC प्रमाणित ग्रामीण कौशल केंद्र',
    };
    setSelectedTradeForModal(recommendation);
    setActiveProfileForModal(undefined);
  };

  const handleEnrollment = (trade: NSQFRecommendation, profile: BeneficiaryProfile) => {
    setSelectedTradeForModal(trade);
    setActiveProfileForModal(profile);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero Section */}
      <HeroSection
        onStartVoice={() => setActiveTab('kiosk')}
        onExploreTrades={() => setActiveTab('trades')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'kiosk' && (
          <VoiceAssistantKiosk onSelectTradeForEnrollment={handleEnrollment} />
        )}

        {activeTab === 'ivr' && (
          <IVRPhoneSimulator
            onEnrollFromIVR={(rec) => {
              setSelectedTradeForModal(rec);
            }}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppVoiceBot />
        )}

        {activeTab === 'trades' && (
          <TradesExplorer onSelectTrade={handleSelectTradeFromExplorer} />
        )}

        {activeTab === 'roadmap' && (
          <PerspectivePlanDashboard />
        )}
      </main>

      {/* Enrollment Card Modal */}
      {selectedTradeForModal && (
        <BeneficiaryReportModal
          trade={selectedTradeForModal}
          profile={activeProfileForModal}
          onClose={() => setSelectedTradeForModal(null)}
        />
      )}

      {/* Quiet, Human-Crafted Official Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 mt-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white font-serif text-sm">
                अ
              </div>
              <span className="font-bold text-slate-100 text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
                PM-AJAY Livelihood Voice
              </span>
            </div>
            <p className="leading-relaxed text-slate-400">
              National AI-driven voice portal for SC skilling & capital subsidies under the Grant-in-Aid (GIA) component of PM-AJAY.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Deployment Channels (SIH 26097)
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('kiosk')} className="hover:text-white transition-colors">
                  Village Kiosk Voice Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ivr')} className="hover:text-white transition-colors">
                  1800-PM-AJAY Feature Phone IVR
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('whatsapp')} className="hover:text-white transition-colors">
                  Rural WhatsApp Voice-Note Bot
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('trades')} className="hover:text-white transition-colors">
                  NSQF Level 1-5 Trades Directory
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Government Stakeholders
            </h4>
            <ul className="space-y-2">
              <li>Ministry of Social Justice and Empowerment (MoSJE)</li>
              <li>National Scheduled Castes Finance and Development Corporation (NSFDC)</li>
              <li>National Skill Development Corporation (NSDC)</li>
              <li>District Social Welfare Officers (DSWO)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Helpline & Support
            </h4>
            <p className="mb-2">National Toll-Free Assistance:</p>
            <p className="text-white font-mono font-bold text-sm mb-3">1800-11-2529</p>
            <p className="text-[11px] text-slate-500">
              Accessible 24x7 across all mobile networks in India without internet charges.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Ministry of Social Justice and Empowerment, Government of India. Smart India Hackathon Solution.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400">Vercel & Express Ready</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400">Privacy & Data Governance</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400">WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
