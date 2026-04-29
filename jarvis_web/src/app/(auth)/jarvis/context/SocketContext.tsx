"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export interface SocketMessage {
  event: string;
  data: any;
}

type SocketMessageHandler = (message: SocketMessage) => void;

interface SocketContextType {
  isConnected: boolean;
  send: (message: SocketMessage) => void;
  receive: (handler: SocketMessageHandler) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

  if(!socketUrl){
    throw new Error("NEXT_PUBLIC_WEBSOCKET_URL environment variable is not defined");
  }

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const handlersRef = useRef<Set<SocketMessageHandler>>(new Set());

  useEffect(() => {
    let uuid = localStorage.getItem("jarvis-client-id");
    if (!uuid) {
      uuid = `jarvis-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem("jarvis-client-id", uuid);
    }
    const ws = new WebSocket(`${socketUrl}/${uuid}`);

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    
    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        handlersRef.current.forEach((handler) => handler(parsed));
      } catch (e) {
        console.error("Failed to parse socket message", e);
      }
    };

    setSocket(ws);

    return () => {
      handlersRef.current.clear();
      ws.close();
    };
  }, []);

  const send = (message: SocketMessage) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  const receive = (handler: SocketMessageHandler) => {
    handlersRef.current.add(handler);
    return () => handlersRef.current.delete(handler); 
  };

  return (
    <SocketContext.Provider value={{ isConnected, send, receive }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
}