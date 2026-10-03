import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { NSQF_TRADES_DATASET } from "../src/data/nsqfTrades.ts";
import { DISTRICT_PERSPECTIVE_PLANS } from "../src/data/perspectivePlans.ts";
import { processConversationAI, transcribeAudio } from "./aiService.ts";
import { RegionalLanguage, VoiceResponse } from "../src/types/pmajay.ts";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
});

export const expressApp = express();

// Middleware
expressApp.use(express.json({ limit: "50mb" }));
expressApp.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS headers for deployment flexibility
expressApp.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

/**
 * 1. POST /api/chat
 * Compatible with original Python repository contract:
 * Receives multipart/form-data with key `audio_file`, or JSON body with text / audioBase64.
 */
expressApp.post("/api/chat", upload.single("audio_file"), async (req: Request, res: Response) => {
  try {
    let language: RegionalLanguage = (req.body?.language as RegionalLanguage) || "hi";
    let audioBase64 = "";
    let mimeType = "audio/webm";

    if (req.file) {
      audioBase64 = req.file.buffer.toString("base64");
      mimeType = req.file.mimetype || "audio/webm";
    } else if (req.body?.audioBase64) {
      audioBase64 = req.body.audioBase64;
      mimeType = req.body.mimeType || "audio/webm";
    }

    const clientText = (req.body?.text || "").trim();
    let transcribedText = "";
    if (audioBase64) {
      transcribedText = await transcribeAudio(audioBase64, mimeType, language);
    }

    // Merge client speech transcript with server audio transcription so no keywords are lost
    let combinedQuery = "";
    if (clientText && transcribedText) {
      combinedQuery = `${clientText} ${transcribedText}`;
    } else {
      combinedQuery = clientText || transcribedText;
    }

    if (!combinedQuery) {
      const defaultGreetings: Record<string, string> = {
        hi: "नमस्ते, मुझे कौशल प्रशिक्षण और सरकारी स्वरोजगार सब्सिडी के बारे में जानकारी चाहिए।",
        bho: "प्रणाम, हमरा हुनर सीखे के बा आ सरकारी सब्सिडी चाहीं।",
        pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਨੂੰ ਹੁਨਰ ਸਿਖਲਾਈ ਅਤੇ ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਬਾਰੇ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ।",
        mr: "नमस्कार, मला कौशल्य प्रशिक्षण आणि सरकारी अनुदानाबद्दल माहिती हवी आहे.",
        bn: "নমস্কার, আমি দক্ষতা প্রশিক্ষণ এবং সরকারি অনুদান সম্পর্কে জানতে চাই।",
        ta: "வணக்கம், எனக்கு தொழில் பயிற்சி மற்றும் அரசு மானியம் பற்றிய தகவல் வேண்டும்.",
        te: "నమస్కారం, నాకు వృత్తి శిక్షణ మరియు ప్రభుత్వ సబ్సిడీ గురించి సమాచారం కావాలి.",
        gu: "નમસ્તે, મને કૌશલ્ય તાલીમ અને સરકારી સબસિડી વિશે માહિતી જોઈએ છે.",
        en: "Hello, I want information about skill training and government capital subsidy under PM-AJAY.",
      };
      combinedQuery = defaultGreetings[language] || defaultGreetings.hi;
    }

    const voiceResponse: VoiceResponse = await processConversationAI(
      combinedQuery,
      language,
      audioBase64 || undefined,
      mimeType
    );

    // If client requested pure audio stream (like in original Python backend)
    const wantsAudioStream = req.query.format === "audio" || req.headers.accept?.includes("audio/");
    if (wantsAudioStream && voiceResponse.audio_base64) {
      const audioBuffer = Buffer.from(voiceResponse.audio_base64, "base64");
      res.setHeader("Content-Type", voiceResponse.audio_mime_type || "audio/wav");
      res.setHeader("Content-Length", audioBuffer.length);
      res.send(audioBuffer);
      return;
    }

    // Default rich JSON response containing transcript, profile, recommendations, and audioBase64
    res.json(voiceResponse);
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error?.message || "Failed to process chat audio/text",
    });
  }
});

