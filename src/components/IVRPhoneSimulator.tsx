import React, { useState, useRef, useEffect } from 'react';
import { Phone, PhoneCall, PhoneOff, Volume2, MessageSquare, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';
import { NSQFRecommendation } from '../types/pmajay';

interface IVRPhoneSimulatorProps {
  onEnrollFromIVR?: (recommendation: NSQFRecommendation) => void;
}

export const IVRPhoneSimulator: React.FC<IVRPhoneSimulatorProps> = ({ onEnrollFromIVR }) => {
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [ivrPrompt, setIvrPrompt] = useState('');
  const [ivrPromptEnglish, setIvrPromptEnglish] = useState('');
  const [ivrOptions, setIvrOptions] = useState<Array<{ digit: string; label: string }>>([]);
  const [collectedDigits, setCollectedDigits] = useState<string[]>([]);
  const [finalRecommendation, setFinalRecommendation] = useState<any>(null);
  const [smsMessage, setSmsMessage] = useState<string | null>(null);

  const durationTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Play realistic DTMF Tone when button is clicked
  const playDTMFTone = (digit: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Standard DTMF Frequencies
      const dtmfFreqs: Record<string, [number, number]> = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
      };

      const freqs = dtmfFreqs[digit] || [700, 1200];
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];
      gain.gain.value = 0.15;

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        osc1.stop();
        osc2.stop();
      }, 150);
    } catch (e) {
      // audio context not available
    }
  };

  // Speak prompt using speech synthesis
  const speakIVRPrompt = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start Call
  const handleStartCall = async () => {
    setCallStatus('calling');
    setCallDuration(0);
    setCollectedDigits([]);
    setFinalRecommendation(null);
    setSmsMessage(null);

    // Simulate connecting after 1.5 seconds
    setTimeout(async () => {
      setCallStatus('connected');
      durationTimerRef.current = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Trigger Step 1 API
      await sendIVRStep(1, null, []);
    }, 1500);
  };

  // End Call
  const handleEndCall = () => {
    setCallStatus('ended');
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Send Step to Server
  const sendIVRStep = async (step: number, digit: string | null, prevDigits: string[]) => {
    try {
      const res = await fetch('/api/ivr/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step,
          digit,
          previousDigits: prevDigits,
          language: 'hi'
        })
      });

      const data = await res.json();
      setCurrentStep(data.step);
      setIvrPrompt(data.prompt);
      setIvrPromptEnglish(data.promptEnglish);
      setIvrOptions(data.options || []);

      if (data.finalRecommendations && data.finalRecommendations.length > 0) {
        setFinalRecommendation(data.finalRecommendations[0]);
      }

      if (data.smsDispatched) {
        const matched = data.finalRecommendations?.[0]?.trade || "Solar PV Installer";
        setSmsMessage(`[MoSJE PM-AJAY] प्रिय लाभार्थी, आपका '${matched}' हेतु प्रारंभिक पंजीकरण पूर्ण हुआ। जिला परामर्श केंद्र: NSFDC Gorakhpur (हेल्पलाइन: 1800-11-2529)`);
      }

      // Voice prompt playback
      speakIVRPrompt(data.prompt);
    } catch (err) {
      console.warn("IVR server error, using fallback state:", err);
      handleIVRFallback(step, digit);
    }
  };

  // Fallback step handler if server unavailable
  const handleIVRFallback = (step: number, digit: string | null) => {
    if (step === 1) {
      const p = "नमस्कार, प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना (PM-AJAY) आजीविका हेल्पलाइन में आपका स्वागत है। हिन्दी के लिए 1 दबाएं, भोजपुरी के लिए 2, अंग्रेजी के लिए 3।";
      setIvrPrompt(p);
      setIvrPromptEnglish("Welcome to PM-AJAY Livelihood Helpline. Press 1 for Hindi, 2 for Bhojpuri, 3 for English.");
      setIvrOptions([
        { digit: "1", label: "हिन्दी (Hindi)" },
        { digit: "2", label: "भोजपुरी (Bhojpuri)" },
        { digit: "3", label: "English" }
      ]);
      speakIVRPrompt(p);
    } else if (step === 2) {
      const p = "कौशल चयन: सौर ऊर्जा एवं बिजली के लिए 1 दबाएं, वाहन गैराज के लिए 2, जैविक खेती के लिए 3, सिलाई के लिए 4।";
      setIvrPrompt(p);
      setIvrPromptEnglish("Select sector: Press 1 for Solar/Electrical, 2 for Automotive, 3 for Agriculture, 4 for Tailoring.");
      setIvrOptions([
        { digit: "1", label: "Solar & Electrical (सौर ऊर्जा)" },
        { digit: "2", label: "Automotive (वाहन मैकेनिक)" },
        { digit: "3", label: "Agriculture (जैविक खेती)" },
        { digit: "4", label: "Apparel (सिलाई/बुटीक)" }
      ]);
      speakIVRPrompt(p);
    } else {
      let matchedTrade = "Solar PV Installer (Suryamitra)";
      let subsidy = "₹50,000";
      const lastDigit = digit || (collectedDigits.length > 0 ? collectedDigits[collectedDigits.length - 1] : "1");

      if (lastDigit === "2") {
        matchedTrade = "Two Wheeler Service Technician";
        subsidy = "₹50,000";
      } else if (lastDigit === "3") {
        matchedTrade = "Commercial Horticulture & Vermicompost Producer";
        subsidy = "100% GIA Grant";
      } else if (lastDigit === "4") {
        matchedTrade = "Assistant Dress Maker & Fashion Tailor";
        subsidy = "₹30,000 Toolkit & Machine";
      }

      const p = `बधाई हो! आपकी रुचि के अनुसार PM-AJAY के तहत '${matchedTrade}' कोर्स अनुशंसित है। इसमें ${subsidy} सहायता उपलब्ध है।`;
      setIvrPrompt(p);
      setIvrPromptEnglish(`Recommended: ${matchedTrade} with ${subsidy} under PM-AJAY.`);
      setIvrOptions([]);
      setSmsMessage(`[MoSJE PM-AJAY] बधाई! आपका '${matchedTrade}' कोर्स व ${subsidy} सहायता हेतु चयन हुआ है। विवरण: 1800-11-2529.`);
      speakIVRPrompt(p);
    }
  };

  // Handle DTMF Key Press
  const handleKeyPress = async (digit: string) => {
    playDTMFTone(digit);
    if (callStatus !== 'connected') return;

    const newDigits = [...collectedDigits, digit];
    setCollectedDigits(newDigits);

    if (currentStep === 1) {
      await sendIVRStep(2, digit, newDigits);
    } else if (currentStep === 2) {
      await sendIVRStep(3, digit, newDigits);
    } else if (currentStep === 3) {
      await sendIVRStep(4, digit, newDigits);
    }
  };

  const formatSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded w-fit mb-1">
              <span>Channel 2: Toll-Free IVR Service (1800-PM-AJAY)</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              Non-Smartphone & Feature-Phone Interactive Voice Helpline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empowering rural SC beneficiaries without internet or smartphones via toll-free voice calls & DTMF keypad prompts.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Toll-Free: 1800-11-2529
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Simulated Mobile / Feature Phone Shell */}
          <div className="md:col-span-6 flex justify-center">
            <div className="w-72 bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border-4 border-slate-800 text-white relative">
              {/* Phone Speaker Notch */}
              <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mb-4" />

              {/* Phone Screen */}
              <div className="bg-slate-800 rounded-2xl p-4 min-h-[170px] border border-slate-700/80 mb-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                    <span>PM-AJAY IVR</span>
                    <span className="font-mono">{callStatus === 'connected' ? formatSeconds(callDuration) : '00:00'}</span>
                  </div>

                  {callStatus === 'idle' && (
                    <div className="text-center py-6">
                      <p className="text-xs text-slate-400">Ready to Dial</p>
                      <p className="text-sm font-bold text-amber-400 font-mono mt-1">1800-11-AJAY</p>
                      <p className="text-[10px] text-slate-500 mt-2">Press Call button below to connect</p>
                    </div>
                  )}

                  {callStatus === 'calling' && (
                    <div className="text-center py-6">
                      <p className="text-xs text-amber-400 animate-pulse">Calling Toll-Free...</p>
                      <p className="text-sm font-bold text-white font-mono mt-1">1800-11-2529</p>
                      <p className="text-[10px] text-slate-400 mt-2">Connecting to MoSJE IVR Gateway</p>
                    </div>
                  )}

                  {callStatus === 'connected' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Connected · Step {currentStep === -1 ? 'Complete' : currentStep}</span>
                      </div>
                      <p className="text-xs text-slate-100 line-clamp-3 leading-snug font-medium">
                        "{ivrPrompt}"
                      </p>
                    </div>
                  )}

                  {callStatus === 'ended' && (
                    <div className="text-center py-6">
                      <p className="text-xs text-slate-400">Call Ended</p>
                      <p className="text-[11px] text-slate-300 mt-1">Total Duration: {formatSeconds(callDuration)}</p>
                      <p className="text-[10px] text-amber-400 mt-2">Check SMS below for registration pass</p>
                    </div>
                  )}
                </div>

                {/* Keypad entry indicators */}
                <div className="text-center pt-2 border-t border-slate-700/60">
                  <span className="text-[10px] text-slate-400">
                    Pressed Keys: <strong className="text-amber-400 font-mono">{collectedDigits.join(' ➔ ') || 'None'}</strong>
                  </span>
                </div>
              </div>

              {/* 12-Key DTMF Dial Pad */}
              <div className="grid grid-cols-3 gap-2 px-2 mb-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeyPress(digit)}
                    className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-600 transition-colors flex flex-col items-center justify-center font-bold text-sm text-slate-100 shadow-xs"
                  >
                    <span>{digit}</span>
                  </button>
                ))}
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center gap-4 px-2">
                {callStatus !== 'connected' ? (
                  <button
                    onClick={handleStartCall}
                    disabled={callStatus === 'calling'}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Dial 1800</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEndCall}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Call</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Call Step Guidance & Live SMS Viewer */}
          <div className="md:col-span-6 space-y-5">
            {/* Live Interactive Prompts Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-700">Live IVR Script & DTMF Guidance:</span>
                {callStatus === 'connected' && (
                  <button 
                    onClick={() => speakIVRPrompt(ivrPrompt)}
                    className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-medium"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Replay Voice</span>
                  </button>
                )}
              </div>

              {callStatus === 'connected' ? (
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 block mb-1">IVR Voice (Hindi):</span>
                    <p className="text-slate-800 font-medium leading-relaxed">{ivrPrompt}</p>
                    {ivrPromptEnglish && (
                      <p className="text-slate-500 mt-2 text-[11px] italic border-t border-slate-100 pt-1.5">
                        {ivrPromptEnglish}
                      </p>
                    )}
                  </div>

                  {ivrOptions.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block mb-2">Available Keypad Options:</span>
                      <div className="space-y-1.5">
                        {ivrOptions.map(opt => (
                          <button
                            key={opt.digit}
                            onClick={() => handleKeyPress(opt.digit)}
                            className="w-full text-left p-2.5 bg-white hover:bg-amber-50 rounded-lg border border-slate-200 hover:border-amber-300 transition-all text-xs flex items-center justify-between group"
                          >
                            <span className="text-slate-800 font-medium group-hover:text-amber-900">{opt.label}</span>
                            <span className="px-2 py-0.5 bg-slate-100 group-hover:bg-amber-200 text-slate-900 font-mono font-bold rounded text-[11px]">
                              Press [{opt.digit}]
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-4 text-center">
                  Press <strong>"Dial 1800"</strong> on the phone to experience the IVR call flow.
                </div>
              )}
            </div>

            {/* Simulated SMS Received by Beneficiary */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 mb-2">
                <MessageSquare className="w-4 h-4 text-amber-700" />
                <span>Simulated Confirmation SMS (Delivered to Mobile):</span>
              </div>

              {smsMessage ? (
                <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-slate-800 font-mono leading-relaxed shadow-xs">
                  {smsMessage}
                </div>
              ) : (
                <p className="text-xs text-amber-800/80 italic">
                  An automatic SMS with training center location, course dates, and capital subsidy voucher code will be dispatched when the call completes.
                </p>
              )}
            </div>

            {finalRecommendation && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                <span className="font-semibold text-emerald-900 block mb-1">
                  ✓ Matched Trade: {finalRecommendation.trade} (NSQF Level {finalRecommendation.nsqf_level})
                </span>
                <p className="text-emerald-800 leading-relaxed">
                  Eligible for PM-AJAY capital subsidy of ₹{finalRecommendation.capital_subsidy_inr.toLocaleString('en-IN')}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
