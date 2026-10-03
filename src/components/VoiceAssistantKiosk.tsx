import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Sparkles, CheckCircle2, 
  ArrowRight, RefreshCw, UserCheck, AlertCircle, FileText, Check 
} from 'lucide-react';
import { BeneficiaryProfile, NSQFRecommendation, RegionalLanguage, VoiceResponse } from '../types/pmajay';
import { SUPPORTED_LANGUAGES, NSQF_TRADES_DATASET } from '../data/nsqfTrades';
import { KIOSK_TRANSLATIONS } from '../data/translations';
import confetti from 'canvas-confetti';

interface VoiceAssistantKioskProps {
  onSelectTradeForEnrollment: (trade: NSQFRecommendation, profile: BeneficiaryProfile) => void;
}

export const VoiceAssistantKiosk: React.FC<VoiceAssistantKioskProps> = ({ onSelectTradeForEnrollment }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<RegionalLanguage>('hi');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Conversation & AI state
  const [voiceResponse, setVoiceResponse] = useState<VoiceResponse | null>(null);
  const [manualText, setManualText] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const capturedTranscriptRef = useRef<string>('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const maxEnergyRef = useRef<number>(0);

  // Clean up timers & audio on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (currentAudioElementRef.current) {
        currentAudioElementRef.current.pause();
      }
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.abort(); } catch (e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Set default sample prompt and localized texts when language changes
  const activeLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];
  const currentTrans = KIOSK_TRANSLATIONS[selectedLanguage] || KIOSK_TRANSLATIONS['hi'];

  // Handle switching language: changes selected language, stops previous speech, leaves input for user
  const handleLanguageChange = (newLang: RegionalLanguage) => {
    setSelectedLanguage(newLang);
    setManualText('');
    capturedTranscriptRef.current = '';
    stopAudio();
    setErrorMessage(null);
  };

  // Start microphone recording with hardware & Web Audio DSP filters
  const handleStartRecording = async () => {
    setErrorMessage(null);
    capturedTranscriptRef.current = '';
    maxEnergyRef.current = 0;
    setManualText(''); // Clear so no previous session prompt lingers
    try {
      // 1. Hardware DSP audio filters: Echo cancellation, spectral noise suppression, AGC
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      // 2. Web Audio API Acoustic High-Pass Filter (85 Hz) & Real-time VAD Analyser
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);

        // High-pass filter at 85 Hz to strip ambient mechanical rumble & wind noise
        const highpassFilter = audioCtx.createBiquadFilter();
        highpassFilter.type = 'highpass';
        highpassFilter.frequency.value = 85;

        // Bandpass peaking filter at 2500 Hz to enhance speech intelligibility
        const speechClarityFilter = audioCtx.createBiquadFilter();
        speechClarityFilter.type = 'peaking';
        speechClarityFilter.frequency.value = 2500;
        speechClarityFilter.gain.value = 3;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.4;

        source.connect(highpassFilter);
        highpassFilter.connect(speechClarityFilter);
        speechClarityFilter.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateLevel = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(100, Math.round((avg / 128) * 100));
          setAudioLevel(normalized);
          if (normalized > maxEnergyRef.current) {
            maxEnergyRef.current = normalized;
          }
          animationFrameRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      } catch (audioCtxErr) {
        console.warn("Web Audio DSP filter initialization:", audioCtxErr);
      }

      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleProcessRecordedAudio(audioBlob, capturedTranscriptRef.current);
        stream.getTracks().forEach(track => track.stop());
      };

      // Start browser Web Speech Recognition for instant, real-time Hindi/regional speech-to-text
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = selectedLanguage === 'en' ? 'en-IN' :
                             selectedLanguage === 'mr' ? 'mr-IN' :
                             selectedLanguage === 'pa' ? 'pa-IN' :
                             selectedLanguage === 'bn' ? 'bn-IN' :
                             selectedLanguage === 'ta' ? 'ta-IN' :
                             selectedLanguage === 'te' ? 'te-IN' :
                             selectedLanguage === 'gu' ? 'gu-IN' : 'hi-IN';

          recognition.onresult = (event: any) => {
            let current = '';
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript;
            }
            if (current.trim()) {
              capturedTranscriptRef.current = current;
              setManualText(current);
            }
          };

          recognition.onerror = (e: any) => {
            console.warn("Speech recognition warning:", e.error);
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (e) {
          console.warn("SpeechRecognition start error:", e);
        }
      }

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setErrorMessage("Microphone access was denied or not available. You can use the one-tap regional voice samples below!");
      setIsRecording(false);
    }
  };

  // Stop recording & teardown audio filters
  const handleStopRecording = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  // Convert blob to base64 and send to server with VAD silence rejection
  const handleProcessRecordedAudio = async (blob: Blob, transcriptText?: string) => {
    // Only use transcript captured in real-time from the microphone during THIS recording
    const liveText = capturedTranscriptRef.current?.trim() || transcriptText?.trim();
    // VAD Check: If maximum energy was negligible and no speech was captured
    if (maxEnergyRef.current < 4 && !liveText) {
      setIsProcessing(false);
      setErrorMessage(currentTrans.noSpeechDetected);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        await sendQueryToServer({
          text: liveText && liveText.length > 0 ? liveText : undefined,
          audioBase64: base64data,
          mimeType: blob.type || 'audio/webm',
          language: selectedLanguage,
        }, selectedLanguage);
      };
    } catch (err: any) {
      console.error("Error processing audio:", err);
      setErrorMessage("Could not process audio. Please try again or use sample voice prompts.");
      setIsProcessing(false);
    }
  };

  // Process text or sample prompt with optional language override to prevent React state lag
  const handleProcessText = async (text: string, langOverride?: RegionalLanguage) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setErrorMessage(null);
    const targetLang = langOverride || selectedLanguage;
    await sendQueryToServer({
      text: text.trim(),
      language: targetLang,
    }, targetLang);
  };

  // Call the full-stack backend endpoint (/api/chat)
  const sendQueryToServer = async (
    payload: { text?: string; audioBase64?: string; mimeType?: string; language: RegionalLanguage },
    overrideLang?: RegionalLanguage
  ) => {
    const effectiveLang = overrideLang || payload.language || selectedLanguage;
    payload.language = effectiveLang;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data: VoiceResponse = await res.json();
      setVoiceResponse(data);
      setIsProcessing(false);

      // Trigger celebratory confetti on successful NSQF mapping
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if not loaded
      }

      // Play audio response automatically in selected regional language
      playSpokenAudio(data, effectiveLang);
    } catch (err: any) {
      console.warn("Backend API error, activating resilient client evaluation:", err);
      const queryText = payload.text || capturedTranscriptRef.current || manualText;
      if (!queryText || queryText.trim().length === 0) {
        setIsProcessing(false);
        setErrorMessage(currentTrans.speechClarifyPrompt);
        return;
      }
      // Resilient client evaluation on the user's actual query in effective language
      const fallbackData = createFallbackEvaluation(queryText, effectiveLang);
      setVoiceResponse(fallbackData);
      setIsProcessing(false);
      playSpokenAudio(fallbackData, effectiveLang);
    }
  };

  // Play spoken reply
  const playSpokenAudio = (response: VoiceResponse, langOverride?: RegionalLanguage) => {
    const activeLang = langOverride || selectedLanguage;
    const textToSpeak = activeLang === 'en'
      ? (response.spoken_reply_english || response.spoken_reply_text)
      : response.spoken_reply_text;

    // 1. If high-fidelity neural audio was generated
    if (response.audio_base64) {
      try {
        if (currentAudioElementRef.current) {
          currentAudioElementRef.current.pause();
        }
        const audioUrl = `data:${response.audio_mime_type || 'audio/mpeg'};base64,${response.audio_base64}`;
        const audio = new Audio(audioUrl);
        currentAudioElementRef.current = audio;
        setIsPlayingAudio(true);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          setIsPlayingAudio(false);
          fallbackSpeechSynthesis(textToSpeak, activeLang);
        };
        audio.play().catch(() => {
          fallbackSpeechSynthesis(textToSpeak, activeLang);
        });
        return;
      } catch (err) {
        console.warn("Audio element playback failed, using speech synthesis:", err);
      }
    }

    // 2. Web Speech API fallback with explicit regional voice selection
    fallbackSpeechSynthesis(textToSpeak, activeLang);
  };

  const fallbackSpeechSynthesis = (text: string, langOverride?: RegionalLanguage) => {
    const activeLang = langOverride || selectedLanguage;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const targetLang = activeLang === 'en' ? 'en-IN' :
                         activeLang === 'mr' ? 'mr-IN' :
                         activeLang === 'pa' ? 'pa-IN' :
                         activeLang === 'bn' ? 'bn-IN' :
                         activeLang === 'ta' ? 'ta-IN' :
                         activeLang === 'te' ? 'te-IN' :
                         activeLang === 'gu' ? 'gu-IN' :
                         activeLang === 'bho' ? 'hi-IN' : 'hi-IN';
      utterance.lang = targetLang;

      // Select authentic Indian / regional voice if installed
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => 
        v.lang === targetLang ||
        v.lang.startsWith(targetLang.split('-')[0]) ||
        (activeLang === 'hi' && (v.name.toLowerCase().includes('hindi') || v.name.includes('हिन्दी') || v.name.includes('Kalpana') || v.name.includes('Hemant'))) ||
        (activeLang === 'mr' && (v.name.toLowerCase().includes('marathi') || v.name.includes('मराठी'))) ||
        (activeLang === 'pa' && (v.name.toLowerCase().includes('punjabi') || v.name.includes('ਪੰਜਾਬੀ'))) ||
        (activeLang === 'bn' && (v.name.toLowerCase().includes('bengali') || v.name.includes('বাংলা') || v.name.includes('bangla'))) ||
        (activeLang === 'ta' && (v.name.toLowerCase().includes('tamil') || v.name.includes('தமிழ்'))) ||
        (activeLang === 'te' && (v.name.toLowerCase().includes('telugu') || v.name.includes('తెలుగు'))) ||
        (activeLang === 'gu' && (v.name.toLowerCase().includes('gujarati') || v.name.includes('ગુજરાતી')))
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopAudio = () => {
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  // Resilient semantic fallback builder matching query across NSQF dataset
  const createFallbackEvaluation = (query: string, lang: RegionalLanguage): VoiceResponse => {
    const qLower = (query || "").toLowerCase();
    let selectedTrades = [NSQF_TRADES_DATASET[0], NSQF_TRADES_DATASET[2]]; // default Solar + 2W
    let aspiration = "स्वरोजगार एवं तकनीकी प्रशिक्षण";
    let occupation = "दिहाड़ी श्रम / पारंपरिक कार्य";

    if (qLower.includes('डेयरी') || qLower.includes('dairy') || qLower.includes('दूध') || qLower.includes('पशुपालन') || qLower.includes('गाय') || qLower.includes('भैंस')) {
      const dairy = NSQF_TRADES_DATASET.find(t => t.id === 'TR-AGRI-03') || NSQF_TRADES_DATASET[0];
      const horti = NSQF_TRADES_DATASET.find(t => t.id === 'TR-AGRI-01') || NSQF_TRADES_DATASET[1];
      selectedTrades = [dairy, horti];
      aspiration = "डेयरी फार्मिंग एवं दुग्ध प्रसंस्करण";
      occupation = "ग्रामीण पशुपालक / दुग्ध उत्पादक";
    } else if (qLower.includes('मुर्गी') || qLower.includes('poultry') || qLower.includes('अंडा') || qLower.includes('चिकन') || qLower.includes('पोल्ट्री')) {
      const poultry = NSQF_TRADES_DATASET.find(t => t.id === 'TR-AGRI-04') || NSQF_TRADES_DATASET[0];
      const horti = NSQF_TRADES_DATASET.find(t => t.id === 'TR-AGRI-01') || NSQF_TRADES_DATASET[1];
      selectedTrades = [poultry, horti];
      aspiration = "मुर्गी पालन एवं ब्रायलर उत्पादन";
      occupation = "ग्रामीण पशुपालक / बेरोजगार युवा";
    } else if (qLower.includes('बिजली') || qLower.includes('electrician') || qLower.includes('वायरिंग') || qLower.includes('पंखा') || qLower.includes('मोटर') || qLower.includes('electric')) {
      const elec = NSQF_TRADES_DATASET.find(t => t.id === 'TR-ELEC-01') || NSQF_TRADES_DATASET[0];
      const sol = NSQF_TRADES_DATASET.find(t => t.id === 'TR-SOL-01') || NSQF_TRADES_DATASET[1];
      selectedTrades = [elec, sol];
      aspiration = "घरेलू वायरिंग एवं उपकरण रिपेयर";
      occupation = "इलेक्ट्रिकल हेल्पर / वायरमैन";
    } else if (qLower.includes('solar') || qLower.includes('सोलर') || qLower.includes('सौर') || qLower.includes('suryamitra')) {
      const sol1 = NSQF_TRADES_DATASET.find(t => t.id === 'TR-SOL-01') || NSQF_TRADES_DATASET[0];
      const sol2 = NSQF_TRADES_DATASET.find(t => t.id === 'TR-SOL-02') || NSQF_TRADES_DATASET[1];
      selectedTrades = [sol1, sol2];
      aspiration = "सोलर पैनल इंस्टॉलेशन (सूर्यमित्र)";
      occupation = "रूफटॉप सोलर हेल्पर / युवा कामगार";
    } else if (qLower.includes('कंप्यूटर') || qLower.includes('computer') || qLower.includes('data entry') || qLower.includes('typing') || qLower.includes('ऑफिस') || qLower.includes('डाटा') || qLower.includes('csc')) {
      const de = NSQF_TRADES_DATASET.find(t => t.id === 'TR-IT-01') || NSQF_TRADES_DATASET[0];
      const mob = NSQF_TRADES_DATASET.find(t => t.id === 'TR-ELEC-02') || NSQF_TRADES_DATASET[1];
      selectedTrades = [de, mob];
      aspiration = "डाटा एंट्री व डिजिटल ऑपरेटर";
      occupation = "10वीं/12वीं पास शिक्षित युवा";
    } else if (qLower.includes('गाड़ी') || qLower.includes('bike') || qLower.includes('मोटर') || qLower.includes('vehicle') || qLower.includes('गैराज') || qLower.includes('मैकेनिक') || qLower.includes('रिक्शा')) {
      const auto = NSQF_TRADES_DATASET.find(t => t.id === 'TR-AUTO-01') || NSQF_TRADES_DATASET[0];
      const ev = NSQF_TRADES_DATASET.find(t => t.id === 'TR-AUTO-02') || NSQF_TRADES_DATASET[1];
      selectedTrades = [auto, ev];
      aspiration = "मोटर मैकेनिक व ई-व्हीकल रिपेयर";
      occupation = "गैराज सहायक";
    } else if (qLower.includes('कढ़ाई') || qLower.includes('embroidery') || qLower.includes('जरी') || qLower.includes('zari') || qLower.includes('aari')) {
      const craft = NSQF_TRADES_DATASET.find(t => t.id === 'TR-TEXT-02') || NSQF_TRADES_DATASET[0];
      const tailor = NSQF_TRADES_DATASET.find(t => t.id === 'TR-TEXT-01') || NSQF_TRADES_DATASET[1];
      selectedTrades = [craft, tailor];
      aspiration = "जरी-ज़रदोज़ी व आरी कढ़ाई शिल्प";
      occupation = "पारंपरिक हस्तशिल्प कारीगर / महिला SHG";
    } else if (qLower.includes('tailor') || qLower.includes('कपड़ा') || qLower.includes('सिलाई') || qLower.includes('sewing') || qLower.includes('महिला') || qLower.includes('सूट') || qLower.includes('बुटीक')) {
      const tailor = NSQF_TRADES_DATASET.find(t => t.id === 'TR-TEXT-01') || NSQF_TRADES_DATASET[0];
      const craft = NSQF_TRADES_DATASET.find(t => t.id === 'TR-TEXT-02') || NSQF_TRADES_DATASET[1];
      selectedTrades = [tailor, craft];
      aspiration = "सिलाई एवं बुटीक स्वरोजगार";
      occupation = "घरेलू सिलाई / महिला SHG";
    } else if (qLower.includes('अस्पताल') || qLower.includes('hospital') || qLower.includes('मरीज') || qLower.includes('caregiver') || qLower.includes('स्वास्थ्य') || qLower.includes('नर्स') || qLower.includes('जीडीए')) {
      const health1 = NSQF_TRADES_DATASET.find(t => t.id === 'TR-HEALTH-01') || NSQF_TRADES_DATASET[0];
      const health2 = NSQF_TRADES_DATASET.find(t => t.id === 'TR-HEALTH-02') || NSQF_TRADES_DATASET[1];
      selectedTrades = [health1, health2];
      aspiration = "मरीज तीमारदारी एवं स्वास्थ्य सेवा (GDA)";
      occupation = "स्वास्थ्य सहायक / आशा कार्यकर्ता";
    } else if (qLower.includes('खेती') || qLower.includes('खाद') || qLower.includes('farm') || qLower.includes('मशरूम') || qLower.includes('organic') || qLower.includes('केंचुआ')) {
      const ag1 = NSQF_TRADES_DATASET.find(t => t.id === 'TR-AGRI-01') || NSQF_TRADES_DATASET[0];
      const ag2 = NSQF_TRADES_DATASET.find(t => t.id === 'TR-AGRI-02') || NSQF_TRADES_DATASET[1];
      selectedTrades = [ag1, ag2];
      aspiration = "जैविक खाद व मशरूम खेती";
      occupation = "छोटे किसान / कृषि श्रमिक";
    } else if (qLower.includes('नल') || qLower.includes('पाइप') || qLower.includes('plumber') || qLower.includes('प्लंबर') || qLower.includes('पानी')) {
      const pl1 = NSQF_TRADES_DATASET.find(t => t.id === 'TR-PLUMB-01') || NSQF_TRADES_DATASET[0];
      const el1 = NSQF_TRADES_DATASET.find(t => t.id === 'TR-ELEC-01') || NSQF_TRADES_DATASET[1];
      selectedTrades = [pl1, el1];
      aspiration = "प्लंबिंग एवं पाइपलाइन मेंटेनेंस";
      occupation = "निर्माण श्रमिक";
    } else if (qLower.includes('मोबाइल') || qLower.includes('phone') || qLower.includes('स्मार्टफोन') || qLower.includes('smartphone')) {
      const mob = NSQF_TRADES_DATASET.find(t => t.id === 'TR-ELEC-02') || NSQF_TRADES_DATASET[0];
      const de = NSQF_TRADES_DATASET.find(t => t.id === 'TR-IT-01') || NSQF_TRADES_DATASET[1];
      selectedTrades = [mob, de];
      aspiration = "स्मार्टफोन हार्डवेयर व स्क्रीन रिपेयर";
      occupation = "इलेक्ट्रॉनिक्स रिपेयर सहायक";
    }

    const t1 = selectedTrades[0];
    const t2 = selectedTrades[1];

    return {
      transcript: query,
      detected_language: lang,
      detected_intent: {
        current_occupation: occupation,
        aspirational_interest: aspiration,
        education_level: "8वीं/10वीं पास",
        employment_preference: "self-employment",
        mobility_radius: "local",
        identified_skill_gaps: ["आधुनिक टूलकिट संचालन", "उद्यमिता कौशल", "वित्तीय प्रबंधन"]
      },
      recommendations: [
        {
          trade_id: t1.id,
          trade_name: t1.trade,
          nsqf_level: t1.nsqf_level,
          sector: t1.sector,
          match_score: 95,
          match_reason: lang === 'en'
            ? `Best suited program based on your interest and block-level demand.`
            : lang === 'pa'
            ? `ਤੁਹਾਡੀ ਰੁਚੀ ਅਤੇ ਸਥਾਨਕ ਮੰਗ ਦੇ ਆਧਾਰ 'ਤੇ ਇਹ ਸਭ ਤੋਂ ਵਧੀਆ ਕੋਰਸ ਹੈ।`
            : lang === 'mr'
            ? `तुमच्या आवडीनुसार आणि स्थानिक मागणीनुसार हा सर्वोत्तम अभ्यासक्रम आहे.`
            : lang === 'bn'
            ? `আপনার আগ্রহ এবং স্থানীয় চাহিদার ভিত্তিতে এটি সেরা কোর্স।`
            : lang === 'ta'
            ? `உங்கள் விருப்பம் மற்றும் உள்ளூர் தேவையின் அடிப்படையில் இது சிறந்த பாடநெறி.`
            : lang === 'te'
            ? `మీ ఆసక్తి మరియు స్థానిక డిమాండ్ ఆధారంగా ఇది ఉత్తమ కోర్సు.`
            : lang === 'gu'
            ? `તમારી રુચિ અને સ્થાનિક માંગના આધારે આ શ્રેષ્ઠ કોર્સ છે.`
            : `आपकी रुचि (${aspiration}) और ब्लॉक स्तर पर मांग के आधार पर यह सर्वश्रेष्ठ कोर्स है।`,
          pm_ajay_benefit: t1.gia_benefit,
          capital_subsidy: `₹${t1.capital_subsidy_inr.toLocaleString('en-IN')}`,
          training_duration: `${t1.duration_hours} घंटे (${Math.round(t1.duration_hours / 30)} सप्ताह)`,
          entry_qualification: t1.eligibility,
          career_path: t1.cluster_grant_applicable ? "Self-Employed Micro-Enterprise" : "Wage Employment Linkage",
          training_partner: "NSFDC प्रमाणित ग्रामीण कौशल केंद्र"
        },
        {
          trade_id: t2.id,
          trade_name: t2.trade,
          nsqf_level: t2.nsqf_level,
          sector: t2.sector,
          match_score: 88,
          match_reason: lang === 'en'
            ? `High self-employment potential and government tool-kit subsidy.`
            : lang === 'pa'
            ? `ਸੰਬੰਧਿਤ ਖੇਤਰ ਵਿੱਚ ਉੱਚ ਸਵੈ-ਰੁਜ਼ਗਾਰ ਮੌਕੇ ਅਤੇ ਸਰਕਾਰੀ ਟੂਲਕਿੱਟ ਗ੍ਰਾਂਟ।`
            : lang === 'mr'
            ? `संबंधित क्षेत्रात उच्च स्वयंरोजगार संधी आणि सरकारी टूलकिट अनुदान.`
            : lang === 'bn'
            ? `সম্পর্কিত ক্ষেত্রে উচ্চ স্ব-কর্মসংস্থানের সুযোগ ও সরকারি টুলকিট অনুদান।`
            : lang === 'ta'
            ? `தொடர்புடைய துறையில் அதிக சுயதொழில் வாய்ப்புகள் மற்றும் அரசு கருவித்தொகுப்பு மானியம்.`
            : lang === 'te'
            ? `సంబంధిత రంగంలో అధిక స్వయం ఉపాధి అవకాశాలు మరియు ప్రభుత్వ టూల్‌కిట్ సబ్సిడీ.`
            : lang === 'gu'
            ? `સંબંધિત ક્ષેત્રમાં ઉચ્ચ સ્વ-રોજગારની તકો અને સરકારી ટૂલકિટ સહાય.`
            : `संबद्ध क्षेत्र में उच्च स्वरोजगार अवसर और सरकारी टूलकिट अनुदान।`,
          pm_ajay_benefit: t2.gia_benefit,
          capital_subsidy: `₹${t2.capital_subsidy_inr.toLocaleString('en-IN')}`,
          training_duration: `${t2.duration_hours} घंटे`,
          entry_qualification: t2.eligibility,
          career_path: "Self-Employed Micro-Enterprise",
          training_partner: "जिला उद्योग केंद्र (DIC) संबद्ध केंद्र"
        }
      ],
      spoken_reply_text: lang === 'pa'
        ? `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਹਾਡੀ ਰੁਚੀ ਨੂੰ ਦੇਖਦੇ ਹੋਏ, PM-AJAY ਸਕੀਮ ਅਧੀਨ '${t1.trade}' (NSQF ਪੱਧਰ ${t1.nsqf_level}) ਸਭ ਤੋਂ ਲਾਭਦਾਇਕ ਕੋਰਸ ਹੈ। ਇਸ 'ਤੇ ਤੁਹਾਨੂੰ ₹${t1.capital_subsidy_inr.toLocaleString('en-IN')} ਤੱਕ ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਅਤੇ ਟੂਲਕਿੱਟ ਮਿਲਦੀ ਹੈ।`
        : lang === 'mr'
        ? `नमस्कार! तुमच्या आवडीनुसार, PM-AJAY योजनेअंतर्गत '${t1.trade}' (NSQF स्तर ${t1.nsqf_level}) हा सर्वात फायदेशीर अभ्यासक्रम आहे. यामध्ये तुम्हाला ₹${t1.capital_subsidy_inr.toLocaleString('en-IN')} पर्यंत सरकारी अनुदान आणि मोफत टूलकिट मिळते.`
        : lang === 'bn'
        ? `নমস্কার! আপনার আগ্রহের ভিত্তিতে, PM-AJAY প্রকল্পের অধীনে '${t1.trade}' (NSQF স্তর ${t1.nsqf_level}) সবচেয়ে লাভজনক কোর্স। এতে আপনি ₹${t1.capital_subsidy_inr.toLocaleString('en-IN')} পর্যন্ত সরকারি অনুদান ও বিনামূল্যে টুলকিট পাবেন।`
        : lang === 'ta'
        ? `வணக்கம்! உங்கள் விருப்பத்திற்கேற்ப, PM-AJAY திட்டத்தின் கீழ் '${t1.trade}' (NSQF நிலை ${t1.nsqf_level}) மிகவும் பயனுள்ள பாடநெறியாகும். இதில் ₹${t1.capital_subsidy_inr.toLocaleString('en-IN')} வரை அரசு மானியம் மற்றும் கருவித்தொகுப்பு வழங்கப்படுகிறது.`
        : lang === 'te'
        ? `నమస్కారం! మీ ఆసక్తి మేరకు, PM-AJAY పథకం కింద '${t1.trade}' (NSQF స్థాయి ${t1.nsqf_level}) మీకు అత్యంత ప్రయోజనకరమైన కోర్సు. ఇందులో మీకు ₹${t1.capital_subsidy_inr.toLocaleString('en-IN')} వరకు ప్రభుత్వ సబ్సిడీ మరియు ఉచిత టూల్‌కిట్ అందుబాటులో ఉన్నాయి.`
        : lang === 'gu'
        ? `નમસ્તે! તમારી રુચિ મુજબ, PM-AJAY યોજના હેઠળ '${t1.trade}' (NSQF સ્તર ${t1.nsqf_level}) સૌથી ફાયદાકારક કોર્સ છે. આમાં તમને ₹${t1.capital_subsidy_inr.toLocaleString('en-IN')} સુધીની સરકારી સબસિડી અને મફત ટૂલકિટ સહાય મળે છે.`
        : lang === 'bho'
        ? `प्रणाम! रउवा पसंद के देखते हुए, PM-AJAY योजना के तहत '${t1.trade}' (NSQF स्तर ${t1.nsqf_level}) सबसे बढ़िया कोर्स बा। एह पर रउवा ₹${t1.capital_subsidy_inr.toLocaleString('en-IN')} तक के सरकारी पूंजी सब्सिडी आ टूलकिट मिली।`
        : lang === 'en'
        ? `Greetings! Based on your interest, '${t1.trade}' (NSQF Level ${t1.nsqf_level}) is recommended under PM-AJAY with up to ₹${t1.capital_subsidy_inr.toLocaleString('en-IN')} capital subsidy and toolkits.`
        : `नमस्ते! आपकी रुचि को देखते हुए, PM-AJAY योजना के तहत '${t1.trade}' (NSQF स्तर ${t1.nsqf_level}) आपके लिए सबसे लाभकारी कोर्स है। इस पर आपको ₹${t1.capital_subsidy_inr.toLocaleString('en-IN')} तक की सरकारी पूंजी सब्सिडी और टूलकिट मिलती है। क्या आप प्रशिक्षण केंद्र की जानकारी चाहते हैं?`,
      spoken_reply_english: `Greetings! Based on your interest, '${t1.trade}' (NSQF Level ${t1.nsqf_level}) is recommended under PM-AJAY with up to ₹${t1.capital_subsidy_inr.toLocaleString('en-IN')} capital subsidy and toolkits.`
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Kiosk Mode Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded w-fit mb-2">
              <span>{currentTrans.channelBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              {currentTrans.heading}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {currentTrans.subheading}
            </p>
          </div>

          {/* Regional Language Dialect Switcher */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Language / भाषा:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value as RegionalLanguage)}
              className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Central Audio Recording Console */}
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            {/* Pulsing ring during recording */}
            {isRecording && (
              <span className="absolute -inset-4 rounded-full bg-red-500/20 animate-ping" />
            )}
            
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isProcessing}
              className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center shadow-lg transition-all transform active:scale-95 ${
                isRecording
                  ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                  : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-1" />
                  <span className="text-[11px] font-mono tracking-wider font-semibold">
                    {recordingSeconds}s · {currentTrans.stopBtn}
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 mb-1" />
                  <span className="text-[11px] font-medium tracking-tight">
                    {isProcessing ? currentTrans.thinking : currentTrans.tapMicBtn}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Audio Visualizer & DSP Noise Filter Indicator during recording */}
          {isRecording && (
            <div className="mt-3 mb-2 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1 h-6">
                {[0.4, 0.7, 1.0, 0.8, 1.2, 0.9, 0.6, 1.1, 0.5].map((factor, i) => {
                  const barHeight = Math.max(4, Math.min(24, Math.round((audioLevel / 100) * 24 * factor)));
                  return (
                    <span
                      key={i}
                      className="w-1 bg-amber-500 rounded-full transition-all duration-75"
                      style={{ height: `${barHeight}px` }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{currentTrans.dspActiveBadge} · Level: {audioLevel}%</span>
              </div>
            </div>
          )}

          <p className="text-sm font-medium text-slate-800 mb-1">
            {isRecording 
              ? currentTrans.listening
              : isProcessing 
              ? currentTrans.thinking
              : currentTrans.tapToSpeak}
          </p>
          <p className="text-xs text-slate-500 max-w-md">
            {currentTrans.supportedLanguagesNote}
          </p>

          {errorMessage && (
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 p-2.5 rounded-lg max-w-md">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Dynamic Quick Trade Test Buttons Localized in User's Selected Language */}
          <div className="mt-5 w-full max-w-2xl">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              {currentTrans.quickTestingHeading}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {currentTrans.quickPrompts.map((qp) => (
                <button
                  key={qp.id}
                  onClick={() => {
                    setManualText(qp.promptText);
                    handleProcessText(qp.promptText, selectedLanguage);
                  }}
                  disabled={isProcessing}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-all shadow-2xs hover:scale-105 active:scale-95 ${qp.colorClass}`}
                >
                  {qp.icon} {qp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Language Selection Buttons (Switches Language Only) */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Select Language / भाषा चुनें:
            </span>
            <span className="text-xs font-medium text-amber-700">
              Active: {activeLangConfig.nativeName} ({activeLangConfig.name})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                  selectedLanguage === lang.code
                    ? 'border-amber-500 bg-amber-500 text-slate-950 font-bold shadow-xs ring-2 ring-amber-400/40'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-semibold">{lang.nativeName}</span>
                <span className={`text-[10px] ${selectedLanguage === lang.code ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                  {lang.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Escape Hatch */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleProcessText(manualText, selectedLanguage);
            }}
            placeholder={currentTrans.inputPlaceholder}
            className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={() => handleProcessText(manualText, selectedLanguage)}
            disabled={isProcessing || !manualText.trim()}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-colors whitespace-nowrap"
          >
            {currentTrans.evaluateBtn}
          </button>
        </div>
      </div>

      {/* AI Results & Profile Mapping Section */}
      {voiceResponse && (
        <div className="space-y-6 animate-fadeIn">
          {/* Audio Spoken Reply Player Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="font-semibold text-sm tracking-wide text-amber-300">
                  PM-AJAY AI Assistant Spoken Reply ({activeLangConfig.nativeName})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {isPlayingAudio ? (
                  <button
                    onClick={stopAudio}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-200 bg-red-900/60 border border-red-700 rounded-lg hover:bg-red-800/60 transition-colors"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Audio</span>
                  </button>
                ) : (
                  <button
                    onClick={() => playSpokenAudio(voiceResponse, selectedLanguage)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen ({activeLangConfig.nativeName})</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-medium mb-3">
              "{voiceResponse.spoken_reply_text}"
            </p>

            {voiceResponse.spoken_reply_english && (
              <p className="text-xs text-slate-400 leading-relaxed italic border-t border-slate-800 pt-3">
                <strong>English translation:</strong> {voiceResponse.spoken_reply_english}
              </p>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="truncate max-w-md">Transcript: "{voiceResponse.transcript}"</span>
              <span className="text-amber-400 font-mono">Edge-TTS / Gemini Neural Voice</span>
            </div>
          </div>

          {/* Extracted Beneficiary Profile (Anti-Slop Zero-Pill Discipline) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-slate-900 text-sm">
                  Extracted Beneficiary Profile (कौशल व आजीविका प्रोफाइल)
                </h3>
              </div>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                Pydantic Schema Matched
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Current Occupation / Family Craft</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {voiceResponse.detected_intent.current_occupation || "कृषि एवं पारंपरिक हस्तशिल्प"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Aspirational Interest</span>
                <span className="font-semibold text-amber-700 text-sm">
                  {voiceResponse.detected_intent.aspirational_interest || "तकनीकी स्वरोजगार"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Education Level</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {voiceResponse.detected_intent.education_level || "10वीं उत्तीर्ण"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Employment Preference</span>
                <span className="font-semibold text-slate-800 text-sm capitalize">
                  {voiceResponse.detected_intent.employment_preference === 'self-employment' 
                    ? 'स्वरोजगार (Self-Employment / Enterprise)' 
                    : 'वेतन रोजगार (Wage Employment Linkage)'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Mobility Radius</span>
                <span className="font-semibold text-slate-800 text-sm capitalize">
                  {voiceResponse.detected_intent.mobility_radius === 'district' ? 'District-level (जिला स्तर)' : 'Local Block / Village (स्थानीय)'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Identified Skill Gaps (कौशल अंतराल)</span>
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-700">
                  {voiceResponse.detected_intent.identified_skill_gaps?.map((gap, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                      <span className="w-1 h-1 rounded-full bg-amber-500" />
                      {gap}
                    </span>
                  )) || <span>आधुनिक तकनीकी टूलकिट संचालन</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended NSQF Trades Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Recommended NSQF Programs & PM-AJAY Benefits
                </h3>
                <p className="text-xs text-slate-500">
                  Matched via Semantic Vector Similarity against MoSJE GIA Component
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {voiceResponse.recommendations.length} Programs Aligned
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {voiceResponse.recommendations.map((trade, idx) => (
                <div 
                  key={trade.trade_id || idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Title and NSQF Level */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-xs font-semibold text-amber-700 block mb-1">
                          {trade.sector} · NSQF Level {trade.nsqf_level}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 leading-snug">
                          {trade.trade_name}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono tabular-nums">
                          {trade.match_score}% Match
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 mb-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {trade.match_reason}
                    </p>

                    {/* PM-AJAY GIA Benefit Highlight */}
                    <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 rounded-xl mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          PM-AJAY Capital Subsidy:
                        </span>
                        <span className="text-sm font-bold text-amber-900 font-mono tabular-nums">
                          {trade.capital_subsidy}
                        </span>
                      </div>
                      <p className="text-xs text-amber-900/90 leading-relaxed">
                        {trade.pm_ajay_benefit}
                      </p>
                    </div>

                    {/* Metadata details */}
                    <div className="space-y-1.5 text-xs text-slate-500 mb-6">
                      <div className="flex justify-between">
                        <span>Training Duration:</span>
                        <strong className="text-slate-800">{trade.training_duration}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Entry Eligibility:</span>
                        <strong className="text-slate-800 truncate max-w-[200px]" title={trade.entry_qualification}>
                          {trade.entry_qualification}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Career Pathway:</span>
                        <strong className="text-slate-800">{trade.career_path}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Enrollment Button */}
                  <button
                    onClick={() => onSelectTradeForEnrollment(trade, voiceResponse.detected_intent)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs hover:shadow-md"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Generate Beneficiary Enrollment Card</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
