import React, { useState } from 'react';
import { Send, Mic, Play, Pause, Volume2, FileDown, CheckCheck, Sparkles, MessageCircle } from 'lucide-react';
import { WhatsAppMessageItem } from '../types/pmajay';

export const WhatsAppVoiceBot: React.FC = () => {
  const [messages, setMessages] = useState<WhatsAppMessageItem[]>([
    {
      id: 'wa-1',
      sender: 'bot',
      type: 'text',
      text: 'नमस्ते! मैं PM-AJAY आजीविका सहायक हूँ। आप मुझे बोलकर (वॉइस नोट) बताएं कि आप कौन सा काम या कौशल सीखना चाहते हैं?',
      timestamp: '10:30 AM',
    },
    {
      id: 'wa-2',
      sender: 'user',
      type: 'audio',
      text: 'मुझे अपने गांव में सिलाई और बुटीक का काम शुरू करना है। क्या सरकारी मदद मिलेगी?',
      audioDurationSeconds: 8,
      timestamp: '10:31 AM',
    },
    {
      id: 'wa-3',
      sender: 'bot',
      type: 'audio',
      text: 'नमस्ते बहन! PM-AJAY के तहत "Assistant Dress Maker & Fashion Tailor" (NSQF Level 3) का कोर्स उपलब्ध है। इसमें स्वयं सहायता समूह (SHG) को ₹30,000 की मोटर चालित सिलाई मशीन और टूलकिट अनुदान मिलता है।',
      audioDurationSeconds: 14,
      timestamp: '10:31 AM',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isSimulatingBotReply, setIsSimulatingBotReply] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  // Quick voice query presets
  const sampleVoiceNotes = [
    {
      title: 'Solar & Inverter (सौर ऊर्जा)',
      text: 'मैं 10वीं पास हूँ, सोलर पैनल लगाने का काम सीखना चाहता हूँ।',
    },
    {
      title: 'EV & Bike Mechanic (मोटर मैकेनिक)',
      text: 'हमरा ट्रैक्टर आ बाइक गैराज खोले के बा, का योजना बा?',
    },
    {
      title: 'Organic Farming & Compost (जैविक खाद)',
      text: 'मला शेतीसोबत गांडूळ खत आणि सेंद्रिय भाजीपाला उद्योग करायचा आहे.',
    },
    {
      title: 'Dress Making & Boutique (सिलाई केंद्र)',
      text: 'गांव की महिलाओं के साथ सिलाई केंद्र शुरू करना है, मशीन सब्सिडी चाहिए।',
    },
  ];

  const handleSendVoiceNote = async (text: string) => {
    const userMsgId = `user-${Date.now()}`;
    const userMsg: WhatsAppMessageItem = {
      id: userMsgId,
      sender: 'user',
      type: 'audio',
      text: text,
      audioDurationSeconds: Math.floor(Math.random() * 6) + 6,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSimulatingBotReply(true);

    try {
      const res = await fetch('/api/whatsapp/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      const botMsg: WhatsAppMessageItem = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        type: 'audio',
        text: data.botReplyText || 'आपकी रुचि के अनुसार PM-AJAY योजना में उच्च अनुदान स्वीकृत है।',
        audioDurationSeconds: 12,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        schemeData: data.schemeCard,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsSimulatingBotReply(false);

      // Play audio reply
      speakWhatsAppText(botMsg.text || '');
    } catch (e) {
      setTimeout(() => {
        const botMsg: WhatsAppMessageItem = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          type: 'audio',
          text: `नमस्ते। आपकी रुचि अनुसार PM-AJAY में कौशल प्रशिक्षण व ₹50,000 तक की पूंजी सब्सिडी उपलब्ध है।`,
          audioDurationSeconds: 10,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsSimulatingBotReply(false);
        speakWhatsAppText(botMsg.text || '');
      }, 1000);
    }
  };

  const speakWhatsAppText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const togglePlayAudio = (msg: WhatsAppMessageItem) => {
    if (playingMessageId === msg.id) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingMessageId(null);
    } else {
      setPlayingMessageId(msg.id);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(msg.text || '');
        utterance.lang = 'hi-IN';
        utterance.onend = () => setPlayingMessageId(null);
        utterance.onerror = () => setPlayingMessageId(null);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded w-fit mb-1">
              <span>Channel 3: WhatsApp Community Voice-Note Bot</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              Rural Community WhatsApp Voice Assistant
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Replicating village WhatsApp groups where field workers, Panchayats, and beneficiaries send voice notes and receive instant voice advice.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg font-medium border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>+91 1800-PM-AJAY</span>
          </div>
        </div>

        {/* WhatsApp Mobile Container */}
        <div className="max-w-md mx-auto bg-[#EFEAE2] rounded-3xl overflow-hidden shadow-lg border border-slate-300">
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-700 border border-emerald-400 flex items-center justify-center font-bold text-sm">
                अ
              </div>
              <div>
                <h4 className="font-semibold text-xs leading-tight">PM-AJAY Livelihood Assistant</h4>
                <p className="text-[10px] text-emerald-200">Official MoSJE Verified Business Account</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded text-emerald-100 font-mono">
              AI Bot
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="p-4 space-y-3 max-h-[380px] overflow-y-auto scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#E7FFDB] text-slate-900 rounded-tr-none'
                      : 'bg-white text-slate-900 rounded-tl-none'
                  }`}
                >
                  {msg.type === 'audio' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => togglePlayAudio(msg)}
                          className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors shrink-0 shadow-xs"
                        >
                          {playingMessageId === msg.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1">
                          {/* Animated Fake Waveform */}
                          <div className="flex items-center gap-0.5 h-4">
                            {[12, 24, 16, 28, 14, 20, 26, 12, 18, 22, 10, 24, 16].map((h, i) => (
                              <span
                                key={i}
                                className={`w-1 rounded-full ${
                                  playingMessageId === msg.id
                                    ? 'bg-emerald-600 animate-pulse'
                                    : 'bg-slate-300'
                                }`}
                                style={{ height: `${h}px` }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            0:{msg.audioDurationSeconds?.toString().padStart(2, '0') || '08'}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-700 border-t border-slate-100 pt-1.5 italic">
                        "{msg.text}"
                      </p>
                    </div>
                  ) : (
                    <p className="leading-relaxed">{msg.text}</p>
                  )}

                  {/* Scheme Card attachment if present */}
                  {msg.schemeData && (
                    <div className="mt-2.5 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                      <span className="font-bold text-amber-900 block mb-0.5">
                        {msg.schemeData.trade_name}
                      </span>
                      <p className="text-[11px] text-amber-800 mb-2">
                        पूंजी सब्सिडी: <strong>{msg.schemeData.capital_subsidy}</strong>
                      </p>
                      <a
                        href="#download"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Downloading official PM-AJAY NSQF syllabus brochure for ${msg.schemeData?.trade_name}...`);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-white px-2 py-1 rounded border border-emerald-300 hover:bg-emerald-50 transition-colors"
                      >
                        <FileDown className="w-3 h-3 text-emerald-600" />
                        <span>Download Scheme Brochure (PDF)</span>
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && (
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isSimulatingBotReply && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white p-2 rounded-xl w-fit shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-300" />
                <span>Assistant is recording voice response...</span>
              </div>
            )}
          </div>

          {/* Quick Voice Note Buttons */}
          <div className="p-2.5 bg-white border-t border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 block mb-1.5 px-1 uppercase tracking-wider">
              Tap to Send Simulated Regional Voice Note:
            </span>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {sampleVoiceNotes.map((note, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendVoiceNote(note.text)}
                  disabled={isSimulatingBotReply}
                  className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left text-[11px] text-slate-700 transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{note.title}</span>
                  <Mic className="w-3 h-3 text-emerald-600 shrink-0 ml-1" />
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputMessage.trim()) {
                    handleSendVoiceNote(inputMessage);
                    setInputMessage('');
                  }
                }}
                placeholder="Type or send a voice message..."
                className="flex-1 text-xs px-3 py-2 bg-slate-100 rounded-full border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => {
                  if (inputMessage.trim()) {
                    handleSendVoiceNote(inputMessage);
                    setInputMessage('');
                  } else {
                    handleSendVoiceNote("मुझे अपने गांव में सोलर पैनल या सिलाई का काम सीखना है।");
                  }
                }}
                className="w-8 h-8 rounded-full bg-[#075E54] text-white flex items-center justify-center hover:bg-emerald-800 transition-colors shrink-0"
              >
                {inputMessage.trim() ? <Send className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
