import React, { useState } from 'react';
import { Building2, Users, Coins, MapPin, CheckCircle, AlertTriangle, Shield, UserCheck, ExternalLink, Calendar } from 'lucide-react';
import { DISTRICT_PERSPECTIVE_PLANS } from '../data/perspectivePlans';
import { DistrictPerspectivePlan } from '../types/pmajay';

export const PerspectivePlanDashboard: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictPerspectivePlan>(DISTRICT_PERSPECTIVE_PLANS[0]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Ministry Administrative Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded w-fit mb-1">
              <span>MoSJE Policy & Governance · SIH 26097 Focus</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              District Perspective Plans & Lead Financial Consultant Linkage
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Overcoming execution roadblocks by mapping local economic realities, GIA budget allocations, and trained financial mentors.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 self-start sm:self-auto">
            100% GIA Grants Audited
          </span>
        </div>

        {/* District Selector Tabs */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DISTRICT_PERSPECTIVE_PLANS.map((dist) => (
            <button
              key={dist.district_id}
              onClick={() => setSelectedDistrict(dist)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                selectedDistrict.district_id === dist.district_id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{dist.district_name} ({dist.state})</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                selectedDistrict.district_id === dist.district_id ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'
              }`}>
                {dist.sc_population_percent}% SC
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected District Perspective Plan Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* District Metrics Overview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-xs text-slate-400 block">Perspective Plan Dossier</span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedDistrict.district_name}, {selectedDistrict.state}
                </h3>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-lg font-medium border font-mono ${
                selectedDistrict.perspective_plan_status === 'Active Implementation'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : selectedDistrict.perspective_plan_status === 'Approved'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {selectedDistrict.perspective_plan_status}
              </span>
            </div>

            {/* 3 Key Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">SC Population</span>
                <p className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {selectedDistrict.sc_population_percent}%
                </p>
                <span className="text-[10px] text-slate-400">Census Demographic</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">Target Beneficiaries</span>
                <p className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                  {selectedDistrict.total_beneficiaries_target.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-slate-400">Annual GIA Target</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">GIA Budget</span>
                <p className="text-xl font-bold text-emerald-700 font-mono tabular-nums">
                  ₹{selectedDistrict.gia_budget_cr_inr} Cr
                </p>
                <span className="text-[10px] text-slate-400">Central Grant Allocated</span>
              </div>
            </div>

            {/* Priority Livelihood Sectors */}
            <div className="mb-6">
              <span className="text-xs font-semibold text-slate-700 block mb-2 uppercase tracking-wider">
                Priority Sectors Identified for Local Perspective Plan:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {selectedDistrict.priority_sectors.map((sec, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs font-medium text-amber-950 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{sec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Market Demands */}
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2 uppercase tracking-wider">
                Ground Reality & Local Market Demands:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedDistrict.local_market_demands.map((demand, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span>{demand}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Roadblock Mitigation & Ground Bottlenecks */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 pb-3 border-b border-slate-100 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Identified GIA Implementation Challenges (MoSJE Ground Audit):</span>
            </div>
            <div className="space-y-2 text-xs">
              {selectedDistrict.key_challenges_identified.map((ch, idx) => (
                <div key={idx} className="p-3 bg-red-50/50 rounded-xl border border-red-200/60 text-red-950 flex items-start gap-2">
                  <span className="text-red-600 font-bold shrink-0">{idx + 1}.</span>
                  <span>{ch}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Financial Consultant & Center Directory */}
        <div className="lg:col-span-4 space-y-6">
          {/* Lead Financial Consultant Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <UserCheck className="w-4 h-4" />
                <span>Assigned Financial Consultant</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                SIH Issue 2 Solved
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-base font-bold text-white">
                  {selectedDistrict.lead_financial_consultant.name}
                </h4>
                <p className="text-xs text-slate-300 leading-snug mt-0.5">
                  {selectedDistrict.lead_financial_consultant.designation}
                </p>
              </div>

              <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-xs space-y-1.5 font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Direct Contact:</span>
                  <span className="text-amber-300">{selectedDistrict.lead_financial_consultant.contact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Helpline:</span>
                  <span className="text-white">1800-11-2529 (Ext 4)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                Responsible for facilitating bank micro-credit, vetting business plans for ₹50,000 capital subsidies, and tracking post-training employment.
              </p>
            </div>
          </div>

          {/* Training Infrastructure Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-900 text-sm mb-3">
              Active Skilling Centers
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-slate-500 block">Accredited Centers</span>
                <span className="text-2xl font-bold text-slate-900 font-mono">
                  {selectedDistrict.active_training_centers}
                </span>
              </div>
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              All centers in {selectedDistrict.district_name} are equipped with biometric attendance, stipend disbursement under DBT, and NSQF assessment certification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
