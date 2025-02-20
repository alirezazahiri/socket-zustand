"use client";

import Actions from "@/components/actions";
import { Canvas, type CanvasRef } from "@/components/canvas";
import { useRef } from "react";

export default function CanvasScreen() {
  const canvasRef = useRef<CanvasRef>(null);

  return (
    <div className="flex flex-col">
      <Canvas ref={canvasRef} />
      <Actions canvasRef={canvasRef} />
    </div>
  );
}
