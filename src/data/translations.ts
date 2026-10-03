import { RegionalLanguage } from '../types/pmajay';

export interface QuickPromptItem {
  id: string;
  icon: string;
  label: string;
  promptText: string;
  tradeId: string;
  colorClass: string;
}

export interface KioskTranslation {
  langName: string;
  channelBadge: string;
  heading: string;
  subheading: string;
  tapToSpeak: string;
  listening: string;
  thinking: string;
  tapMicBtn: string;
  stopBtn: string;
  supportedLanguagesNote: string;
  inputPlaceholder: string;
  evaluateBtn: string;
  quickTestingHeading: string;
  dspActiveBadge: string;
  noSpeechDetected: string;
  speechClarifyPrompt: string;
  quickPrompts: QuickPromptItem[];
}

export const KIOSK_TRANSLATIONS: Record<RegionalLanguage, KioskTranslation> = {
  hi: {
    langName: "हिन्दी (Hindi)",
    channelBadge: "चैनल 1: ग्राम पंचायत कियोस्क एवं मोबाइल वॉइस सहायक",
    heading: "आवाज से आजीविका और कौशल खोजें",
    subheading: "अपनी शिक्षा, अनुभव या पसंद के काम के बारे में अपनी भाषा में बताएं। कोई फॉर्म भरने की आवश्यकता नहीं है।",
    tapToSpeak: "माइक बटन दबाएं और अपनी भाषा में बोलें (Tap mic to speak)",
    listening: "सुन रहे हैं... कृपया अपनी शिक्षा और पसंद का काम बताएं",
    thinking: "PM-AJAY एआई मॉडल आपकी आवाज और कौशल का विश्लेषण कर रहा है...",
    tapMicBtn: "बोलें (Speak)",
    stopBtn: "रोकें (Stop)",
    supportedLanguagesNote: "हिन्दी, भोजपुरी, पंजाबी, मराठी, बांग्ला, तमिल, तेलुगु और अंग्रेजी में पूरी तरह समर्थित।",
    inputPlaceholder: "अपनी पसंद का काम या शिक्षा लिखें (उदा. मुझे सिलाई का काम सीखना है)...",
    evaluateBtn: "मूल्यांकन करें",
    quickTestingHeading: "तुरंत किसी भी ट्रेड का परीक्षण करें (One-Tap Trade Testing):",
    dspActiveBadge: "DSP नॉइज़ फ़िल्टर सक्रिय (85Hz High-Pass + Echo Cancel)",
    noSpeechDetected: "माइक्रोफोन में कोई आवाज़ नहीं मिली। कृपया थोड़ा ज़ोर से बोलें या नीचे दिए ट्रेड बटन का उपयोग करें।",
    speechClarifyPrompt: "आपकी आवाज़ में ट्रेड का स्पष्ट नाम नहीं मिला। कृपया स्पष्ट बोलें (जैसे: बिजली, सिलाई, बाइक मैकेनिक, सोलर, मुर्गी पालन)।",
    quickPrompts: [
      {
        id: 'poultry',
        icon: '🐔',
        label: 'मुर्गी पालन (Poultry)',
        promptText: 'मुझे मुर्गी पालन और पोल्ट्री फार्मिंग का व्यवसाय शुरू करना है।',
        tradeId: 'TR-AGRI-04',
        colorClass: 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border-amber-300'
      },
      {
        id: 'tailoring',
        icon: '👗',
        label: 'सिलाई व बुटीक (Tailoring)',
        promptText: 'मुझे घर पर सिलाई का काम और बुटीक केंद्र शुरू करना है।',
        tradeId: 'TR-TEXT-01',
        colorClass: 'bg-pink-100/70 hover:bg-pink-200/80 text-pink-900 border-pink-300'
      },
      {
        id: 'bike',
        icon: '🏍️',
        label: 'बाइक मैकेनिक (Garage)',
        promptText: 'मुझे दोपहिया बाइक और ई-रिक्शा रिपेयर गैराज की ट्रेनिंग चाहिए।',
        tradeId: 'TR-AUTO-01',
        colorClass: 'bg-blue-100/70 hover:bg-blue-200/80 text-blue-900 border-blue-300'
      },
      {
        id: 'data_entry',
        icon: '💻',
        label: 'डाटा एंट्री (Data Entry)',
        promptText: 'मैंने 12वीं पास की है, मुझे कंप्यूटर टाइपिंग व डाटा एंट्री का काम सीखना है।',
        tradeId: 'TR-IT-01',
        colorClass: 'bg-indigo-100/70 hover:bg-indigo-200/80 text-indigo-900 border-indigo-300'
      },
      {
        id: 'compost',
        icon: '🌿',
        label: 'जैविक खाद व मशरूम',
        promptText: 'मुझे जैविक खाद और मशरूम उत्पादन की ट्रेनिंग लेनी है।',
        tradeId: 'TR-AGRI-01',
        colorClass: 'bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 border-emerald-300'
      },
      {
        id: 'solar',
        icon: '☀️',
        label: 'सोलर पैनल (Solar PV)',
        promptText: 'मुझे सोलर पैनल इंस्टॉलेशन और सौर ऊर्जा का काम सीखना है।',
        tradeId: 'TR-SOL-01',
        colorClass: 'bg-orange-100/70 hover:bg-orange-200/80 text-orange-900 border-orange-300'
      },
      {
        id: 'electrician',
        icon: '⚡',
        label: 'बिजली मिस्त्री (Electrician)',
        promptText: 'मुझे घरेलू बिजली की वायरिंग और पंखा मोटर ठीक करना सीखना है।',
        tradeId: 'TR-ELEC-01',
        colorClass: 'bg-yellow-100/70 hover:bg-yellow-200/80 text-yellow-900 border-yellow-300'
      },
      {
        id: 'dairy',
        icon: '🥛',
        label: 'डेयरी फार्मिंग (Dairy)',
        promptText: 'मुझे गाय भैंस का डेयरी फार्म और दूध का व्यवसाय शुरू करना है।',
        tradeId: 'TR-AGRI-03',
        colorClass: 'bg-cyan-100/70 hover:bg-cyan-200/80 text-cyan-900 border-cyan-300'
      },
      {
        id: 'healthcare',
        icon: '🏥',
        label: 'अस्पताल सहायक (Healthcare)',
        promptText: 'मुझे अस्पताल में मरीज की देखभाल और नर्सिंग सहायक का काम सीखना है।',
        tradeId: 'TR-HEALTH-01',
        colorClass: 'bg-teal-100/70 hover:bg-teal-200/80 text-teal-900 border-teal-300'
      },
      {
        id: 'plumber',
        icon: '🚰',
        label: 'प्लंबर (Plumber)',
        promptText: 'मुझे नल फिटिंग, प्लंबिंग और जल जीवन मिशन में काम सीखना है।',
        tradeId: 'TR-PLUMB-01',
        colorClass: 'bg-sky-100/70 hover:bg-sky-200/80 text-sky-900 border-sky-300'
      }
    ]
  },

  bho: {
    langName: "भोजपुरी (Bhojpuri)",
    channelBadge: "चैनल 1: ग्राम पंचायत कियोस्क आ मोबाइल आवाज सहायक",
    heading: "आवाज से रोजी-रोटी आ हुनर खोजीं",
    subheading: "आपन पढ़ाई, अनुभव या पसंद के काम के बारे में आपन भाषा में बताईं। कौनों फार्म भरे के जरूरत नइखे।",
    tapToSpeak: "माइक बटन दबाईं आ आपन भाषा में बोलीं (Tap mic to speak)",
    listening: "सुनत बानी... आपन पढ़ाई आ पसंद के काम बताईं",
    thinking: "PM-AJAY मॉडल रउवा आवाज आ हुनर के जांच करत बा...",
    tapMicBtn: "बोलीं (Speak)",
    stopBtn: "रोकीं (Stop)",
    supportedLanguagesNote: "भोजपुरी, हिन्दी, पंजाबी, मराठी आ बाकी भाषन में उपलब्ध बा।",
    inputPlaceholder: "आपन मनपसंद काम या पढ़ाई लिखीं (जइसे: हमरा सिलाई सीखे के बा)...",
    evaluateBtn: "जांच करीं",
    quickTestingHeading: "तुरंते कौनों भी काम के जांच करीं (One-Tap Trade Testing):",
    dspActiveBadge: "DSP आवाज फिल्टर चालू बा (85Hz High-Pass + Echo Cancel)",
    noSpeechDetected: "माइक्रोफोन में कौनों आवाज ना मिलल। तनी तेज आवाज में बोलीं या नीचे दिहल बटन दबाईं।",
    speechClarifyPrompt: "आवाज में काम के नाम साफ ना मिलल। कृपया साफ बोलीं (जइसे: बिजली, सिलाई, गैराज, सोलर, मुर्गी पालन)।",
    quickPrompts: [
      {
        id: 'poultry',
        icon: '🐔',
        label: 'मुर्गी पालन (Poultry)',
        promptText: 'हमरा मुर्गी पालन आ ब्रायलर फार्मिंग के काम शुरू करे के बा।',
        tradeId: 'TR-AGRI-04',
        colorClass: 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border-amber-300'
      },
      {
        id: 'tailoring',
        icon: '👗',
        label: 'सिलाई आ बुटीक (Tailoring)',
        promptText: 'हमरा घरे सिलाई कटिंग आ बुटीक के काम सीखे के बा।',
        tradeId: 'TR-TEXT-01',
        colorClass: 'bg-pink-100/70 hover:bg-pink-200/80 text-pink-900 border-pink-300'
      },
      {
        id: 'bike',
        icon: '🏍️',
        label: 'मोटर गैराज (Garage)',
        promptText: 'हमरा ट्रैक्टर, मोटर साइकिल आ ई-रिक्शा बनावे के काम सीखे के बा।',
        tradeId: 'TR-AUTO-01',
        colorClass: 'bg-blue-100/70 hover:bg-blue-200/80 text-blue-900 border-blue-300'
      },
      {
        id: 'data_entry',
        icon: '💻',
        label: 'कंप्यूटर टाइपिंग (Data Entry)',
        promptText: 'हम 12वीं पास बानी, हमरा कंप्यूटर टाइपिंग आ डाटा एंट्री सीखे के बा।',
        tradeId: 'TR-IT-01',
        colorClass: 'bg-indigo-100/70 hover:bg-indigo-200/80 text-indigo-900 border-indigo-300'
      },
      {
        id: 'compost',
        icon: '🌿',
        label: 'केंचुआ खाद आ मशरूम',
        promptText: 'हमरा जैविक केंचुआ खाद आ मशरूम उगावे के ट्रेनिंग चाहीं।',
        tradeId: 'TR-AGRI-01',
        colorClass: 'bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 border-emerald-300'
      },
      {
        id: 'solar',
        icon: '☀️',
        label: 'सोलर पैनल (Solar PV)',
        promptText: 'हमरा सोलर पैनल लगावे आ सौर ऊर्जा के काम सीखे के बा।',
        tradeId: 'TR-SOL-01',
        colorClass: 'bg-orange-100/70 hover:bg-orange-200/80 text-orange-900 border-orange-300'
      },
      {
        id: 'electrician',
        icon: '⚡',
        label: 'बिजली मिस्त्री (Electrician)',
        promptText: 'हमरा घरे के बिजली वायरिंग, पंखा आ मोटर बनावे के काम सीखे के बा।',
        tradeId: 'TR-ELEC-01',
        colorClass: 'bg-yellow-100/70 hover:bg-yellow-200/80 text-yellow-900 border-yellow-300'
      },
      {
        id: 'dairy',
        icon: '🥛',
        label: 'डेयरी फार्मिंग (Dairy)',
        promptText: 'हमरा गाय भैंस के डेयरी फार्म आ दूध के धंधा शुरू करे के बा।',
        tradeId: 'TR-AGRI-03',
        colorClass: 'bg-cyan-100/70 hover:bg-cyan-200/80 text-cyan-900 border-cyan-300'
      },
      {
        id: 'healthcare',
        icon: '🏥',
        label: 'अस्पताल तीमारदार (Healthcare)',
        promptText: 'हमरा अस्पताल में मरीज के देखभाल आ नर्सिंग सहायक के काम सीखे के बा।',
        tradeId: 'TR-HEALTH-01',
        colorClass: 'bg-teal-100/70 hover:bg-teal-200/80 text-teal-900 border-teal-300'
      },
      {
        id: 'plumber',
        icon: '🚰',
        label: 'नल फिटिंग प्लंबर (Plumber)',
        promptText: 'हमरा नल फिटिंग, पाइपलाइन आ जल जीवन मिशन में काम सीखे के बा।',
        tradeId: 'TR-PLUMB-01',
        colorClass: 'bg-sky-100/70 hover:bg-sky-200/80 text-sky-900 border-sky-300'
      }
    ]
  },

  pa: {
    langName: "ਪੰਜਾਬੀ (Punjabi)",
    channelBadge: "ਚੈਨਲ 1: ਪਿੰਡ ਪੰਚਾਇਤ ਕਿਓਸਕ ਅਤੇ ਮੋਬਾਈਲ ਵਾਇਸ ਸਹਾਇਕ",
    heading: "ਆਵਾਜ਼ ਰਾਹੀਂ ਰੋਜ਼ੀ-ਰੋਟੀ ਅਤੇ ਹੁਨਰ ਲੱਭੋ",
    subheading: "ਆਪਣੀ ਪੜ੍ਹਾਈ, ਤਜ਼ਰਬੇ ਜਾਂ ਪਸੰਦ ਦੇ ਕੰਮ ਬਾਰੇ ਆਪਣੀ ਮਾਂ-ਬੋਲੀ ਵਿੱਚ ਦੱਸੋ। ਕੋਈ ਫਾਰਮ ਭਰਨ ਦੀ ਲੋੜ ਨਹੀਂ।",
    tapToSpeak: "ਮਾਈਕ ਬਟਨ ਦਬਾਓ ਅਤੇ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਬੋਲੋ (Tap mic to speak)",
    listening: "ਸੁਣ ਰਹੇ ਹਾਂ... ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਪੜ੍ਹਾਈ ਅਤੇ ਪਸੰਦ ਦਾ ਕੰਮ ਦੱਸੋ",
    thinking: "PM-AJAY ਏਆਈ ਮਾਡਲ ਤੁਹਾਡੀ ਆਵਾਜ਼ ਅਤੇ ਹੁਨਰ ਦੀ ਜਾਂਚ ਕਰ ਰਿਹਾ ਹੈ...",
    tapMicBtn: "ਬੋਲੋ (Speak)",
    stopBtn: "ਰੋਕੋ (Stop)",
    supportedLanguagesNote: "ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਮਰਾਠੀ, ਬੰਗਾਲੀ ਅਤੇ ਹੋਰ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ।",
    inputPlaceholder: "ਆਪਣੀ ਪਸੰਦ ਦਾ ਕੰਮ ਜਾਂ ਪੜ੍ਹਾਈ ਲਿਖੋ (ਜਿਵੇਂ: ਮੈਨੂੰ ਡੇਅਰੀ ਫਾਰਮਿੰਗ ਸਿੱਖਣੀ ਹੈ)...",
    evaluateBtn: "ਜਾਂਚ ਕਰੋ",
    quickTestingHeading: "ਤੁਰੰਤ ਕਿਸੇ ਵੀ ਕਿੱਤੇ ਦੀ ਪਰਖ ਕਰੋ (One-Tap Trade Testing):",
    dspActiveBadge: "DSP ਸ਼ੋਰ ਫਿਲਟਰ ਚਾਲੂ (85Hz High-Pass + Echo Cancel)",
    noSpeechDetected: "ਮਾਈਕ੍ਰੋਫੋਨ ਵਿੱਚ ਕੋਈ ਆਵਾਜ਼ ਨਹੀਂ ਮਿਲੀ। ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹਾ ਉੱਚੀ ਬੋਲੋ ਜਾਂ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨ ਦਬਾਓ।",
    speechClarifyPrompt: "ਆਵਾਜ਼ ਵਿੱਚ ਕਿੱਤੇ ਦਾ ਨਾਮ ਸਪਸ਼ਟ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਸਾਫ਼ ਬੋਲੋ (ਜਿਵੇਂ: ਡੇਅਰੀ, ਬਿਜਲੀ, ਸਿਲਾਈ, ਗੈਰਾਜ, ਸੋਲਰ)।",
    quickPrompts: [
      {
        id: 'poultry',
        icon: '🐔',
        label: 'ਮੁਰਗੀ ਪਾਲਣ (Poultry)',
        promptText: 'ਮੈਂ ਮੁਰਗੀ ਪਾਲਣ ਅਤੇ ਪੋਲਟਰੀ ਫਾਰਮਿੰਗ ਦਾ ਕੰਮ ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।',
        tradeId: 'TR-AGRI-04',
        colorClass: 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border-amber-300'
      },
      {
        id: 'tailoring',
        icon: '👗',
        label: 'ਸਿਲਾਈ ਤੇ ਬੁਟੀਕ (Tailoring)',
        promptText: 'ਮੈਨੂੰ ਘਰ ਵਿੱਚ ਸਿਲਾਈ ਅਤੇ ਬੁਟੀਕ ਦਾ ਕੰਮ ਸਿੱਖਣਾ ਹੈ ਤਾਂ ਜੋ ਆਪਣਾ ਕੰਮ ਸ਼ੁਰੂ ਕਰ ਸਕਾਂ।',
        tradeId: 'TR-TEXT-01',
        colorClass: 'bg-pink-100/70 hover:bg-pink-200/80 text-pink-900 border-pink-300'
      },
      {
        id: 'bike',
        icon: '🏍️',
        label: 'ਬਾਈਕ ਮਕੈਨਿਕ (Garage)',
        promptText: 'ਮੈਨੂੰ ਦੋਪਹੀਆ ਮੋਟਰਸਾਈਕਲ ਅਤੇ ਈ-ਰਿਕਸ਼ਾ ਰਿਪੇਅਰ ਦਾ ਕੰਮ ਸਿੱਖਣਾ ਹੈ।',
        tradeId: 'TR-AUTO-01',
        colorClass: 'bg-blue-100/70 hover:bg-blue-200/80 text-blue-900 border-blue-300'
      },
      {
        id: 'data_entry',
        icon: '💻',
        label: 'ਡਾਟਾ ਐਂਟਰੀ (Data Entry)',
        promptText: 'ਮੈਂ 12ਵੀਂ ਪਾਸ ਕੀਤੀ ਹੈ, ਮੈਨੂੰ ਕੰਪਿਊਟਰ ਟਾਈਪਿੰਗ ਅਤੇ ਡਾਟਾ ਐਂਟਰੀ ਦਾ ਕੰਮ ਸਿੱਖਣਾ ਹੈ।',
        tradeId: 'TR-IT-01',
        colorClass: 'bg-indigo-100/70 hover:bg-indigo-200/80 text-indigo-900 border-indigo-300'
      },
      {
        id: 'compost',
        icon: '🌿',
        label: 'ਜੈਵਿਕ ਖਾਦ ਤੇ ਖੁੰਬਾਂ',
        promptText: 'ਮੈਨੂੰ ਜੈਵਿਕ ਵਰਮੀ-ਕੰਪੋਸਟ ਖਾਦ ਅਤੇ ਖੁੰਬਾਂ ਦੀ ਕਾਸ਼ਤ ਦੀ ਸਿਖਲਾਈ ਚਾਹੀਦੀ ਹੈ।',
        tradeId: 'TR-AGRI-01',
        colorClass: 'bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 border-emerald-300'
      },
      {
        id: 'solar',
        icon: '☀️',
        label: 'ਸੋਲਰ ਪੈਨਲ (Solar PV)',
        promptText: 'ਮੈਨੂੰ ਸੋਲਰ ਪੈਨਲ ਇੰਸਟਾਲੇਸ਼ਨ ਅਤੇ ਸੋਲਰ ਵਾਟਰ ਪੰਪ ਦਾ ਕੰਮ ਸਿੱਖਣਾ ਹੈ।',
        tradeId: 'TR-SOL-01',
        colorClass: 'bg-orange-100/70 hover:bg-orange-200/80 text-orange-900 border-orange-300'
      },
      {
        id: 'electrician',
        icon: '⚡',
        label: 'ਬਿਜਲੀ ਮਿਸਤਰੀ (Electrician)',
        promptText: 'ਮੈਨੂੰ ਘਰੇਲੂ ਬਿਜਲੀ ਵਾਇਰਿੰਗ ਅਤੇ ਪੱਖਾ ਮੋਟਰ ਠੀਕ ਕਰਨ ਦਾ ਕੰਮ ਸਿੱਖਣਾ ਹੈ।',
        tradeId: 'TR-ELEC-01',
        colorClass: 'bg-yellow-100/70 hover:bg-yellow-200/80 text-yellow-900 border-yellow-300'
      },
      {
        id: 'dairy',
        icon: '🥛',
        label: 'ਡੇਅਰੀ ਫਾਰਮਿੰਗ (Dairy)',
        promptText: 'ਮੈਂ 10ਵੀਂ ਪਾਸ ਕੀਤੀ ਹੈ ਅਤੇ ਮੈਨੂੰ ਡੇਅਰੀ ਫਾਰਮਿੰਗ ਅਤੇ ਪਸ਼ੂ ਪਾਲਣ ਦਾ ਸਿਖਲਾਈ ਕੋਰਸ ਚਾਹੀਦਾ ਹੈ।',
        tradeId: 'TR-AGRI-03',
        colorClass: 'bg-cyan-100/70 hover:bg-cyan-200/80 text-cyan-900 border-cyan-300'
      },
      {
        id: 'healthcare',
        icon: '🏥',
        label: 'ਹਸਪਤਾਲ ਸਹਾਇਕ (Healthcare)',
        promptText: 'ਮੈਨੂੰ ਹਸਪਤਾਲ ਵਿੱਚ ਮਰੀਜ਼ ਦੀ ਦੇਖਭਾਲ ਅਤੇ ਨਰਸਿੰਗ ਸਹਾਇਕ ਦਾ ਕੰਮ ਸਿੱਖਣਾ ਹੈ।',
        tradeId: 'TR-HEALTH-01',
        colorClass: 'bg-teal-100/70 hover:bg-teal-200/80 text-teal-900 border-teal-300'
      },
      {
        id: 'plumber',
        icon: '🚰',
        label: 'ਪਲੰਬਰ (Plumber)',
        promptText: 'ਮੈਨੂੰ ਨਲ ਫਿਟਿੰਗ, ਪਲੰਬਿੰਗ ਅਤੇ ਪਾਈਪਲਾਈਨ ਦਾ ਕੰਮ ਸਿੱਖਣਾ ਹੈ।',
        tradeId: 'TR-PLUMB-01',
        colorClass: 'bg-sky-100/70 hover:bg-sky-200/80 text-sky-900 border-sky-300'
      }
    ]
  },

  mr: {
    langName: "मराठी (Marathi)",
    channelBadge: "चॅनेल 1: ग्रामपंचायत किऑस्क आणि मोबाईल व्हॉईਸ सहाय्यक",
    heading: "आवाजाद्वारे उपजीविका आणि कौशल्ये शोधा",
    subheading: "तुमचे शिक्षण, अनुभव किंवा आवडीच्या कामाबद्दल तुमच्या भाषेत सांगा. कोणताही फॉर्म भरण्याची गरज नाही.",
    tapToSpeak: "माईक बटण दाबा आणि तुमच्या भाषेत बोला (Tap mic to speak)",
    listening: "ऐकत आहोत... कृपया तुमचे शिक्षण आणि आवडीचे काम सांगा",
    thinking: "PM-AJAY एआय मॉडेल तुमचा आवाज आणि कौशल्यांचे विश्लेषण करत आहे...",
    tapMicBtn: "बोला (Speak)",
    stopBtn: "थांबवा (Stop)",
    supportedLanguagesNote: "मराठी, हिन्दी, इंग्रजी आणि इतर सर्व भाषांमध्ये पूर्णपणे उपलब्ध.",
    inputPlaceholder: "तुमच्या आवडीचे काम किंवा शिक्षण लिहा (उदा. मला शिलाई काम शिकायचे आहे)...",
    evaluateBtn: "मूल्यांकन करा",
    quickTestingHeading: "एका क्लिकवर कोणत्याही व्यवसायाची चाचणी घ्या (One-Tap Trade Testing):",
    dspActiveBadge: "DSP आवाज फिल्टर सक्रिय (85Hz High-Pass + Echo Cancel)",
    noSpeechDetected: "मायक्रोफोनमध्ये कोणताही आवाज आला नाही. कृपया थोडे स्पष्ट बोला किंवा खालील बटण दाबा.",
    speechClarifyPrompt: "आवाजात व्यवसायाचे नाव स्पष्ट आले नाही. कृपया स्पष्ट बोला (उदा: शिलाई, वीज काम, गॅरेज, सोलर, कुक्कुटपालन).",
    quickPrompts: [
      {
        id: 'poultry',
        icon: '🐔',
        label: 'कुक्कुटपालन (Poultry)',
        promptText: 'मला कुक्कुटपालन आणि पोल्ट्री फार्मिंगचा व्यवसाय सुरू करायचा आहे.',
        tradeId: 'TR-AGRI-04',
        colorClass: 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border-amber-300'
      },
      {
        id: 'tailoring',
        icon: '👗',
        label: 'शिलाई व बुटीक (Tailoring)',
        promptText: 'मला घरगुती शिलाई आणि बुटीक केंद्र सुरू करण्यासाठी प्रशिक्षण हवे आहे.',
        tradeId: 'TR-TEXT-01',
        colorClass: 'bg-pink-100/70 hover:bg-pink-200/80 text-pink-900 border-pink-300'
      },
      {
        id: 'bike',
        icon: '🏍️',
        label: 'बाईक मेकॅनिक (Garage)',
        promptText: 'मला दुचाकी मोटारसायकल आणि ई-रिक्षा दुरुस्तीचे काम शिकायचे आहे.',
        tradeId: 'TR-AUTO-01',
        colorClass: 'bg-blue-100/70 hover:bg-blue-200/80 text-blue-900 border-blue-300'
      },
      {
        id: 'data_entry',
        icon: '💻',
        label: 'डेटा एंट्री (Data Entry)',
        promptText: 'मी 12वी उत्तीर्ण आहे, मला संगणक टायपिंग आणि डेटा एंट्रीचे काम शिकायचे आहे.',
        tradeId: 'TR-IT-01',
        colorClass: 'bg-indigo-100/70 hover:bg-indigo-200/80 text-indigo-900 border-indigo-300'
      },
      {
        id: 'compost',
        icon: '🌿',
        label: 'गांडूळ खत व अळंबी',
        promptText: 'माझे 10वी पर्यंत शिक्षण झाले आहे. मला शेतीसोबत गांडूळ खत आणि सेंद्रिय शेतीचा व्यवसाय सुरू करायचा आहे.',
        tradeId: 'TR-AGRI-01',
        colorClass: 'bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 border-emerald-300'
      },
      {
        id: 'solar',
        icon: '☀️',
        label: 'सौर ऊर्जा पॅनेल (Solar PV)',
        promptText: 'मी १० वी उत्तीर्ण आहे आणि मला सौर ऊर्जा पॅनेल किंवा वायरिंगचे काम शिकायचे आहे.',
        tradeId: 'TR-SOL-01',
        colorClass: 'bg-orange-100/70 hover:bg-orange-200/80 text-orange-900 border-orange-300'
      },
      {
        id: 'electrician',
        icon: '⚡',
        label: 'इलेक्ट्रीशियन (Electrician)',
        promptText: 'मला घरगुती वायरिंग आणि मोटार दुरुस्तीचे काम शिकायचे आहे.',
        tradeId: 'TR-ELEC-01',
        colorClass: 'bg-yellow-100/70 hover:bg-yellow-200/80 text-yellow-900 border-yellow-300'
      },
      {
        id: 'dairy',
        icon: '🥛',
        label: 'डेअरी फार्मिंग (Dairy)',
        promptText: 'मला गाय-म्हशींचे डेअरी फार्म आणि दूध प्रक्रिया व्यवसाय सुरू करायचा आहे.',
        tradeId: 'TR-AGRI-03',
        colorClass: 'bg-cyan-100/70 hover:bg-cyan-200/80 text-cyan-900 border-cyan-300'
      },
      {
        id: 'healthcare',
        icon: '🏥',
        label: 'आरोग्य सहाय्यक (Healthcare)',
        promptText: 'मला रुग्णालयात रुग्णांची काळजी आणि नर्सिंग सहाय्यकाचे काम शिकायचे आहे.',
        tradeId: 'TR-HEALTH-01',
        colorClass: 'bg-teal-100/70 hover:bg-teal-200/80 text-teal-900 border-teal-300'
      },
      {
        id: 'plumber',
        icon: '🚰',
        label: 'प्लंबर (Plumber)',
        promptText: 'मला नळ जोडणी, प्लंबिंग आणि जल जीवन मिशनमध्ये काम शिकायचे आहे.',
        tradeId: 'TR-PLUMB-01',
        colorClass: 'bg-sky-100/70 hover:bg-sky-200/80 text-sky-900 border-sky-300'
      }
    ]
  },

  bn: {
    langName: "বাংলা (Bengali)",
    channelBadge: "চ্যানেল ১: গ্রাম পঞ্চায়েত কিয়স্ক এবং মোবাইল ভয়েਸ সহকারী",
    heading: "কণ্ঠস্বরের মাধ্যমে জীবিকা ও দক্ষতা খুঁজুন",
    subheading: "আপনার শিক্ষা, অভিজ্ঞতা বা পছন্দের কাজের কথা আপনার নিজের ভাষায় বলুন। কোনো ফর্ম পূরণ করতে হবে না।",
    tapToSpeak: "মাইক বোতামে চাপ দিন এবং নিজের ভাষায় বলুন (Tap mic to speak)",
    listening: "শুনছি... দয়া করে আপনার শিক্ষা ও পছন্দের কাজের কথা বলুন",
    thinking: "PM-AJAY এআই মডেল আপনার কণ্ঠস্বর ও দক্ষতার মূল্যায়ন করছে...",
    tapMicBtn: "বলুন (Speak)",
    stopBtn: "থামুন (Stop)",
    supportedLanguagesNote: "বাংলা, হিন্দি, ইংরেজি এবং অন্যান্য ভারতীয় ভাষায় সমর্থিত।",
    inputPlaceholder: "আপনার পছন্দের কাজ বা শিক্ষার কথা লিখুন (যেমন: আমি সেলাই কাজ শিখতে চাই)...",
    evaluateBtn: "মূল্যায়ন করুন",
    quickTestingHeading: "এক ক্লিকে যেকোনো কাজের পরীক্ষা করুন (One-Tap Trade Testing):",
    dspActiveBadge: "DSP নয়েজ ফিল্টার সক্রিয় (85Hz High-Pass + Echo Cancel)",
    noSpeechDetected: "মাইক্রোফোনে কোনো শব্দ পাওয়া যায়নি। দয়া করে একটু জোরে বলুন বা নিচের বোতামে চাপ দিন।",
    speechClarifyPrompt: "কথোপকথনে কোনো নির্দিষ্ট কাজের নাম স্পষ্ট বোঝা যায়নি। দয়া করে পরিষ্কার বলুন (যেমন: দর্জি, ইলেকট্রিশিয়ান, গ্যারেজ, সোলার, পোল্ট্রি)।",
    quickPrompts: [
      {
        id: 'poultry',
        icon: '🐔',
        label: 'হাঁস-মুরগি পালন (Poultry)',
        promptText: 'আমি অষ্টম শ্রেণী পাস। আমি একটি ছোট পোল্ট্রি ফার্ম অথবা মুরগি পালনের ব্যবসা শুরু করতে চাই।',
        tradeId: 'TR-AGRI-04',
        colorClass: 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border-amber-300'
      },
      {
        id: 'tailoring',
        icon: '👗',
        label: 'পোশাক সেলাই (Tailoring)',
        promptText: 'আমি গ্রামে পোশাক সেলাই ও বুটিকের কাজ শিখতে চাই, নিজের স্বনির্ভর দল তৈরি করে কাজ শুরু করব।',
        tradeId: 'TR-TEXT-01',
        colorClass: 'bg-pink-100/70 hover:bg-pink-200/80 text-pink-900 border-pink-300'
      },
      {
        id: 'bike',
        icon: '🏍️',
        label: 'বাইক মেকানিক (Garage)',
        promptText: 'আমি মোটরসাইকেল এবং ই-রিকশা মেরামতের কাজের প্রশিক্ষণ নিতে চাই।',
        tradeId: 'TR-AUTO-01',
        colorClass: 'bg-blue-100/70 hover:bg-blue-200/80 text-blue-900 border-blue-300'
      },
      {
        id: 'data_entry',
        icon: '💻',
        label: 'ডাটা এন্ট্রি (Data Entry)',
        promptText: 'আমি ১২তম শ্রেণী পাস করেছি, আমি কম্পিউটার টাইপিং এবং ডাটা এন্ট্রি শিখতে চাই।',
        tradeId: 'TR-IT-01',
        colorClass: 'bg-indigo-100/70 hover:bg-indigo-200/80 text-indigo-900 border-indigo-300'
      },
      {
        id: 'compost',
        icon: '🌿',
        label: 'জৈব সার ও মাশরুম',
        promptText: 'আমি কেঁচো সার তৈরি এবং মাশরুম চাষের প্রশিক্ষণ নিতে চাই।',
        tradeId: 'TR-AGRI-01',
        colorClass: 'bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 border-emerald-300'
      },
      {
        id: 'solar',
        icon: '☀️',
        label: 'সৌর বিদ্যুৎ (Solar PV)',
        promptText: 'আমি সৌর বিদ্যুৎ প্যানেল ইনস্টলেশন এবং সৌর পাম্পের কাজ শিখতে চাই।',
        tradeId: 'TR-SOL-01',
        colorClass: 'bg-orange-100/70 hover:bg-orange-200/80 text-orange-900 border-orange-300'
      },
      {
        id: 'electrician',
        icon: '⚡',
        label: 'ইলেকট্রিশিয়ান (Electrician)',
        promptText: 'আমি বাড়ির ইলেকট্রিক ওয়্যারিং এবং মোটর মেরামতের কাজ শিখতে চাই।',
        tradeId: 'TR-ELEC-01',
        colorClass: 'bg-yellow-100/70 hover:bg-yellow-200/80 text-yellow-900 border-yellow-300'
      },
      {
        id: 'dairy',
        icon: '🥛',
        label: 'দুগ্ধ খামার (Dairy)',
        promptText: 'আমি গরু-মহিষের দুগ্ধ খামার এবং দুধ প্রক্রিয়াকরণের ব্যবসা শুরু করতে চাই।',
        tradeId: 'TR-AGRI-03',
        colorClass: 'bg-cyan-100/70 hover:bg-cyan-200/80 text-cyan-900 border-cyan-300'
      },
      {
        id: 'healthcare',
        icon: '🏥',
        label: 'স্বাস্থ্য সহকারী (Healthcare)',
        promptText: 'আমি হাসপাতালে রোগীর সেবা ও নার্সিং সহকারীর কাজ শিখতে চাই।',
        tradeId: 'TR-HEALTH-01',
        colorClass: 'bg-teal-100/70 hover:bg-teal-200/80 text-teal-900 border-teal-300'
      },
      {
        id: 'plumber',
        icon: '🚰',
        label: 'প্লাম্বার (Plumber)',
        promptText: 'আমি পাইপলাইন ও স্যানিটারি নলের কাজ শিখতে চাই।',
        tradeId: 'TR-PLUMB-01',
        colorClass: 'bg-sky-100/70 hover:bg-sky-200/80 text-sky-900 border-sky-300'
      }
    ]
  },

  ta: {
    langName: "தமிழ் (Tamil)",
    channelBadge: "சேனல் 1: கிராம பஞ்சாயத்து கியோஸ்க் மற்றும் மொபைல் குரல் உதவியாளர்",
    heading: "குரல் மூலம் வாழ்வாதாரம் மற்றும் திறன்களை கண்டறியவும்",
    subheading: "உங்கள் கல்வி, அனுபவம் அல்லது விருப்பமான வேலையை உங்கள் மொழியில் பேசுங்கள். எந்தப் படிவமும் நிரப்ப வேண்டியதில்லை.",
    tapToSpeak: "மைக் பொத்தானை அழுத்தி உங்கள் மொழியில் பேசுங்கள் (Tap mic to speak)",
    listening: "கேட்கிறது... தயவுசெய்து உங்கள் கல்வி மற்றும் விருப்பமான வேலையைக் கூறவும்",
    thinking: "PM-AJAY மாதிரி உங்கள் குரல் மற்றும் திறனை ஆராய்கிறது...",
    tapMicBtn: "பேசு (Speak)",
    stopBtn: "நிறுத்து (Stop)",
    supportedLanguagesNote: "தமிழ், இந்தி, ஆங்கிலம் மற்றும் பிற மொழிகளில் கிடைக்கிறது.",
    inputPlaceholder: "உங்கள் விருப்பமான வேலை அல்லது கல்வியை எழுதுங்கள் (எ.கா. தையல் வேலை கற்க விரும்புகிறேன்)...",
    evaluateBtn: "மதிப்பீடு செய்",
    quickTestingHeading: "ஒரே தட்டலில் எந்தத் தொழிலையும் சோதிக்கவும் (One-Tap Trade Testing):",
    dspActiveBadge: "DSP சத்தம் வடிகட்டி செயலில் உள்ளது (85Hz High-Pass + Echo Cancel)",
    noSpeechDetected: "மைக்ரோஃபோனில் குரல் எதுவும் கேட்கவில்லை. தயவுசெய்து சத்தமாகப் பேசவும் அல்லது கீழே உள்ள பொத்தானைத் தொடவும்.",
    speechClarifyPrompt: "பேசியதில் தொழிலின் பெயர் தெளிவாக இல்லை. தயவுசெய்து தெளிவாகப் பேசுங்கள் (எ.கா: தையல், மின் வேலை, பைக் மெக்கானிக், சோலார், கோழி வளர்ப்பு).",
    quickPrompts: [
      {
        id: 'poultry',
        icon: '🐔',
        label: 'கோழி வளர்ப்பு (Poultry)',
        promptText: 'எனக்கு கோழி பண்ணை மற்றும் பிராய்லர் வளர்ப்பு தொழில் தொடங்க வேண்டும்.',
        tradeId: 'TR-AGRI-04',
        colorClass: 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border-amber-300'
      },
      {
        id: 'tailoring',
        icon: '👗',
        label: 'தையல் கலை (Tailoring)',
        promptText: 'எனக்கு வீட்டில் தையல் வேலை மற்றும் பூட்டிக் தொழில் தொடங்க வேண்டும்.',
        tradeId: 'TR-TEXT-01',
        colorClass: 'bg-pink-100/70 hover:bg-pink-200/80 text-pink-900 border-pink-300'
      },
      {
        id: 'bike',
        icon: '🏍️',
        label: 'பைக் மெக்கானிக் (Garage)',
        promptText: 'நான் 10 ஆம் வகுப்பு முடித்துள்ளேன். எனக்கு மோட்டார் பைக் மற்றும் இருசக்கர வாகன மெக்கானிக் பயிற்சி வேண்டும்.',
        tradeId: 'TR-AUTO-01',
        colorClass: 'bg-blue-100/70 hover:bg-blue-200/80 text-blue-900 border-blue-300'
      },
      {
        id: 'data_entry',
        icon: '💻',
        label: 'டேட்டா என்ட்ரி (Data Entry)',
        promptText: 'நான் 12ஆம் வகுப்பு முடித்துள்ளேன், கணினி தட்டச்சு மற்றும் டேட்டா என்ட்ரி வேலை கற்க விரும்புகிறேன்.',
        tradeId: 'TR-IT-01',
        colorClass: 'bg-indigo-100/70 hover:bg-indigo-200/80 text-indigo-900 border-indigo-300'
      },
      {
        id: 'compost',
        icon: '🌿',
        label: 'இயற்கை உரம் மற்றும் காளான்',
        promptText: 'எனக்கு மண்புழு உரம் தயாரித்தல் மற்றும் காளான் வளர்ப்பு பயிற்சி வேண்டும்.',
        tradeId: 'TR-AGRI-01',
        colorClass: 'bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 border-emerald-300'
      },
      {
        id: 'solar',
        icon: '☀️',
        label: 'சூரிய மின்சக்தி (Solar PV)',
        promptText: 'நான் 10 ஆம் வகுப்பு படித்துள்ளேன். சூரிய மின்சக்தி அமைப்பு மற்றும் சோலார் பம்ப் வேலையை கற்றுக்கொள்ள விரும்புகிறேன்.',
        tradeId: 'TR-SOL-01',
        colorClass: 'bg-orange-100/70 hover:bg-orange-200/80 text-orange-900 border-orange-300'
      },
      {
        id: 'electrician',
        icon: '⚡',
        label: 'மின் பழுதுபார்ப்பவர் (Electrician)',
        promptText: 'எனக்கு வீட்டு மின் வயரிங் மற்றும் மோட்டார் பழுதுபார்க்கும் வேலை கற்றுக்கொள்ள வேண்டும்.',
        tradeId: 'TR-ELEC-01',
        colorClass: 'bg-yellow-100/70 hover:bg-yellow-200/80 text-yellow-900 border-yellow-300'
      },
      {
        id: 'dairy',
        icon: '🥛',
        label: 'பால் பண்ணை (Dairy)',
        promptText: 'எனக்கு பசு-எருமை பால் பண்ணை மற்றும் பால் பதப்படுத்துதல் தொழில் தொடங்க வேண்டும்.',
        tradeId: 'TR-AGRI-03',
        colorClass: 'bg-cyan-100/70 hover:bg-cyan-200/80 text-cyan-900 border-cyan-300'
      },
      {
        id: 'healthcare',
        icon: '🏥',
        label: 'சுகாதார உதவியாளர் (Healthcare)',
        promptText: 'எனக்கு மருத்துவமனையில் நோயாளி பராமரிப்பு மற்றும் செவிலியர் உதவியாளர் வேலை கற்க வேண்டும்.',
        tradeId: 'TR-HEALTH-01',
        colorClass: 'bg-teal-100/70 hover:bg-teal-200/80 text-teal-900 border-teal-300'
      },
      {
        id: 'plumber',
        icon: '🚰',
        label: 'பிளம்பர் (Plumber)',
        promptText: 'எனக்கு குடிநீர் குழாய் பொருத்துதல் மற்றும் பிளம்பிங் வேலை கற்க வேண்டும்.',
        tradeId: 'TR-PLUMB-01',
        colorClass: 'bg-sky-100/70 hover:bg-sky-200/80 text-sky-900 border-sky-300'
      }
    ]
  },

  te: {
    langName: "తెలుగు (Telugu)",
    channelBadge: "ఛానల్ 1: గ్రామ పంచాయతీ కియోస్క్ మరియు మొబైల్ వాయిస్ అసిస్టెంట్",
    heading: "వాయిస్ ద్వారా జీవనోపాధి మరియు నైపుణ్యాలను కనుగొనండి",
    subheading: "మీ విద్య, అనుభవం లేదా ఇష్టపడే పని గురించి మీ స్వంత భాషలో మాట్లాడండి. ఎటువంటి ఫారమ్‌లు నింపాల్సిన అవసరం లేదు.",
    tapToSpeak: "మైక్ బటన్ నొక్కి మీ భాషలో మాట్లాడండి (Tap mic to speak)",
    listening: "వింటున్నాము... దయచేసి మీ విద్య మరియు ఇష్టపడే పనిని తెలపండి",
    thinking: "PM-AJAY ఏఐ మోడల్ మీ స్వరం మరియు నైపుణ్యాన్ని విశ్లేషిస్తోంది...",
    tapMicBtn: "మాట్లాడండి (Speak)",
    stopBtn: "ఆపండి (Stop)",
    supportedLanguagesNote: "తెలుగు, హిందీ, ఇంగ్లీష్ మరియు ఇతర భారతీయ భాషలలో లభ్యం.",
    inputPlaceholder: "మీ ఇష్టమైన పని లేదా చదువును రాయండి (ఉదా. నాకు కుట్టుపని నేర్చుకోవాలని ఉంది)...",
    evaluateBtn: "పరిశీలించండి",
    quickTestingHeading: "ఒకే క్లిక్‌తో ఏ వృత్తినైనా పరీక్షించండి (One-Tap Trade Testing):",
    dspActiveBadge: "DSP శబ్ద ఫిల్టర్ యాక్టివ్‌గా ఉంది (85Hz High-Pass + Echo Cancel)",
    noSpeechDetected: "మైక్రోఫోన్‌లో ఎటువంటి శబ్దం రాలేదు. దయచేసి కాస్త బిగ్గరగా మాట్లాడండి లేదా క్రింది బటన్ నొక్కండి.",
    speechClarifyPrompt: "మాటలలో వృత్తి పేరు స్పష్టంగా రాలేదు. దయచేసి స్పష్టంగా చెప్పండి (ఉదా: కుట్టుపని, ఎలక్ట్రీషియన్, బైక్ మెకానిక్, సోలార్, కోళ్ల ఫారం).",
    quickPrompts: [
      {
        id: 'poultry',
        icon: '🐔',
        label: 'కోళ్ల పెంపకం (Poultry)',
        promptText: 'నేను కోళ్ల ఫారం మరియు పౌల్ట్రీ వ్యాపారం ప్రారంభించాలనుకుంటున్నాను.',
        tradeId: 'TR-AGRI-04',
        colorClass: 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border-amber-300'
      },
      {
        id: 'tailoring',
        icon: '👗',
        label: 'కుట్టు పని (Tailoring)',
        promptText: 'నేను 8వ తరగతి చదివాను. నాకు కుట్టు పని మరియు బోటిక్ టైలరింగ్ శిక్షణ కావాలి.',
        tradeId: 'TR-TEXT-01',
        colorClass: 'bg-pink-100/70 hover:bg-pink-200/80 text-pink-900 border-pink-300'
      },
      {
        id: 'bike',
        icon: '🏍️',
        label: 'బైక్ మెకానిక్ (Garage)',
        promptText: 'నేను గ్రామీణ ప్రాంతంలో ద్విచక్ర వాహనాల మెకానిక్ పని నేర్చుకుని స్వయం ఉపాధి పొందాలనుకుంటున్నాను.',
        tradeId: 'TR-AUTO-01',
        colorClass: 'bg-blue-100/70 hover:bg-blue-200/80 text-blue-900 border-blue-300'
      },
      {
        id: 'data_entry',
        icon: '💻',
        label: 'డేటా ఎంట్రీ (Data Entry)',
        promptText: 'నేను 12వ తరగతి పూర్తి చేసాను, కంప్యూటర్ టైపింగ్ మరియు డేటా ఎంట్రీ పని నేర్చుకోవాలనుకుంటున్నాను.',
        tradeId: 'TR-IT-01',
        colorClass: 'bg-indigo-100/70 hover:bg-indigo-200/80 text-indigo-900 border-indigo-300'
      },
      {
        id: 'compost',
        icon: '🌿',
        label: 'సేంద్రీయ ఎరువు & పుట్టగొడుగులు',
        promptText: 'నాకు వానపాముల ఎరువుల తయారీ మరియు పుట్టగొడుగుల సాగు శిక్షణ కావాలి.',
        tradeId: 'TR-AGRI-01',
        colorClass: 'bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 border-emerald-300'
      },
      {
        id: 'solar',
        icon: '☀️',
        label: 'సౌర విద్యుత్ (Solar PV)',
        promptText: 'నాకు సోలార్ ప్యానెల్ ఇన్‌స్టాలేషన్ మరియు సోలార్ పంపుల పని నేర్చుకోవాలని ఉంది.',
        tradeId: 'TR-SOL-01',
        colorClass: 'bg-orange-100/70 hover:bg-orange-200/80 text-orange-900 border-orange-300'
      },
      {
        id: 'electrician',
        icon: '⚡',
        label: 'ఎలక్ట్రీషియన్ (Electrician)',
        promptText: 'నాకు గృహ విద్యుత్ వైరింగ్ మరియు మోటార్ మరమ్మత్తు పనులు నేర్చుకోవాలని ఉంది.',
        tradeId: 'TR-ELEC-01',
        colorClass: 'bg-yellow-100/70 hover:bg-yellow-200/80 text-yellow-900 border-yellow-300'
      },
      {
        id: 'dairy',
        icon: '🥛',
        label: 'డైరీ ఫార్మింగ్ (Dairy)',
        promptText: 'నేను ఆవులు-గేదెల పాడి పరిశ్రమ మరియు పాల వ్యాపారం ప్రారంభించాలనుకుంటున్నాను.',
        tradeId: 'TR-AGRI-03',
        colorClass: 'bg-cyan-100/70 hover:bg-cyan-200/80 text-cyan-900 border-cyan-300'
      },
      {
        id: 'healthcare',
        icon: '🏥',
        label: 'ఆరోగ్య సహాయకుడు (Healthcare)',
        promptText: 'నాకు ఆసుపత్రిలో రోగి సంరక్షణ మరియు నర్సింగ్ అసిస్టెంట్ పని నేర్చుకోవాలని ఉంది.',
        tradeId: 'TR-HEALTH-01',
        colorClass: 'bg-teal-100/70 hover:bg-teal-200/80 text-teal-900 border-teal-300'
      },
      {
        id: 'plumber',
        icon: '🚰',
        label: 'ప్లంబర్ (Plumber)',
        promptText: 'నాకు పైప్‌లైన్ మరియు తాగునీటి కుళాయి అమరిక పనులు నేర్చుకోవాలని ఉంది.',
        tradeId: 'TR-PLUMB-01',
        colorClass: 'bg-sky-100/70 hover:bg-sky-200/80 text-sky-900 border-sky-300'
      }
    ]
  },

  gu: {
    langName: "ગુજરાતી (Gujarati)",
    channelBadge: "ચેનલ 1: ગ્રામ પંચાયત કિઓસ્ક અને મોબાઈલ વોઈસ સહાયક",
    heading: "અવાજ દ્વારા આજીવિકા અને કૌશલ્ય શોધો",
    subheading: "તમારા શિક્ષણ, અનુભવ અથવા પસંદગીના કામ વિશે તમારી ભાષામાં જણાવો. કોઈ ફોર્મ ભરવાની જરૂર નથી.",
    tapToSpeak: "માઈક બટન દબાવો અને તમારી ભાષામાં બોલો (Tap mic to speak)",
    listening: "સાંભળી રહ્યા છીએ... કૃપા કરીને તમારું શિક્ષણ અને પસંદગીનું કામ જણાવો",
    thinking: "PM-AJAY એઆઈ મોડેલ તમારા અવાજ અને કૌશલ્યનું વિશ્લેષણ કરી રહ્યું છે...",
    tapMicBtn: "બોલો (Speak)",
    stopBtn: "રોકો (Stop)",
    supportedLanguagesNote: "ગુજરાતી, હિન્દી, અંગ્રેજી અને તમામ ભારતીય ભાષાઓમાં ઉપલબ્ધ.",
    inputPlaceholder: "તમારા મનપસંદ કામ અથવા શિક્ષણ વિશે લખો (દા.ત. મારે સિલાઈ કામ શીખવું છે)...",
    evaluateBtn: "મૂલ્યાંકન કરો",
    quickTestingHeading: "એક જ ક્લિકમાં કોઈપણ વ્યવસાયનું પરીક્ષણ કરો (One-Tap Trade Testing):",
    dspActiveBadge: "DSP નોઇઝ ફિલ્ટર સક્રિય (85Hz High-Pass + Echo Cancel)",
    noSpeechDetected: "માઇક્રોફોનમાં કોઈ અવાજ મળ્યો નથી. કૃપા કરીને થોડું મોટેથી બોલો અથવા નીચેનું બટન દબાવો.",
    speechClarifyPrompt: "અવાજમાં વ્યવસાયનું નામ સ્પષ્ટ મળ્યું નથી. કૃપા કરીને સ્પષ્ટ બોલો (દા.ત. સિલાઈ, ઇલેક્ટ્રિશિયન, ગેરેજ, સોલાર, મરઘાં પાલન).",
    quickPrompts: [
      {
        id: 'poultry',
        icon: '🐔',
        label: 'મરઘાં પાલન (Poultry)',
        promptText: 'મારે મરઘાં પાલન અને પોલ્ટ્રી ફાર્મિંગનો વ્યવસાય શરૂ કરવો છે.',
        tradeId: 'TR-AGRI-04',
        colorClass: 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border-amber-300'
      },
      {
        id: 'tailoring',
        icon: '👗',
        label: 'સિલાઈ અને બુટિક (Tailoring)',
        promptText: 'મારે ઘરમાં સિલાઈ કામ અને બુટિક શરૂ કરવા માટે તાલીમ જોઈએ છે.',
        tradeId: 'TR-TEXT-01',
        colorClass: 'bg-pink-100/70 hover:bg-pink-200/80 text-pink-900 border-pink-300'
      },
      {
        id: 'bike',
        icon: '🏍️',
        label: 'બાઇક મિકેનિક (Garage)',
        promptText: 'મારે ટુ-વ્હીલર મોટરસાઇકલ અને ઇ-રિક્ષા રિપેરિંગનું કામ શીખવું છે.',
        tradeId: 'TR-AUTO-01',
        colorClass: 'bg-blue-100/70 hover:bg-blue-200/80 text-blue-900 border-blue-300'
      },
      {
        id: 'data_entry',
        icon: '💻',
        label: 'ડેટા એન્ટ્રી (Data Entry)',
        promptText: 'મેં 12મું પાસ કર્યું છે, મારે કોમ્પ્યુટર ટાઈપિંગ અને ડેટા એન્ટ્રીનું કામ શીખવું છે.',
        tradeId: 'TR-IT-01',
        colorClass: 'bg-indigo-100/70 hover:bg-indigo-200/80 text-indigo-900 border-indigo-300'
      },
      {
        id: 'compost',
        icon: '🌿',
        label: 'અળસિયા ખાતર અને મશરૂમ',
        promptText: 'મારે અળસિયા ખાતર બનાવવા અને મશરૂમની ખેતીની તાલીમ લેવી છે.',
        tradeId: 'TR-AGRI-01',
        colorClass: 'bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 border-emerald-300'
      },
      {
        id: 'solar',
        icon: '☀️',
        label: 'સોલાર પેનલ (Solar PV)',
        promptText: 'મારે સોલાર પેનલ ઇન્સ્ટોલેશન અને સોલાર વોટર પંપનું કામ શીખવું છે.',
        tradeId: 'TR-SOL-01',
        colorClass: 'bg-orange-100/70 hover:bg-orange-200/80 text-orange-900 border-orange-300'
      },
      {
        id: 'electrician',
        icon: '⚡',
        label: 'ઇલેક્ટ્રિશિયન (Electrician)',
        promptText: 'મારે ઘરનું ઇલેક્ટ્રિક વાયરિંગ અને મોટર રિપેરિંગનું કામ શીખવું છે.',
        tradeId: 'TR-ELEC-01',
        colorClass: 'bg-yellow-100/70 hover:bg-yellow-200/80 text-yellow-900 border-yellow-300'
      },
      {
        id: 'dairy',
        icon: '🥛',
        label: 'ડેરી ફાર્મિંગ (Dairy)',
        promptText: 'મારે ગાય-ભેંસનું ડેરી ફાર્મ અને દૂધ પ્રોસેસિંગનો વ્યવસાય શરૂ કરવો છે.',
        tradeId: 'TR-AGRI-03',
        colorClass: 'bg-cyan-100/70 hover:bg-cyan-200/80 text-cyan-900 border-cyan-300'
      },
      {
        id: 'healthcare',
        icon: '🏥',
        label: 'હોસ્પિટલ સહાયક (Healthcare)',
        promptText: 'મારે હોસ્પિટલમાં દર્દીઓની સંભાળ અને નર્સિંગ સહાયકનું કામ શીખવું છે.',
        tradeId: 'TR-HEALTH-01',
        colorClass: 'bg-teal-100/70 hover:bg-teal-200/80 text-teal-900 border-teal-300'
      },
      {
        id: 'plumber',
        icon: '🚰',
        label: 'પ્લમ્બર (Plumber)',
        promptText: 'મારે નળ ફિટિંગ, પાઇપલાઇન અને પ્લમ્બિંગનું કામ શીખવું છે.',
        tradeId: 'TR-PLUMB-01',
        colorClass: 'bg-sky-100/70 hover:bg-sky-200/80 text-sky-900 border-sky-300'
      }
    ]
  },

  en: {
    langName: "English",
    channelBadge: "Channel 1: Village Kiosk & Mobile Voice Interface",
    heading: "Discover Livelihood & Skills via Voice",
    subheading: "Speak naturally about your education, experience, or what you want to learn. No forms to fill.",
    tapToSpeak: "Tap microphone button to speak in any language",
    listening: "Listening... Please describe your education and desired trade",
    thinking: "PM-AJAY AI Model is analyzing your speech and matching NSQF trades...",
    tapMicBtn: "Tap & Speak",
    stopBtn: "Stop",
    supportedLanguagesNote: "Fully supports Hindi, Bhojpuri, Punjabi, Marathi, Bengali, Tamil, Telugu, and English.",
    inputPlaceholder: "Type your aspiration or trade in any language (e.g., I want to learn electrical wiring)...",
    evaluateBtn: "Evaluate",
    quickTestingHeading: "One-Tap Direct Trade Testing:",
    dspActiveBadge: "DSP Noise Filter Active (85Hz High-Pass + Echo Cancel)",
    noSpeechDetected: "No speech detected in microphone. Please speak louder or tap any trade button below.",
    speechClarifyPrompt: "No clear vocational trade keyword detected. Please specify clearly (e.g. Electrician, Tailoring, Garage, Solar, Poultry).",
    quickPrompts: [
      {
        id: 'poultry',
        icon: '🐔',
        label: 'Poultry Farming',
        promptText: 'I want to start a commercial poultry farming and broiler production enterprise.',
        tradeId: 'TR-AGRI-04',
        colorClass: 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border-amber-300'
      },
      {
        id: 'tailoring',
        icon: '👗',
        label: 'Tailoring & Boutique',
        promptText: 'I want to learn tailoring and set up a women boutique enterprise at home.',
        tradeId: 'TR-TEXT-01',
        colorClass: 'bg-pink-100/70 hover:bg-pink-200/80 text-pink-900 border-pink-300'
      },
      {
        id: 'bike',
        icon: '🏍️',
        label: 'Bike & EV Garage',
        promptText: 'I want training in two-wheeler motorcycle and electric vehicle EV repair.',
        tradeId: 'TR-AUTO-01',
        colorClass: 'bg-blue-100/70 hover:bg-blue-200/80 text-blue-900 border-blue-300'
      },
      {
        id: 'data_entry',
        icon: '💻',
        label: 'Data Entry Operator',
        promptText: 'I completed 12th standard, I want to learn computer typing and office data entry.',
        tradeId: 'TR-IT-01',
        colorClass: 'bg-indigo-100/70 hover:bg-indigo-200/80 text-indigo-900 border-indigo-300'
      },
      {
        id: 'compost',
        icon: '🌿',
        label: 'Vermicompost & Mushroom',
        promptText: 'I completed 10th standard and want to set up an organic vermicompost and mushroom cultivation enterprise under PM-AJAY.',
        tradeId: 'TR-AGRI-01',
        colorClass: 'bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 border-emerald-300'
      },
      {
        id: 'solar',
        icon: '☀️',
        label: 'Solar PV (Suryamitra)',
        promptText: 'I want to learn solar PV rooftop panel installation and solar water pump maintenance.',
        tradeId: 'TR-SOL-01',
        colorClass: 'bg-orange-100/70 hover:bg-orange-200/80 text-orange-900 border-orange-300'
      },
      {
        id: 'electrician',
        icon: '⚡',
        label: 'Domestic Electrician',
        promptText: 'I want to learn domestic electrical wiring, switchboards, and fan motor repair.',
        tradeId: 'TR-ELEC-01',
        colorClass: 'bg-yellow-100/70 hover:bg-yellow-200/80 text-yellow-900 border-yellow-300'
      },
      {
        id: 'dairy',
        icon: '🥛',
        label: 'Dairy Farming',
        promptText: 'I want to establish a dairy farm supervisor and milk processing micro-enterprise.',
        tradeId: 'TR-AGRI-03',
        colorClass: 'bg-cyan-100/70 hover:bg-cyan-200/80 text-cyan-900 border-cyan-300'
      },
      {
        id: 'healthcare',
        icon: '🏥',
        label: 'Healthcare Caregiver',
        promptText: 'I want to become a General Duty Assistant GDA and patient healthcare caregiver in hospitals.',
        tradeId: 'TR-HEALTH-01',
        colorClass: 'bg-teal-100/70 hover:bg-teal-200/80 text-teal-900 border-teal-300'
      },
      {
        id: 'plumber',
        icon: '🚰',
        label: 'Plumber & Pipe Fitting',
        promptText: 'I want to learn water plumbing, pipe fitting, and work under Jal Jeevan Mission.',
        tradeId: 'TR-PLUMB-01',
        colorClass: 'bg-sky-100/70 hover:bg-sky-200/80 text-sky-900 border-sky-300'
      }
    ]
  }
};
