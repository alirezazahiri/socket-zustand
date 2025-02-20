"use client";

import Actions from "@/components/actions";
import { Canvas, type CanvasRef } from "@/components/canvas";
import { useRef } from "react";

export default function CanvasScreen() {
  const canvasRef = useRef<CanvasRef>(null);

  return (
    <div className="grid grid-cols-1 gap-4">
      <Canvas ref={canvasRef} />
      <Actions canvasRef={canvasRef} />
    </div>
  );
}
