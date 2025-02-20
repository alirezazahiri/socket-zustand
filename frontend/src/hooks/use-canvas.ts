import { useEffect, useRef } from "react";
import type { DrawEvent } from "@/types/events";
import { useCanvasStore } from "@/stores/canvas/hooks";
import type { CanvasRef } from "@/components/canvas";

export function useCanvas() {
  const canvasStore = useCanvasStore();
  const canvasRef = useRef<CanvasRef>(null);

  useEffect(() => {
    canvasStore.connect();
    canvasStore.joinRoom(`User_${Math.floor(Math.random() * 1000)}`);
    canvasStore.requestHistory();

    return () => {
      canvasStore.disconnect();
    };
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;

    if (canvasStore.history.length === 0) {
      return canvasRef.current?.clear();
    }

    const drawLine = (data: DrawEvent) => {
      ctx.beginPath();
      ctx.moveTo(data.x1, data.y1);
      ctx.lineTo(data.x2, data.y2);
      ctx.strokeStyle = data.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    };

    canvasStore.history.forEach(drawLine);
  }, [canvasStore.history]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvasStore.setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    canvasStore.setLastPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasStore.isDrawing || !canvasStore.socketClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const drawData: DrawEvent = {
      x1: canvasStore.lastPosition.x,
      y1: canvasStore.lastPosition.y,
      x2: currentPos.x,
      y2: currentPos.y,
      color: canvasStore.drawingColor,
      userId: canvasStore.socketClient?.id || "",
    };

    canvasStore.draw(drawData);
    canvasStore.setLastPosition(currentPos);
  };

  const handleMouseUp = () => {
    canvasStore.setIsDrawing(false);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    canvasRef,
  };
}
