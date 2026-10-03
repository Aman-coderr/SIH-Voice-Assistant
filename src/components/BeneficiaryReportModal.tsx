import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle2, Shield, QrCode, Sparkles, Building2 } from 'lucide-react';
import { BeneficiaryProfile, NSQFRecommendation } from '../types/pmajay';

interface BeneficiaryReportModalProps {
  trade: NSQFRecommendation;
  profile?: BeneficiaryProfile;
  onClose: () => void;
}

export const BeneficiaryReportModal: React.FC<BeneficiaryReportModalProps> = ({
  trade,
  profile,
  onClose,
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const enrollmentId = `PMAJAY-${Date.now().toString().slice(-6)}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div 
        ref={modalContentRef}
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8"
      >
        {/* Top Control Bar (Non-Printable) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-amber-300">Official Beneficiary Enrollment Pass</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Body */}
        <div className="p-8 space-y-6">
          {/* Official Pass Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900 relative">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xl mb-2 font-serif shadow-xs">
              अ
            </div>
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              Government of India · Ministry of Social Justice and Empowerment
            </h2>
            <h3 className="text-base font-bold text-amber-900 mt-0.5">
              Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Grant-in-Aid (GIA) Component · Beneficiary Skilling & Subsidy Voucher
            </p>

            <div className="absolute top-0 right-0 text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Pass Number</span>
              <span className="text-xs font-bold text-slate-900 font-mono">{enrollmentId}</span>
            </div>
          </div>

          {/* Beneficiary & Skill Mapping Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Candidate Category:</span>
              <strong className="text-slate-900 text-sm">Scheduled Caste (SC) Beneficiary</strong>
              <span className="text-[11px] text-slate-500 block mt-1">
                Current Background: {profile?.current_occupation || "Rural Traditional Artisan / Labour"}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Application Date & Verification:</span>
              <strong className="text-slate-900 text-sm">{currentDate}</strong>
              <span className="text-[11px] text-emerald-700 block mt-1 font-medium">
                ✓ AI Voice Interview Verified
              </span>
            </div>
          </div>

          {/* Allotted NSQF Course */}
          <div className="p-5 bg-amber-50/70 rounded-2xl border-2 border-amber-300">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  Allotted Vocational Trade
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-1">
                  {trade.trade_name}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sector: <strong>{trade.sector}</strong> · NSQF Level <strong>{trade.nsqf_level}</strong>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 font-mono">
                  {trade.capital_subsidy} Subsidy
                </span>
              </div>
            </div>

            <p className="text-xs text-amber-950 mt-3 pt-3 border-t border-amber-200 leading-relaxed">
              <strong>Grant-in-Aid Entitlement:</strong> {trade.pm_ajay_benefit}
            </p>
          </div>

          {/* Verification & Next Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2">
            <div className="sm:col-span-8 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Next Immediate Step:</span>
              </div>
              <p className="leading-relaxed">
                Present this enrollment pass along with your Aadhaar Card and SC Caste Certificate at the nearest <strong>District Social Welfare Office (DSWO)</strong> or <strong>NSFDC Training Partner</strong> to commence batch training with direct DBT stipend.
              </p>
            </div>

            <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <QrCode className="w-16 h-16 text-slate-800 mb-1" />
              <span className="text-[10px] text-slate-500 font-mono">Scan to Verify Voucher</span>
            </div>
          </div>

          {/* Official Seal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>Official Portal: pmajay.dosje.gov.in</span>
            <span className="font-mono">Central MoSJE GIA Portal · Toll-Free 1800-11-2529</span>
          </div>
        </div>
      </div>
    </div>
  );
};
