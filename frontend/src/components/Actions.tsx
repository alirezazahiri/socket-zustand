"use client";
import { useClearCanvas } from "@/stores/canvas/hooks";
import { useCanvasContext } from "@/providers/canvas.provider";

export default function Actions() {
  const { canvasRef } = useCanvasContext();
  const clearCanvas = useClearCanvas();

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    clearCanvas();
  };

  return (
    <div className="flex gap-2 justify-center my-2">
      <button
        onClick={handleClearCanvas}
        className="bg-red-500 text-foreground px-4 py-2 rounded-md"
      >
        Clear
      </button>
    </div>
  );
}
