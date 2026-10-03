import { GoogleGenAI, Type } from "@google/genai";
import { NSQF_TRADES_DATASET } from "../src/data/nsqfTrades.ts";
import { BeneficiaryProfile, NSQFRecommendation, RegionalLanguage, VoiceResponse } from "../src/types/pmajay.ts";

// Shared GoogleGenAI instance with mandatory User-Agent header
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

/**
 * Transcribes audio using Gemini models with vocational keyword guidance in selected regional language
 */
export async function transcribeAudio(
  audioBase64: string,
  mimeType: string = 'audio/webm',
  language: RegionalLanguage = 'hi'
): Promise<string> {
  if (!ai || !audioBase64) {
    return "";
  }

  const languageNames: Record<string, string> = {
    hi: 'Hindi (हिन्दी)',
    bho: 'Bhojpuri (भोजपुरी)',
    mr: 'Marathi (मराठी)',
    pa: 'Punjabi (ਪੰਜਾਬੀ)',
    bn: 'Bengali (বাংলা)',
    ta: 'Tamil (தமிழ்)',
    te: 'Telugu (తెలుగు)',
    gu: 'Gujarati (ગુજરાતી)',
    en: 'English',
  };
  const targetLangName = languageNames[language] || 'Hindi (हिन्दी)';

  const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            inlineData: {
              mimeType: mimeType || 'audio/webm',
              data: audioBase64,
            },
          },
          `Listen to this audio query from an Indian citizen applying for vocational training and livelihood under PM-AJAY.
The citizen is speaking in ${targetLangName} (Language code: ${language}).
Listen carefully for any vocational trade keywords or goals in their language, such as:
- Poultry farming / मुर्गी पालन / ਪੋਲਟਰੀ / ಕೋಳಿ / হাঁস-মুরগি / broiler
- Tailoring & boutique / सिलाई / ਸਿਲਾਈ / தையல் / కుట్టుపని / সেলাই / sewing
- Bike & motorcycle mechanic / बाइक गैराज / ਬਾਈਕ ਮਕੈਨਿਕ / பைக் மெக்கானிக் / బైక్ మెకానిక్ / garage
- Computer & data entry / कंप्यूटर / ਕੰਪਿਊਟਰ / கணினி / కంప్యూటర్ / typing / CSC
- Solar panel & Suryamitra / सोलर पैनल / ਸੋਲਰ ਪੈਨਲ / சூரிய மின்சக்தி / సౌర విద్యుత్
- Domestic electrician & wiring / बिजली / ਬਿਜਲੀ ਮਿਸਤਰੀ / மின் வேலை / ఎలక్ట్రీషియన్ / wiring
- Dairy farming & milk processing / डेयरी / ਡੇਅਰੀ / பால் பண்ணை / పాడి పరిశ్రమ / दूध
- Healthcare caregiver & GDA / अस्पताल / ਹਸਪਤਾਲ / நோயாளி பராமரிப்பு / రోగి సంరక్షణ / nurse
- Plumber & pipe fitting / नल फिटिंग / ਪਲੰਬਰ / பிளம்பர் / ప్లంబర్ / জল জীবন
- Organic vermicompost & mushroom / जैविक खाद / ਖੁੰਬਾਂ / இயற்கை உரம் / పుట్టగొడుగులు
- Embroidery & Zari-Zardozi / कढ़ाई / ਕਢਾਈ / தையல் வேலை / হস্তশিল্প

Filter out background noise. Accurately transcribe their spoken words into ${targetLangName} using its authentic native script (e.g. Gurmukhi for Punjabi, Bengali script for Bengali, Tamil script for Tamil, Telugu script for Telugu, Gujarati script for Gujarati, Devanagari for Hindi/Marathi/Bhojpuri, Latin for English). DO NOT translate into Hindi or English if the speaker is speaking a regional language. Preserve all trade keywords. If the audio is silence or unidentifiable noise, reply with nothing. Output ONLY the clean transcribed words.`,
        ],
      });

      const text = response.text?.trim();
      if (text && !text.toLowerCase().includes("please provide") && !text.toLowerCase().includes("i cannot")) {
        return text;
      }
    } catch (error: any) {
      console.warn(`Model ${modelName} transcribe failed:`, error?.message || error);
    }
  }

  return "";
}