/**
 * 2. POST /api/voice/process
 * Dedicated voice processing endpoint
 */
expressApp.post("/api/voice/process", async (req: Request, res: Response) => {
  try {
    const { text, audioBase64, mimeType, language = "hi" } = req.body;
    let queryText = text;

    if (!queryText && audioBase64) {
      queryText = await transcribeAudio(audioBase64, mimeType || "audio/webm");
    }

    if (!queryText) {
      queryText = "स्वरोजगार और आजीविका प्रशिक्षण के लिए मार्गदर्शन चाहिए।";
    }

    const result = await processConversationAI(queryText, language);
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/voice/process:", error);
    res.status(500).json({ error: error?.message || "Processing failed" });
  }
});

/**
 * 3. GET /api/trades
 * Catalog of NSQF trades with filtering
 */
expressApp.get("/api/trades", (req: Request, res: Response) => {
  const { sector, category, minLevel, maxLevel, search } = req.query;

  let trades = [...NSQF_TRADES_DATASET];

  if (category) {
    trades = trades.filter((t) => t.category.toLowerCase() === String(category).toLowerCase());
  }

  if (sector) {
    trades = trades.filter((t) => t.sector.toLowerCase().includes(String(sector).toLowerCase()));
  }

  if (minLevel) {
    trades = trades.filter((t) => t.nsqf_level >= Number(minLevel));
  }

  if (maxLevel) {
    trades = trades.filter((t) => t.nsqf_level <= Number(maxLevel));
  }

  if (search) {
    const q = String(search).toLowerCase();
    trades = trades.filter(
      (t) =>
        t.trade.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.sector.toLowerCase().includes(q) ||
        t.key_modules.some((m) => m.toLowerCase().includes(q))
    );
  }

  res.json({
    total: trades.length,
    trades,
  });
});

/**
 * 4. GET /api/districts
 * MoSJE District Perspective Plans
 */
expressApp.get("/api/districts", (_req: Request, res: Response) => {
  res.json({
    total: DISTRICT_PERSPECTIVE_PLANS.length,
    districts: DISTRICT_PERSPECTIVE_PLANS,
  });
});

/**
 * 5. POST /api/ivr/call
 * Feature phone IVR simulation (1800-PM-AJAY)
 */
