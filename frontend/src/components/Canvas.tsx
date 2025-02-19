"use client";

import { useCanvas } from "@/hooks/useCanvas";
import { useCanvasContext } from "@/providers/canvas.provider";
export default function Canvas() {
  const { canvasRef } = useCanvasContext();
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvas();

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
}
