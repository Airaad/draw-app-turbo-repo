"use client";
import React, { useEffect, useRef } from "react";

function CanvasBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      let clicked = false;
      let startX: number;
      let startY: number;

      canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
      });

      canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
          const width = e.clientX - startX;
          const height = e.clientY - startY;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeRect(startX, startY, width, height);
        }
      });

      canvas.addEventListener("mouseup", (e) => {
        clicked = false;
      });
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
