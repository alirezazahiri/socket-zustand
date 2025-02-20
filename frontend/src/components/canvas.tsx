"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useCanvas } from "@/hooks/use-canvas";

export interface CanvasRef extends HTMLCanvasElement {
  clear: () => void;
}

export const Canvas = forwardRef<CanvasRef, {}>((_, ref) => {
  const { handleMouseDown, handleMouseMove, handleMouseUp, canvasRef } =
    useCanvas();

  useImperativeHandle<CanvasRef, CanvasRef>(ref, () => {
    const canvas = canvasRef.current as CanvasRef;
    canvas.clear = () => {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    return canvas;
  });

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border border-foreground rounded-lg"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseUp}
    />
  );
});

Canvas.displayName = "Canvas";
