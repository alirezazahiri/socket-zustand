import { useEffect } from "react";
import { DrawEvent } from "@/types/events";
import { useCanvasStore } from "@/stores/canvas/hooks";
import { useCanvasContext } from "@/providers/canvas.provider";

export function useCanvas() {
  const canvasStore = useCanvasStore();
  const { canvasRef } = useCanvasContext();

  useEffect(() => {
    canvasStore.connect();
    canvasStore.joinRoom(`User_${Math.floor(Math.random() * 1000)}`);
    canvasStore.requestHistory();

    return () => {
      canvasStore.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvasStore.history.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
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
    const rect = canvas.getBoundingClientRect();
    canvasStore.setLastPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasStore.isDrawing || !canvasStore.socketClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const drawData: DrawEvent = {
      x1: canvasStore.lastPosition.x,
      y1: canvasStore.lastPosition.y,
      x2: currentPos.x,
      y2: currentPos.y,
      color: "#ffffff",
      userId: canvasStore.socketClient?.id || "",
    };

    canvasStore.draw(drawData);
    canvasStore.setLastPosition(currentPos);
  };

  const handleMouseUp = () => {
    canvasStore.setIsDrawing(false);
  };

  return {
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
