"use client";

import { useSocket } from "../context/SocketContext";
import { useEffect, useState } from "react";

export function ConnectionStatus() {
  const { isConnected } = useSocket();
  const [displayId, setDisplayId] = useState("");


  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-full border transition-all duration-300 ${isConnected
            ? "bg-green-900/30 border-green-500/50 text-green-300"
            : "bg-red-900/30 border-red-500/50 text-red-300 animate-pulse"
          }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
        />
        <span className="text-xs font-mono">
          {isConnected ? "Connected" : "Connecting..."} • {displayId}
        </span>
      </div>
    </div>
  );
}
