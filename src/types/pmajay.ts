/**
 * Core Types for PM-AJAY AI Voice Assistant & Skilling System
 * Ministry of Social Justice and Empowerment (MoSJE) - SIH 2026 Problem ID: 26097
 */

export type RegionalLanguage = 
  | 'hi' // Hindi
  | 'bho' // Bhojpuri
  | 'pa' // Punjabi
  | 'mr' // Marathi
  | 'bn' // Bengali
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'gu' // Gujarati
  | 'en'; // English

export interface LanguageOption {
  code: RegionalLanguage;
  name: string;
  nativeName: string;
  samplePrompt: string;
}

export interface BeneficiaryProfile {
  current_occupation?: string;
  aspirational_interest?: string;
  education_level?: string;
  employment_preference?: 'self-employment' | 'wage' | 'either';
  mobility_radius?: 'local' | 'district' | 'state';
  location_district?: string;
  family_craft_background?: string;
  identified_skill_gaps?: string[];
  approx_income_pm?: string;
}

export interface NSQFRecommendation {
  trade_id: string;
  trade_name: string;
  nsqf_level: number;
  sector: string;
  match_score?: number; // 0 - 100
  match_reason: string;
  pm_ajay_benefit: string;
  capital_subsidy: string;
  training_duration: string;
  entry_qualification: string;
  career_path: 'Self-Employed Micro-Enterprise' | 'Wage Employment Linkage' | 'Both';
  recommended_cluster_type?: string;
  training_partner?: string;
}

export interface VoiceResponse {
  transcript: string;
  detected_language: RegionalLanguage;
  detected_intent: BeneficiaryProfile;
  recommendations: NSQFRecommendation[];
  spoken_reply_text: string;
  spoken_reply_english?: string;
  audio_base64?: string;
  audio_mime_type?: string;
}

export interface NSQFTrade {
  id: string;
  trade: string;
  nsqf_level: number;
  sector: string;
  category: 'Green Energy' | 'Automotive & EV' | 'Agriculture & Food' | 'Apparel & Handloom' | 'Construction & Plumbing' | 'Electronics & IT' | 'Healthcare & Sanitation';
  desc: string;
  eligibility: string;
  duration_hours: number;
  gia_benefit: string;
  capital_subsidy_inr: number;
  cluster_grant_applicable: boolean;
  wage_potential_monthly: string;
  key_modules: string[];
  district_demand_high: string[];
}

export interface DistrictPerspectivePlan {
  district_id: string;
  district_name: string;
  state: string;
  sc_population_percent: number;
  total_beneficiaries_target: number;
  gia_budget_cr_inr: number;
  perspective_plan_status: 'Approved' | 'Under Review' | 'Active Implementation';
  priority_sectors: string[];
  active_training_centers: number;
  lead_financial_consultant: {
    name: string;
    designation: string;
    contact: string;
  };
  key_challenges_identified: string[];
  local_market_demands: string[];
}

export interface IVRCallSession {
  callId: string;
  callerNumber: string;
  status: 'ringing' | 'connected' | 'ended';
  currentStep: number;
  collectedDigits: string[];
  conversationLog: Array<{
    sender: 'ivr' | 'user';
    text: string;
    audioUrl?: string;
    timestamp: string;
  }>;
  detectedProfile: BeneficiaryProfile;
}

export interface WhatsAppMessageItem {
  id: string;
  sender: 'user' | 'bot';
  type: 'text' | 'audio' | 'scheme_card';
  text?: string;
  audioDurationSeconds?: number;
  audioUrl?: string;
  audioBase64?: string;
  timestamp: string;
  schemeData?: NSQFRecommendation;
}
