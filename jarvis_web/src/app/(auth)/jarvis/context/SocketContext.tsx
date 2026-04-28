"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface SocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  clientId: string;
  send: (message: any) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    // Generate or retrieve client UUID
    let uuid = localStorage.getItem("jarvis-client-id");
    if (!uuid) {
      uuid = `jarvis-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem("jarvis-client-id", uuid);
    }
    setClientId(uuid);

    // Connect to WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws/${uuid}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);

      // Send client UUID on connection
      ws.send(
        JSON.stringify({
          type: "init",
          clientId: uuid,
          timestamp: new Date().toISOString(),
        })
      );
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message get:", event.data);
      try {
        const data = JSON.parse(event.data);
        // Handle messages from server
        window.dispatchEvent(
          new CustomEvent("socket-message", { detail: data })
        );
      } catch (e) {
        console.error("Failed to parse socket message:", e);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        console.log("Attempting to reconnect...");
      }, 3000);
    };

    setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const send = (message: any) => {
    if (socket && isConnected) {
      socket.send(
        JSON.stringify({
          ...message,
          clientId,
          timestamp: new Date().toISOString(),
        })
      );
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, clientId, send }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
}
