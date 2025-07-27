"use client";
import { canvasSetup } from "@/draw";
import React, { useEffect, useRef } from "react";

function CanvasBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvasSetup(canvas);
    }
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        height={1000}
        width={1000}
        className="bg-white"
      ></canvas>
    </div>
  );
}

export default CanvasBoard;
