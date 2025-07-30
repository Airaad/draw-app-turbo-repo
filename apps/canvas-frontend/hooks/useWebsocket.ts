import { useEffect, useState } from "react";

export function useWebSocket() {
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const ws = new WebSocket(`http://localhost:8080?token=${token}`);
      ws.onopen = () => {
        setLoading(false);
        setSocket(ws);
      };
      ws.onclose = () => {
        console.log("connection closed");
      };
    }
  }, []);

  return {
    socket,
    loading,
  };
}
