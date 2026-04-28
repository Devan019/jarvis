"use client";

import { useEffect, useState } from "react";

export function IntroCard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`space-y-4 transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
    >
      {/* Intro Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
        <div className="relative bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl hover:border-cyan-500/60 transition-all duration-500">
          <div className="space-y-3">
            <h2 className="text-xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Intro
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Welcome to JARVIS - Your intelligent virtual assistant powered by
              advanced AI and 3D avatar technology.
            </p>
          </div>
        </div>
      </div>

      {/* About Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
        <div className="relative bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl hover:border-purple-500/60 transition-all duration-500">
          <div className="space-y-3">
            <h2 className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              An interactive 3D assistant that responds to voice commands, plays
              media, and provides real-time information with engaging animations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
