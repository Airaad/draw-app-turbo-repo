"use client";
import { canvasSetup } from "@/draw";
import React, { useEffect, useRef, useState } from "react";

function CanvasBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedShape, setSelectedShape] = useState<"rectangle" | "circle">(
    "circle"
  );

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();
      canvasSetup(canvas, selectedShape);
    }
  }, []);

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
