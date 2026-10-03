import { DistrictPerspectivePlan } from '../types/pmajay';

export const DISTRICT_PERSPECTIVE_PLANS: DistrictPerspectivePlan[] = [
  {
    district_id: 'DIST-UP-01',
    district_name: 'Gorakhpur',
    state: 'Uttar Pradesh',
    sc_population_percent: 21.8,
    total_beneficiaries_target: 3800,
    gia_budget_cr_inr: 18.5,
    perspective_plan_status: 'Active Implementation',
    priority_sectors: ['Green Energy (Solar)', 'Apparel & Zardozi Craft', 'Automotive Services', 'Commercial Horticulture'],
    active_training_centers: 12,
    lead_financial_consultant: {
      name: 'Dr. Anand Kumar Mishra',
      designation: 'Senior Lead Financial Consultant (NSFDC / Lead District Manager)',
      contact: 'gorakhpur.pmajay@gov.in'
    },
    key_challenges_identified: [
      'High seasonal migration of agricultural laborers',
      'Low formal banking awareness for capital subsidy credit linkage',
      'Fragmented marketing for traditional handicraft artisans'
    ],
    local_market_demands: [
      'Rooftop solar expansion in rural mini-grids',
      'E-rickshaw fleet maintenance workshops',
      'Organic vermicompost packaging for peri-urban nursery chains',
      'Readymade garment stitching for regional wholesale mandis'
    ]
  },
  {
    district_id: 'DIST-MH-01',
    district_name: 'Solapur',
    state: 'Maharashtra',
    sc_population_percent: 19.4,
    total_beneficiaries_target: 3200,
    gia_budget_cr_inr: 15.2,
    perspective_plan_status: 'Active Implementation',
    priority_sectors: ['Textile & Terry Towel Handloom', 'Dairy & Animal Husbandry', 'Solar Water Pump Installation', 'Domestic Electricals'],
    active_training_centers: 9,
    lead_financial_consultant: {
      name: 'Sunita Patil (CA)',
      designation: 'District Micro-Credit Facilitator & NABARD Consultant',
      contact: 'solapur.pmajay@gov.in'
    },
    key_challenges_identified: [
      'Drought-prone blocks needing drought-resilient livelihood models',
      'Weaver community transition to modern jacquard/motorized machines',
      'Need for decentralized solar repair technicians'
    ],
    local_market_demands: [
      'Solar irrigation pump servicing under PM-KUSUM',
      'Chilling center milk collection and testing enterprise',
      'EV two-wheeler dealership mechanics'
    ]
  },
  {
    district_id: 'DIST-PB-01',
    district_name: 'Hoshiarpur',
    state: 'Punjab',
    sc_population_percent: 35.1,
    total_beneficiaries_target: 4500,
    gia_budget_cr_inr: 22.0,
    perspective_plan_status: 'Approved',
    priority_sectors: ['Woodcraft & Inlay Carpentry', 'Mushroom Cultivation', 'Solar PV Suryamitra', 'Healthcare Caregiver'],
    active_training_centers: 14,
    lead_financial_consultant: {
      name: 'Harpreet Singh Sandhu',
      designation: 'District Lead Bank Officer & PM-AJAY Consultant',
      contact: 'hoshiarpur.pmajay@gov.in'
    },
    key_challenges_identified: [
      'Youth overseas emigration aspirations needing viable local enterprise',
      'Preservation of GI-tagged Hoshiarpur wooden inlay craft',
      'Geriatric care demand due to aging rural demographic'
    ],
    local_market_demands: [
      'Controlled darkroom Button & Oyster mushroom production',
      'Elderly bedside attendant & health assistant wage placements',
      'Solar agro-processing unit installation'
    ]
  },
  {
    district_id: 'DIST-BR-01',
    district_name: 'Gaya',
    state: 'Bihar',
    sc_population_percent: 30.4,
    total_beneficiaries_target: 5100,
    gia_budget_cr_inr: 24.8,
    perspective_plan_status: 'Active Implementation',
    priority_sectors: ['Masonry & Rural Housing', 'Plumbing & Jal Jeevan', 'Commercial Vermicompost', 'Mobile Hardware Repair'],
    active_training_centers: 15,
    lead_financial_consultant: {
      name: 'Rameshwar Prasad (ICWA)',
      designation: 'District Livelihood Mission Coordinator & Financial Advisor',
      contact: 'gaya.pmajay@gov.in'
    },
    key_challenges_identified: [
      'Substantial rate of non-literate/semi-literate applicants needing voice-based skilling guidance',
      'Limited local manufacturing base, necessitating self-employment service micro-enterprises'
    ],
    local_market_demands: [
      'Jal Jeevan Mission pipeline plumbers & pump operators',
      'CSC rural kiosk mobile phone maintenance centers',
      'Vermicompost supply to organic farmer clusters'
    ]
  },
  {
    district_id: 'DIST-WB-01',
    district_name: 'Malda',
    state: 'West Bengal',
    sc_population_percent: 20.9,
    total_beneficiaries_target: 2900,
    gia_budget_cr_inr: 14.0,
    perspective_plan_status: 'Under Review',
    priority_sectors: ['Sericulture & Silk Reeling', 'Horticulture & Mango Processing', 'Apparel & Dress Making', 'Two Wheeler Servicing'],
    active_training_centers: 8,
    lead_financial_consultant: {
      name: 'Debashis Roy Chowdhury',
      designation: 'District MSME & Lead Bank Facilitator',
      contact: 'malda.pmajay@gov.in'
    },
    key_challenges_identified: [
      'Seasonal flood vulnerability affecting storage and workshops',
      'Traditional sericulture silk reelers lacking motorized cocoons processing gear'
    ],
    local_market_demands: [
      'Modern motorized sewing boutiques for women SHGs',
      'Mango post-harvest dehydration and pulp processing',
      'Electric 3-wheeler (Toto) repair stations'
    ]
  }
];
