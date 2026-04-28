"use client";

import { useEffect, useState } from "react";

interface SubtitleMessage {
  id: number;
  text: string;
  timestamp: Date;
}

export function Subtitles() {
  const [messages, setMessages] = useState<SubtitleMessage[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Example: Add sample subtitles (can be connected to actual speech recognition later)
  useEffect(() => {
    const addMessage = (text: string) => {
      const newMessage: SubtitleMessage = {
        id: Date.now(),
        text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage].slice(-5)); // Keep last 5 messages
    };

    // Demo: Add messages periodically
    const timer1 = setTimeout(() => addMessage("Hello, I'm JARVIS"), 1000);
    const timer2 = setTimeout(
      () => addMessage("Ready to assist you with various tasks"),
      4000
    );

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div
      className={`mt-4 transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
    >
      <div className="relative group h-full">
        <div className="absolute inset-0 bg-linear-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition-all duration-500" />
        <div className="relative bg-slate-900/60 border border-green-500/30 rounded-2xl p-6 backdrop-blur-xl hover:border-green-500/60 transition-all duration-500 min-h-50 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">
              Subtitles / CRT
            </h3>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                <span className="animate-pulse">Listening...</span>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className="animate-in fade-in duration-500"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 text-xs font-mono shrink-0 mt-0.5">
                      &gt;
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-green-300 text-sm leading-relaxed wrap-break-word font-mono">
                        {msg.text}
                      </p>
                      <p className="text-green-700 text-xs mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Blinking cursor */}
          <div className="mt-4 flex items-center gap-1">
            <span className="text-green-400 text-sm animate-pulse">_</span>
          </div>
        </div>
      </div>
    </div>
  );
}
