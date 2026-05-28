"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

export function Subtitles() {
  const [isVisible, setIsVisible] = useState(false);
  const { 
    isListening, 
    transcript, 
    interimTranscript, 
    toggleListening 
  } = useSpeechRecognition();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 💡 Combine final transcript blocks with incoming real-time interim results
  const currentDisplayCaption = transcript 
    ? `${transcript} ${interimTranscript}`.trim() 
    : interimTranscript.trim();

  return (
    <div className={`mt-4 transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="relative group h-full">
        <div className={`relative bg-slate-900 border rounded-2xl p-6 shadow-xl transition-all duration-500 min-h-50 flex flex-col ${isListening ? "border-yellow-500/60 shadow-yellow-900/20" : "border-green-500/30 hover:border-green-500/60 shadow-green-900/10"}`}>
          
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isListening ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`} />
              <h3 className={`text-xs font-bold uppercase tracking-widest ${isListening ? "text-yellow-400" : "text-green-400"}`}>
                Subtitles / CRT
              </h3>
            </div>
            <button 
              onClick={toggleListening} 
              className={`p-2 rounded-lg transition-all duration-300 ${isListening ? "bg-yellow-500/20 border border-yellow-500 text-yellow-300 hover:bg-yellow-500/40" : "bg-slate-800 border border-slate-600 text-gray-300 hover:bg-slate-700"}`}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Current Speech Block */}
          <div className={`mb-4 rounded-xl border px-4 py-3 font-mono text-sm leading-relaxed transition-colors duration-300 ${isListening ? "border-yellow-500/40 bg-yellow-950/30 text-yellow-100" : "border-slate-700/80 bg-slate-950/40 text-slate-400"}`}>
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-slate-500">
              <span className={`h-2 w-2 rounded-full ${isListening ? "bg-yellow-400 animate-pulse" : "bg-slate-600"}`} />
              Live subtitle
            </div>
            <p className="break-words min-h-[1.5rem]">
              {isListening 
                ? currentDisplayCaption || "Listening for speech..." 
                : "Mic is off"}
            </p>
          </div>

          {/* Informational Status Footer */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/60 pt-3 mt-auto">
            <span>ENGINE: DEEPGRAM_NOVA_3</span>
            <span className={isListening ? "text-yellow-500/70" : "text-green-500/70"}>
              {isListening ? "STREAM_OPEN" : "STANDBY"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}