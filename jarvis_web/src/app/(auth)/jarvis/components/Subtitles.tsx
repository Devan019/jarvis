"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

export function Subtitles() {
  const [isVisible, setIsVisible] = useState(false);
  const { isListening, transcript, interimTranscript, transcripts, toggleListening } = useSpeechRecognition();

  useEffect(() => setIsVisible(true), []);

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
            <button onClick={toggleListening} className={`p-2 rounded-lg transition-all duration-300 ${isListening ? "bg-yellow-500/20 border border-yellow-500 text-yellow-300 hover:bg-yellow-500/40" : "bg-slate-800 border border-slate-600 text-gray-300 hover:bg-slate-700"}`}>
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Current Speech Block */}
          <div className={`mb-4 rounded-xl border px-4 py-3 font-mono text-sm leading-relaxed transition-colors duration-300 ${isListening ? "border-yellow-500/40 bg-yellow-950/30 text-yellow-100" : "border-slate-700/80 bg-slate-950/40 text-slate-400"}`}>
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-slate-500">
              <span className={`h-2 w-2 rounded-full ${isListening ? "bg-yellow-400 animate-pulse" : "bg-slate-600"}`} />
              Live subtitle
            </div>
            <p className="break-words">
              {isListening ? interimTranscript || "Speak now..." : transcript || "Mic is off"}
            </p>
          </div>

          {/* History */}
          <div className="flex-1 space-y-3 overflow-y-auto max-h-40">
            {transcripts.map((msg) => (
              <div key={msg.id} className="animate-in fade-in duration-300">
                <div className="flex items-start gap-2">
                  <span className="text-green-400 text-xs font-mono shrink-0 mt-0.5">&gt;</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-green-300 text-sm leading-relaxed break-words font-mono">{msg.text}</p>
                    <p className="text-green-700 text-xs mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}