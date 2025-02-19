import { useStore } from "zustand";
import { canvasStore } from "@/stores/canvas/store";

export const useCanvasStore = () => {
  const store = useStore(canvasStore);

  return store
};

export const useClearCanvas = () => {
  const clearCanvas = useStore(canvasStore, (store) => store.clearCanvas);

  return clearCanvas;
};
