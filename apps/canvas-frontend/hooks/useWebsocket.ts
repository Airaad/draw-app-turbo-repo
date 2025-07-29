import { useEffect, useState } from "react";

export function useWebSocket() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (token) {
      const ws = new WebSocket(`http://localhost:8080?token=${token}`);
      console.log(token);
      ws.onopen = () => {
        setLoading(false);
        setSocket(ws);
      };
      ws.onclose = () => {
        console.log("connection closed");
      };
    }
  }, [token]);

  return {
    socket,
    loading,
  };
}
