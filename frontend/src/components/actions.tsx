"use client";
import { useClearCanvas } from "@/stores/canvas/hooks";
import type { CanvasRef } from "@/components/canvas";
import { RefObject } from "react";
import ColorPicker from "./color-picker";

export default function Actions({
  canvasRef,
}: {
  canvasRef: RefObject<CanvasRef | null>;
}) {
  const clearCanvas = useClearCanvas();

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.clear();
    clearCanvas();
  };

  return (
    <div className="flex gap-2 items-center justify-center my-2">
      <button
        onClick={handleClearCanvas}
        className="bg-red-500 text-foreground px-4 py-2 rounded-md"
      >
        Clear
      </button>
      <ColorPicker />
    </div>
  );
}