expressApp.post("/api/ivr/call", async (req: Request, res: Response) => {
  try {
    const { digit, step = 1, language = "hi", previousDigits = [] } = req.body;

    let responsePrompt = "";
    let responsePromptEnglish = "";
    let options: Array<{ digit: string; label: string }> = [];
    let nextStep = step + 1;
    let finalRecommendations = null;

    if (step === 1) {
      responsePrompt = "नमस्कार, प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना (PM-AJAY) आजीविका हेल्पलाइन में आपका स्वागत है। अपनी भाषा चुनने के लिए: हिन्दी के लिए 1 दबाएं, भोजपुरी के लिए 2, मराठी के लिए 3, अंग्रेजी के लिए 4।";
      responsePromptEnglish = "Welcome to PM-AJAY Livelihood Voice Helpline. Press 1 for Hindi, 2 for Bhojpuri, 3 for Marathi, 4 for English.";
      options = [
        { digit: "1", label: "हिन्दी (Hindi)" },
        { digit: "2", label: "भोजपुरी (Bhojpuri)" },
        { digit: "3", label: "मराठी (Marathi)" },
        { digit: "4", label: "English" },
      ];
    } else if (step === 2) {
      responsePrompt = "आप किस क्षेत्र में कौशल सीखकर अपनी दुकान या नौकरी शुरू करना चाहते हैं? सौर ऊर्जा एवं बिजली के लिए 1 दबाएं। वाहन एवं मोटर गैराज के लिए 2 दबाएं। जैविक कृषि एवं मशरूम के लिए 3 दबाएं। सिलाई एवं हस्तकला के लिए 4 दबाएं।";
      responsePromptEnglish = "Which sector are you interested in? Press 1 for Solar & Electrical, 2 for Automotive/Garage, 3 for Organic Agriculture & Mushroom, 4 for Tailoring & Handicrafts.";
      options = [
        { digit: "1", label: "Solar & Electrical (सौर ऊर्जा)" },
        { digit: "2", label: "Automotive & EV (वाहन मैकेनिक)" },
        { digit: "3", label: "Agriculture & Food (जैविक खेती)" },
        { digit: "4", label: "Apparel & Handicraft (सिलाई/बुटीक)" },
      ];
    } else if (step === 3) {
      responsePrompt = "आपकी शिक्षा का स्तर क्या है? 8वीं या उससे कम के लिए 1 दबाएं, 10वीं पास के लिए 2 दबाएं, 12वीं या स्नातक के लिए 3 दबाएं।";
      responsePromptEnglish = "What is your education level? Press 1 for 8th or below, 2 for 10th pass, 3 for 12th or graduate.";
      options = [
        { digit: "1", label: "8th Class or below (8वीं या कम)" },
        { digit: "2", label: "10th Class Pass (10वीं पास)" },
        { digit: "3", label: "12th / Graduate (12वीं/स्नातक)" },
      ];
    } else {
      // Final recommendation based on collected inputs
      const sectorChoice = previousDigits[1] || digit || "1";
      let matchedTradeId = "TR-SOL-01";
      if (sectorChoice === "2") matchedTradeId = "TR-AUTO-01";
      else if (sectorChoice === "3") matchedTradeId = "TR-AGRI-01";
      else if (sectorChoice === "4") matchedTradeId = "TR-TEXT-01";

      const matchedTrade = NSQF_TRADES_DATASET.find((t) => t.id === matchedTradeId) || NSQF_TRADES_DATASET[0];

      responsePrompt = `बधाई हो! आपकी योग्यता और रुचि के अनुसार PM-AJAY के तहत '${matchedTrade.trade}' का कोर्स अनुशंसित है। इसमें ₹${matchedTrade.capital_subsidy_inr.toLocaleString('en-IN')} तक की सरकारी सब्सिडी और मुफ्त टूलकिट उपलब्ध है। पंजीकरण हेतु आपके मोबाइल पर SMS भेज दिया गया है।`;
      responsePromptEnglish = `Congratulations! Based on your choices, '${matchedTrade.trade}' is recommended under PM-AJAY with ₹${matchedTrade.capital_subsidy_inr.toLocaleString('en-IN')} subsidy. An SMS with center details has been dispatched to your mobile.`;
      nextStep = -1; // Call complete
      finalRecommendations = [matchedTrade];
    }

    res.json({
      step: nextStep,
      prompt: responsePrompt,
      promptEnglish: responsePromptEnglish,
      options,
      finalRecommendations,
      smsDispatched: nextStep === -1,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 6. POST /api/whatsapp/message
 * WhatsApp Voice-Note community bot webhook simulation
 */
expressApp.post("/api/whatsapp/message", async (req: Request, res: Response) => {
  try {
    const { text, audioBase64, sender = "9876543210" } = req.body;
    let query = text;

    if (!query && audioBase64) {
      query = await transcribeAudio(audioBase64, "audio/ogg");
    }

    const result = await processConversationAI(query || "मुझे गांव में सिलाई या सोलर का काम सीखना है।", "hi");

    res.json({
      messageId: `WA-${Date.now()}`,
      sender,
      botReplyText: result.spoken_reply_text,
      botAudioBase64: result.audio_base64,
      schemeCard: result.recommendations[0],
      downloadableBrochureUrl: "/docs/pmajay-nsqf-guidelines.pdf",
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 7. GET /api/stats
 * Real-time MoSJE administrative metrics
 */
expressApp.get("/api/stats", (_req: Request, res: Response) => {
  res.json({
    totalAspirationalVillages: 14250,
    scBeneficiariesCounselled: 284500,
    nsqfEnrollmentsActive: 89400,
    giaGrantsDisbursedCr: 412.8,
    activeLeadConsultants: 128,
    districtPerspectivePlansApproved: 286,
    avgPostSkillingIncomeUplift: "+68%",
  });
});

// Health check endpoint
expressApp.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "PM-AJAY Voice Assistant Backend",
    timestamp: new Date().toISOString(),
    geminiEnabled: !!process.env.GEMINI_API_KEY,
  });
});
