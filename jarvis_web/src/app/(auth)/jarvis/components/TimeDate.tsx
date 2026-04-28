"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar } from "lucide-react";

export function TimeDate() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const updateDateTime = () => {
      const now = new Date();

      // Format time as HH:MM:SS
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);

      // Format date
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      setDate(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
    >
      {/* Time Card */}
      <div className="relative group mb-4">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
        <div className="relative bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl hover:border-cyan-500/60 transition-all duration-500">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
              Time
            </span>
          </div>
          <div className="font-mono text-3xl font-bold text-cyan-300 tracking-wider">
            {time || "00:00:00"}
          </div>
        </div>
      </div>

      {/* Date Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
        <div className="relative bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl hover:border-purple-500/60 transition-all duration-500">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
              Date
            </span>
          </div>
          <div className="font-mono text-sm font-bold text-purple-300 tracking-wide">
            {date}
          </div>
        </div>
      </div>
    </div>
  );
}
