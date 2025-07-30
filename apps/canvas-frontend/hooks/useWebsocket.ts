import { useEffect, useState, useRef } from "react";

// Singleton pattern for WebSocket instance
let globalSocket: WebSocket | null = null;

export function useWebSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Use existing connection if available and healthy
    if (globalSocket && globalSocket.readyState === WebSocket.OPEN) {
      setSocket(globalSocket);
      setLoading(false);
      socketRef.current = globalSocket;
      return;
    }

    setLoading(true);

    // Create new connection
    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

    ws.onopen = () => {
      globalSocket = ws;
      setSocket(ws);
      setLoading(false);
      socketRef.current = ws;
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLoading(false);
    };

    ws.onclose = () => {
      console.log("Connection closed");
      if (globalSocket === ws) {
        globalSocket = null;
      }
      setSocket(null);
      setLoading(false);
    };
    
    return () => {
      // Don't close if it's the global instance being used elsewhere
      if (socketRef.current && socketRef.current === globalSocket) {
        return;
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return {
    socket,
    loading,
  };
}
