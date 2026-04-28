"use client";

import { useEffect, useState } from "react";
import { Music, Cloud, CheckSquare, Play } from "lucide-react";

const functions = [
  {
    icon: Play,
    label: "YouTube",
    description: "Video Search",
    color: "from-red-500 to-red-600",
    borderColor: "border-red-500/30 hover:border-red-500/60",
  },
  {
    icon: Music,
    label: "Spotify",
    description: "Song Play",
    color: "from-green-500 to-green-600",
    borderColor: "border-green-500/30 hover:border-green-500/60",
  },
  {
    icon: Cloud,
    label: "Weather",
    description: "Live Updates",
    color: "from-blue-500 to-cyan-600",
    borderColor: "border-blue-500/30 hover:border-blue-500/60",
  },
  {
    icon: CheckSquare,
    label: "Todo",
    description: "Task Manager",
    color: "from-amber-500 to-orange-600",
    borderColor: "border-amber-500/30 hover:border-amber-500/60",
  },
];

export function JarvisFunctions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`mt-4 transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
    >
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
        Capabilities
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {functions.map((func, idx) => {
          const Icon = func.icon;
          return (
            <div
              key={idx}
              className={`relative group transition-all duration-500 transform hover:scale-105`}
            >
              <div
                className={`absolute inset-0 bg-linear-to-r ${func.color} rounded-lg blur opacity-0 group-hover:opacity-75 transition-all duration-500`}
              />
              <div
                className={`relative bg-slate-900/60 ${func.borderColor} border rounded-lg p-3 backdrop-blur-xl cursor-pointer hover:bg-slate-900/80 transition-all duration-500`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-300" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-200">
                      {func.label}
                    </p>
                    <p className="text-xs text-gray-400">{func.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
