"use client";
import { canvasSetup } from "@/draw";
import { useWebSocket } from "@/hooks/useWebsocket";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

function CanvasBoard({
  roomId,
  roomName,
}: {
  roomId: string;
  roomName: string;
}) {
  const [roomDrawings, setRoomDrawings] = useState<any>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedShape, setSelectedShape] = useState<"rectangle" | "circle">(
    "rectangle"
  );
  const { socket, loading: wsLoading } = useWebSocket();

  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/room-chats/${roomId}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.status === 201) {
          const storedDrawings = res.data.data
            .map((item: any) => {
              try {
                return JSON.parse(item.message);
              } catch (err) {
                console.error("Invalid JSON in message:", item.message);
                return null;
              }
            })
            .filter(Boolean);

          setRoomDrawings(storedDrawings);
        } else {
          setRoomDrawings([]);
        }
      } catch (error) {
        console.log("This is the catch error", error);
        alert("Something went wrong !");
        setRoomDrawings([]);
      }
    };
    fetchDrawings();
  }, [roomId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !roomDrawings || !socket || wsLoading) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    const cleanup = canvasSetup(
      canvas,
      selectedShape,
      roomDrawings,
      socket,
      roomId,
      roomName
    );
    return () => {
      if (cleanup) cleanup();
    };
  }, [roomDrawings, socket, wsLoading, selectedShape, roomId, roomName]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 z-0 bg-white"
      ></canvas>
    </div>
  );
}

export default CanvasBoard;