/**
 * Extracts BeneficiaryProfile and performs NSQF matching from text and/or raw audio in the user's selected language
 */
export async function processConversationAI(
  userText: string,
  preferredLanguage: RegionalLanguage = 'hi',
  audioBase64?: string,
  mimeType: string = 'audio/webm'
): Promise<VoiceResponse> {
  const languageNames: Record<string, string> = {
    hi: 'Hindi (हिन्दी)',
    bho: 'Bhojpuri (भोजपुरी)',
    mr: 'Marathi (मराठी)',
    pa: 'Punjabi (ਪੰਜਾਬੀ)',
    bn: 'Bengali (বাংলা)',
    ta: 'Tamil (தமிழ்)',
    te: 'Telugu (తెలుగు)',
    gu: 'Gujarati (ગુજરાતી)',
    en: 'English',
  };
  const targetLangName = languageNames[preferredLanguage] || 'Hindi (हिन्दी)';

  const tradesContext = NSQF_TRADES_DATASET.map(t => ({
    id: t.id,
    trade: t.trade,
    level: t.nsqf_level,
    sector: t.sector,
    eligibility: t.eligibility,
    gia_benefit: t.gia_benefit,
    capital_subsidy: t.capital_subsidy_inr,
    desc: t.desc,
  }));

  // Robust multi-lingual keyword recognition across English, Hindi, Punjabi, Bengali, Marathi, Tamil, Telugu
  const lower = (userText || "").toLowerCase();
  let defaultInterest = "कौशल विकास व स्वरोजगार";
  let defaultOccupation = "दिहाड़ी श्रम / पारंपरिक कार्य";
  let recommendedTradeIds: string[] = [];

  if (
    lower.includes('डेयरी') || lower.includes('dairy') || lower.includes('दूध') || lower.includes('doodh') || lower.includes('dudh') ||
    lower.includes('ਡੇਅਰੀ') || lower.includes('ਪਸ਼ੂ') || lower.includes('பால்') || lower.includes('పాడి') || lower.includes('દૂધ') ||
    lower.includes('गाय') || lower.includes('भैंस') || lower.includes('cattle') || lower.includes('cow')
  ) {
    recommendedTradeIds = ['TR-AGRI-03', 'TR-AGRI-01'];
    defaultInterest = "डेयरी फार्मिंग एवं दुग्ध प्रसंस्करण";
    defaultOccupation = "पशुपालक / दुग्ध उत्पादक";
  } else if (
    lower.includes('मुर्गी') || lower.includes('murgi') || lower.includes('poultry') || lower.includes('अंडा') || lower.includes('anda') ||
    lower.includes('ਮੁਰਗੀ') || lower.includes('পোল্ট্রি') || lower.includes('கோழி') || lower.includes('కోళ్ల') || lower.includes('મરઘાં') ||
    lower.includes('चिकन') || lower.includes('chicken') || lower.includes('पोल्ट्री') || lower.includes('broiler')
  ) {
    recommendedTradeIds = ['TR-AGRI-04', 'TR-AGRI-01'];
    defaultInterest = "पोल्ट्री फार्मिंग एवं ब्रायलर पालन";
    defaultOccupation = "ग्रामीण पशुपालक / बेरोजगार युवा";
  } else if (lower.includes('solar pump') || lower.includes('सोलर पंप') || lower.includes('ਸੋਲਰ ਪੰਪ') || lower.includes('சோலார் பம்ப்') || lower.includes('kusum') || lower.includes('कुसुम') || lower.includes('बोरवेल')) {
    recommendedTradeIds = ['TR-SOL-02', 'TR-SOL-01'];
    defaultInterest = "सोलर वाटर पंप इंस्टॉलेशन व मेंटेनेंस";
    defaultOccupation = "कृषि पंप मैकेनिक / युवा किसान";
  } else if (
    lower.includes('solar') || lower.includes('सोलर') || lower.includes('सौर') || lower.includes('ਸੋਲਰ') || lower.includes('সৌর') ||
    lower.includes('சூரிய') || lower.includes('సౌర') || lower.includes('સોલાર') || lower.includes('suryamitra') || lower.includes('सूर्यमित्र') || lower.includes('rooftop')
  ) {
    recommendedTradeIds = ['TR-SOL-01', 'TR-SOL-02'];
    defaultInterest = "सोलर पैनल इंस्टॉलेशन (सूर्यमित्र)";
    defaultOccupation = "रूफटॉप सोलर हेल्पर / इलेक्ट्रिकल युवा";
  } else if (
    lower.includes('बिजली') || lower.includes('bijli') || lower.includes('electrician') || lower.includes('electric') || lower.includes('ਬਿਜਲੀ') ||
    lower.includes('ইলেকট্রিক') || lower.includes('மின்') || lower.includes('విద్యుత్') || lower.includes('ઇલેક્ટ્રિક') || lower.includes('वायरिंग') ||
    lower.includes('wiring') || lower.includes('पंखा') || lower.includes('मोटर') || lower.includes('motor') || lower.includes('appliance')
  ) {
    recommendedTradeIds = ['TR-ELEC-01', 'TR-SOL-01'];
    defaultInterest = "घरेलू वायरिंग एवं उपकरण रिपेयर";
    defaultOccupation = "इलेक्ट्रिकल हेल्पर / वायरमैन";
  } else if (
    lower.includes('कढ़ाई') || lower.includes('kadhai') || lower.includes('embroidery') || lower.includes('ਕਢਾਈ') || lower.includes('जरी') ||
    lower.includes('zari') || lower.includes('aari') || lower.includes('ज़रदोज़ी') || lower.includes('zardozi') || lower.includes('হস্তশিল্প')
  ) {
    recommendedTradeIds = ['TR-TEXT-02', 'TR-TEXT-01'];
    defaultInterest = "जरी-ज़रदोज़ी व आरी कढ़ाई शिल्प";
    defaultOccupation = "पारंपरिक हस्तशिल्प कारीगर / महिला SHG";
  } else if (
    lower.includes('tailor') || lower.includes('tailoring') || lower.includes('कपड़ा') || lower.includes('सिलाई') || lower.includes('silai') ||
    lower.includes('ਸਿਲਾਈ') || lower.includes('সেলাই') || lower.includes('தையல்') || lower.includes('కుట్టు') || lower.includes('સિલાઈ') ||
    lower.includes('sewing') || lower.includes('सूट') || lower.includes('बुटीक') || lower.includes('boutique') || lower.includes('dressmaker')
  ) {
    recommendedTradeIds = ['TR-TEXT-01', 'TR-TEXT-02'];
    defaultInterest = "सिलाई, कटिंग एवं बुटीक स्वरोजगार";
    defaultOccupation = "घरेलू सिलाई / महिला स्वयं सहायता समूह";
  } else if (
    lower.includes('गाड़ी') || lower.includes('bike') || lower.includes('motorcycle') || lower.includes('two wheeler') || lower.includes('vehicle') ||
    lower.includes('ਬਾਈਕ') || lower.includes('গাড়ি') || lower.includes('பைக்') || lower.includes('బైక్') || lower.includes('બાઇક') ||
    lower.includes('गैराज') || lower.includes('garage') || lower.includes('मैकेनिक') || lower.includes('mechanic') || lower.includes('रिक्शा') || lower.includes('rickshaw') || lower.includes('ev') || lower.includes('scooter')
  ) {
    recommendedTradeIds = ['TR-AUTO-01', 'TR-AUTO-02'];
    defaultInterest = "दोपहिया एवं ई-रिक्शा रिपेयर गैराज";
    defaultOccupation = "गैराज सहायक / ऑटोमोबाइल कामगार";
  } else if (
    lower.includes('मशरूम') || lower.includes('mushroom') || lower.includes('organic') || lower.includes('ਖੁੰਬਾਂ') || lower.includes('মাশরুম') ||
    lower.includes('காளான்') || lower.includes('పుట్టగొడుగు') || lower.includes('મશરૂમ') || lower.includes('खाद') || lower.includes('khad') ||
    lower.includes('केंचुआ') || lower.includes('vermicompost') || lower.includes('जैविक')
  ) {
    recommendedTradeIds = ['TR-AGRI-02', 'TR-AGRI-01'];
    defaultInterest = "मशरूम उत्पादन एवं जैविक वर्मीकम्पोस्ट";
    defaultOccupation = "छोटे किसान / कृषि श्रमिक";
  } else if (
    lower.includes('नल') || lower.includes('nal') || lower.includes('पाइप') || lower.includes('pipe') || lower.includes('plumber') || lower.includes('plumbing') ||
    lower.includes('ਪਲੰਬਰ') || lower.includes('প্লাম্বার') || lower.includes('பிளம்பர்') || lower.includes('ప్లంబర్') || lower.includes('પ્લમ્બર') ||
    lower.includes('प्लंबर') || lower.includes('पानी') || lower.includes('जल जीवन')
  ) {
    recommendedTradeIds = ['TR-PLUMB-01', 'TR-ELEC-01'];
    defaultInterest = "प्लंबिंग एवं पाइपलाइन मेंटेनेंस";
    defaultOccupation = "प्लंबर सहायक / निर्माण श्रमिक";
  } else if (
    lower.includes('कंप्यूटर') || lower.includes('computer') || lower.includes('data entry') || lower.includes('typing') || lower.includes('ਕੰਪਿਊਟਰ') ||
    lower.includes('কমিপউটার') || lower.includes('கணினி') || lower.includes('కంప్యూటర్') || lower.includes('કોમ્પ્યુટર') ||
    lower.includes('टाइपिंग') || lower.includes('ऑफिस') || lower.includes('डाटा') || lower.includes('csc')
  ) {
    recommendedTradeIds = ['TR-IT-01', 'TR-ELEC-02'];
    defaultInterest = "डाटा एंट्री ऑपरेटर व कंप्यूटर कौशल";
    defaultOccupation = "10वीं/12वीं पास शिक्षित बेरोजगार युवा";
  } else if (
    lower.includes('मोबाइल') || lower.includes('mobile') || lower.includes('phone') || lower.includes('ਮੋਬਾਈਲ') || lower.includes('মোবাইল') ||
    lower.includes('மொபைல்') || lower.includes('మొబైల్') || lower.includes('મોબાઇલ') || lower.includes('स्मार्टफोन') || lower.includes('smartphone')
  ) {
    recommendedTradeIds = ['TR-ELEC-02', 'TR-IT-01'];
    defaultInterest = "स्मार्टफोन हार्डवेयर व स्क्रीन रिपेयर";
    defaultOccupation = "इलेक्ट्रॉनिक्स रिपेयर सहायक";
  } else if (
    lower.includes('अस्पताल') || lower.includes('aspatal') || lower.includes('hospital') || lower.includes('ਹਸਪਤਾਲ') || lower.includes('হাসপাতাল') ||
    lower.includes('மருத்துவமனை') || lower.includes('ఆసుపత్రి') || lower.includes('હોસ્પિટલ') || lower.includes('मरीज') || lower.includes('caregiver') ||
    lower.includes('स्वास्थ्य') || lower.includes('नर्स') || lower.includes('nurse') || lower.includes('जीडीए') || lower.includes('gda')
  ) {
    recommendedTradeIds = ['TR-HEALTH-01', 'TR-HEALTH-02'];
    defaultInterest = "जनरल ड्यूटी असिस्टेंट (स्वास्थ्य केयरगिवर)";
    defaultOccupation = "स्वास्थ्य सहायक / आशा कार्यकर्ता";
  } else if (lower.includes('सफाई') || lower.includes('sanitation') || lower.includes('सेप्टिक') || lower.includes('कचरा') || lower.includes('septic') || lower.includes('नमस्ते')) {
    recommendedTradeIds = ['TR-HEALTH-02', 'TR-PLUMB-01'];
    defaultInterest = "मैकेनाइज्ड सैनिटेशन सुपरवाइजर (NAMASTE)";
    defaultOccupation = "सफाई कामगार";
  } else {
    // Default balanced recommendation: Solar and Tailoring/Two-Wheeler
    recommendedTradeIds = ['TR-SOL-01', 'TR-AUTO-01'];
  }

  let extractedProfile: BeneficiaryProfile = {
    current_occupation: defaultOccupation,
    aspirational_interest: defaultInterest,
    education_level: "8वीं/10वीं पास",
    employment_preference: "self-employment",
    mobility_radius: "local",
    family_craft_background: "पारंपरिक ग्रामीण हस्तकला/श्रम",
    identified_skill_gaps: ["आधुनिक उपकरण संचालन", "उद्यमिता कौशल", "वित्तीय प्रबंधन"]
  };

  let spokenRegional = "";
  let spokenEnglish = "";
  let effectiveTranscript = userText;

  if (ai) {
    const models = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
    for (const modelName of models) {
      try {
        const prompt = `
You are the AI Livelihood & Skilling Assistant for the Ministry of Social Justice and Empowerment (MoSJE), Government of India, under PM-AJAY.

The user's chosen language is: "${targetLangName}" (Code: ${preferredLanguage}).
${audioBase64 ? `A real spoken audio query from the applicant is attached. The speaker is speaking in ${targetLangName}. Listen directly to their vocal acoustics, dialect, and words.` : ""}
User statement or transcript: "${userText}"

Available NSQF Trades Database:
${JSON.stringify(tradesContext, null, 2)}

KEYWORD-TO-TRADE RECOGNITION GUIDE:
- Poultry/Chicken/Eggs/Broiler -> TR-AGRI-04 (Poultry Farmer)
- Tailoring/Sewing/Boutique/Dresses -> TR-TEXT-01 (Assistant Dress Maker & Fashion Tailor)
- Bike/Motorcycle/Garage/EV -> TR-AUTO-01 (Two Wheeler Service Technician), TR-AUTO-02 (EV Service Technician)
- Data Entry/Computer/Typing/Office -> TR-IT-01 (Data Entry Operator)
- Solar PV/Rooftop/Suryamitra -> TR-SOL-01 (Solar PV Installer)
- Domestic Electrician/Wiring/Motors/Fans -> TR-ELEC-01 (Domestic Electrician & Home Appliances Repair)
- Dairy Farming/Milk/Cattle/Cows -> TR-AGRI-03 (Dairy Farm Supervisor & Milk Processing Entrepreneur)
- Hospital/Patient Caregiver/Nurse/GDA -> TR-HEALTH-01 (General Duty Assistant)
- Plumbing/Pipes/Water taps -> TR-PLUMB-01 (Plumber General)
- Vermicompost/Mushroom/Organic farming -> TR-AGRI-01, TR-AGRI-02
- Embroidery/Zari/Aari handicraft -> TR-TEXT-02

Tasks:
1. Listen to audio and analyze text in ${targetLangName}. If audio was provided, transcribe what the user said in ${targetLangName} into 'transcribed_user_speech' (in native script).
2. Extract the beneficiary's profile:
   - current_occupation
   - aspirational_interest
   - education_level
   - employment_preference ('self-employment' or 'wage')
   - mobility_radius ('local' or 'district')
   - identified_skill_gaps
3. Pick top 2 most matching trade IDs from the database that align with their exact keywords and interest.
4. CRITICAL: Generate a warm, empathetic spoken reply in ${targetLangName} using authentic native script (e.g. Gurmukhi for Punjabi, Bengali script for Bengali, Tamil script for Tamil, Telugu script for Telugu, Devanagari for Marathi/Hindi/Bhojpuri, Latin for English) explaining specifically why the chosen course matches their exact interest, mentioning the NSQF level and the PM-AJAY capital subsidy (up to ₹50,000) or toolkit grant. Keep it under 60 words. Place this in 'spoken_reply_text'.
5. Also generate an English translation of the spoken reply in 'spoken_reply_english'.
`;

        const contentsPayload: any[] = [];
        if (audioBase64) {
          contentsPayload.push({
            inlineData: {
              mimeType: mimeType || 'audio/webm',
              data: audioBase64,
            },
          });
        }
        contentsPayload.push(prompt);

        const response = await ai.models.generateContent({
          model: modelName,
          contents: contentsPayload,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                transcribed_user_speech: { type: Type.STRING },
                current_occupation: { type: Type.STRING },
                aspirational_interest: { type: Type.STRING },
                education_level: { type: Type.STRING },
                employment_preference: { type: Type.STRING },
                mobility_radius: { type: Type.STRING },
                identified_skill_gaps: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                top_trade_ids: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Array of matching trade IDs"
                },
                spoken_reply_text: { type: Type.STRING },
                spoken_reply_english: { type: Type.STRING },
              },
              required: ["current_occupation", "aspirational_interest", "top_trade_ids", "spoken_reply_text"],
            },
          },
        });

        const parsed = JSON.parse(response.text?.trim() || "{}");
        if (parsed.transcribed_user_speech && parsed.transcribed_user_speech.trim().length > 0) {
          effectiveTranscript = parsed.transcribed_user_speech;
        }
        if (parsed.current_occupation) {
          extractedProfile = {
            current_occupation: parsed.current_occupation,
            aspirational_interest: parsed.aspirational_interest || defaultInterest,
            education_level: parsed.education_level || "10वीं पास",
            employment_preference: (parsed.employment_preference === 'wage' ? 'wage' : 'self-employment'),
            mobility_radius: (parsed.mobility_radius === 'district' ? 'district' : 'local'),
            identified_skill_gaps: parsed.identified_skill_gaps || ["आधुनिक उपकरण संचालन", "उद्यमिता कौशल"],
          };
        }
        if (Array.isArray(parsed.top_trade_ids) && parsed.top_trade_ids.length > 0) {
          recommendedTradeIds = parsed.top_trade_ids;
        }
        if (parsed.spoken_reply_text) {
          const candidate = parsed.spoken_reply_text.trim();
          let isValidScript = true;
          if (preferredLanguage === 'pa' && !/[\u0A00-\u0A7F]/.test(candidate)) isValidScript = false;
          if (preferredLanguage === 'bn' && !/[\u0980-\u09FF]/.test(candidate)) isValidScript = false;
          if (preferredLanguage === 'ta' && !/[\u0B80-\u0BFF]/.test(candidate)) isValidScript = false;
          if (preferredLanguage === 'te' && !/[\u0C00-\u0C7F]/.test(candidate)) isValidScript = false;
          if (preferredLanguage === 'gu' && !/[\u0A80-\u0AFF]/.test(candidate)) isValidScript = false;
          if (preferredLanguage === 'en' && /[\u0900-\u097F]/.test(candidate)) isValidScript = false;

          if (isValidScript) {
            spokenRegional = candidate;
          }
        }
        if (parsed.spoken_reply_english) {
          spokenEnglish = parsed.spoken_reply_english;
        }
        break; // Successfully generated, break loop
      } catch (err: any) {
        console.warn(`Model ${modelName} reasoning attempt failed:`, err?.message || err);
      }
    }
  }

  // Build the recommendations array
  const recommendations: NSQFRecommendation[] = recommendedTradeIds
    .map(id => NSQF_TRADES_DATASET.find(t => t.id === id))
    .filter((t): t is NonNullable<typeof t> => !!t)
    .map((trade, idx) => ({
      trade_id: trade.id,
      trade_name: trade.trade,
      nsqf_level: trade.nsqf_level,
      sector: trade.sector,
      match_score: 95 - idx * 7,
      match_reason: `आपकी रुचि (${extractedProfile.aspirational_interest}) और स्थानीय मांग के आधार पर यह ट्रेड सर्वोत्तम है।`,
      pm_ajay_benefit: trade.gia_benefit,
      capital_subsidy: `₹${trade.capital_subsidy_inr.toLocaleString('en-IN')}`,
      training_duration: `${trade.duration_hours} घंटे (${Math.round(trade.duration_hours / 30)} सप्ताह)`,
      entry_qualification: trade.eligibility,
      career_path: trade.cluster_grant_applicable ? 'Self-Employed Micro-Enterprise' : 'Wage Employment Linkage',
      training_partner: 'राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम (NSFDC) मान्यता प्राप्त केंद्र',
    }));

  // Ensure at least 2 recommendations
  if (recommendations.length < 2) {
    const fallbackTrade = NSQF_TRADES_DATASET[0];
    recommendations.push({
      trade_id: fallbackTrade.id,
      trade_name: fallbackTrade.trade,
      nsqf_level: fallbackTrade.nsqf_level,
      sector: fallbackTrade.sector,
      match_score: 82,
      match_reason: 'उच्च स्थानीय मांग और ₹50,000 की सरकारी सब्सिडी के साथ उत्कृष्ट अवसर।',
      pm_ajay_benefit: fallbackTrade.gia_benefit,
      capital_subsidy: `₹${fallbackTrade.capital_subsidy_inr.toLocaleString('en-IN')}`,
      training_duration: `${fallbackTrade.duration_hours} घंटे`,
      entry_qualification: fallbackTrade.eligibility,
      career_path: 'Self-Employed Micro-Enterprise',
      training_partner: 'NSFDC प्रमाणित ग्रामीण कौशल केंद्र',
    });
  }

  // If spoken responses were not generated by AI, dynamically generate them based on the matched recommendations in user's selected language
  const topMatch = recommendations[0];
  if (!spokenEnglish) {
    spokenEnglish = `Greetings! Based on your interest, '${topMatch.trade_name}' (NSQF Level ${topMatch.nsqf_level}) is highly recommended under PM-AJAY with up to ${topMatch.capital_subsidy} capital subsidy and toolkit support. Would you like details on nearby training centers?`;
  }

  if (!spokenRegional) {
    if (preferredLanguage === 'pa') {
      spokenRegional = `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਹਾਡੀ ਰੁਚੀ ਅਨੁਸਾਰ PM-AJAY ਸਕੀਮ ਅਧੀਨ '${topMatch.trade_name}' (NSQF ਪੱਧਰ ${topMatch.nsqf_level}) ਸਭ ਤੋਂ ਢੁਕਵਾਂ ਕੋਰਸ ਹੈ। ਇਸ ਵਿੱਚ ${topMatch.capital_subsidy} ਤੱਕ ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਅਤੇ ਮੁਫ਼ਤ ਟੂਲਕਿੱਟ ਗ੍ਰਾਂਟ ਮਿਲਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਨੇੜਲੇ ਕੇਂਦਰ ਦੀ ਜਾਣਕਾਰੀ ਚਾਹੁੰਦੇ ਹੋ?`;
    } else if (preferredLanguage === 'mr') {
      spokenRegional = `नमस्कार! तुमच्या आवडीनुसार PM-AJAY योजनेअंतर्गत '${topMatch.trade_name}' (NSQF स्तर ${topMatch.nsqf_level}) हा सर्वोत्तम अभ्यासक्रम आहे. यामध्ये तुम्हाला ${topMatch.capital_subsidy} पर्यंत सरकारी अनुदान आणि मोफत टूलकिट मिळते.`;
    } else if (preferredLanguage === 'bn') {
      spokenRegional = `নমস্কার! আপনার আগ্রহের ভিত্তিতে PM-AJAY প্রকল্পের অধীনে '${topMatch.trade_name}' (NSQF স্তর ${topMatch.nsqf_level}) সবচেয়ে উপযুক্ত কোর্স। এতে আপনি ${topMatch.capital_subsidy} পর্যন্ত সরকারি অনুদান ও বিনামূল্যে টুলকিট পাবেন।`;
    } else if (preferredLanguage === 'ta') {
      spokenRegional = `வணக்கம்! உங்கள் விருப்பத்திற்கு ஏற்ப PM-AJAY திட்டத்தின் கீழ் '${topMatch.trade_name}' (NSQF நிலை ${topMatch.nsqf_level}) மிகவும் சிறந்த பாடநெறியாகும். இதில் ${topMatch.capital_subsidy} வரை அரசு மானியம் மற்றும் இலவச கருவித்தொகுப்பு வழங்கப்படுகிறது.`;
    } else if (preferredLanguage === 'te') {
      spokenRegional = `నమస్కారం! మీ ఆసక్తి మేరకు PM-AJAY పథకం కింద '${topMatch.trade_name}' (NSQF స్థాయి ${topMatch.nsqf_level}) అత్యంత అనుకూలమైన కోర్సు. ఇందులో మీకు ${topMatch.capital_subsidy} వరకు ప్రభుత్వ సబ్సిడీ మరియు ఉచిత టూల్‌కిట్ లభిస్తుంది.`;
    } else if (preferredLanguage === 'gu') {
      spokenRegional = `નમસ્તે! તમારી રુચિ મુજબ PM-AJAY યોજના હેઠળ '${topMatch.trade_name}' (NSQF સ્તર ${topMatch.nsqf_level}) શ્રેષ્ઠ કોર્સ છે. આમાં તમને ${topMatch.capital_subsidy} સુધીની સરકારી સબસિડી અને મફત ટૂલકિટ સહાય મળે છે.`;
    } else if (preferredLanguage === 'bho') {
      spokenRegional = `प्रणाम! रउवा पसंद के हिसाब से PM-AJAY योजना के तहत '${topMatch.trade_name}' (NSQF स्तर ${topMatch.nsqf_level}) सबसे बढ़िया कोर्स बा। एह में ${topMatch.capital_subsidy} तक के सरकारी सब्सिडी आ मुफ्त टूलकिट मिलेला।`;
    } else if (preferredLanguage === 'en') {
      spokenRegional = spokenEnglish;
    } else {
      spokenRegional = `नमस्ते! आपकी रुचि को ध्यान में रखते हुए, PM-AJAY योजना के तहत '${topMatch.trade_name}' (NSQF स्तर ${topMatch.nsqf_level}) आपके लिए सबसे उपयुक्त कोर्स है। इसमें आपको ${topMatch.capital_subsidy} तक की सरकारी सहायता व मुफ्त टूलकिट अनुदान मिलता है।`;
    }
  }

  // High-fidelity spoken audio synthesis in the user's selected regional language
  let outputAudioBase64: string | undefined;
  let outputAudioMimeType: string | undefined;

  const ttsText = preferredLanguage === 'en' ? (spokenEnglish || spokenRegional) : (spokenRegional || spokenEnglish);
  try {
    const langCodeMap: Record<string, string> = {
      hi: 'hi',
      bho: 'hi', // Bhojpuri phonetics
      mr: 'mr',
      pa: 'pa',
      bn: 'bn',
      ta: 'ta',
      te: 'te',
      gu: 'gu',
      en: 'en',
    };
    const tl = langCodeMap[preferredLanguage] || 'hi';
    const cleanText = ttsText.replace(/[*_#`"']/g, '').trim().substring(0, 200);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
    
    const audioRes = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (audioRes.ok) {
      const audioBuffer = await audioRes.arrayBuffer();
      outputAudioBase64 = Buffer.from(audioBuffer).toString('base64');
      outputAudioMimeType = 'audio/mpeg';
    }
  } catch (err) {
    console.warn("Server-side regional TTS generation failed, falling back to client synthesis:", err);
  }

  return {
    transcript: effectiveTranscript || userText || "आवाज इनपुट",
    detected_language: preferredLanguage,
    detected_intent: extractedProfile,
    recommendations,
    spoken_reply_text: spokenRegional,
    spoken_reply_english: spokenEnglish,
    audio_base64: outputAudioBase64,
    audio_mime_type: outputAudioMimeType,
  };
}
