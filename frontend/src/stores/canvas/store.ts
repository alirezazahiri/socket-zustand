import type { DrawEvent, UserJoinEvent } from "@/types/events";
import { SocketEvents } from "@/enums/events";
import type { Socket } from "socket.io-client";
import { createStore as vanillaCreate } from "zustand/vanilla";
import { io } from "socket.io-client";
import { COLORS } from "@/components/color-picker";

interface CanvasEvents {
  connect: () => void;
  disconnect: () => void;
  joinRoom: (username: string) => void;
  requestHistory: () => void;
  draw: (drawEvent: DrawEvent) => void;
  clearCanvas: () => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setLastPosition: (position: { x: number; y: number }) => void;
  handleDrawEvent: (event: DrawEvent) => void;
  handleUserJoin: (event: UserJoinEvent) => void;
  handleUserLeave: (event: UserJoinEvent) => void;
  setDrawingColor: (color: string) => void;
}

type CanvasState = {
  socketClient: Socket | null;
  participants: Record<
    string,
    {
      id: string;
      username: string;
    }
  >;
  history: DrawEvent[];
  isDrawing: boolean;
  lastPosition: { x: number; y: number };
  drawingColor: string;
};

export type CanvasStore = CanvasState & CanvasEvents;

export const canvasStore = vanillaCreate<CanvasStore>((set, get) => ({
  socketClient: null,
  participants: {},
  history: [],
  isDrawing: false,
  lastPosition: { x: 0, y: 0 },
  drawingColor: COLORS[0],

  connect: () => {
    const socket = io("http://localhost:3000");
    set({ socketClient: socket });

    socket.on(SocketEvents.INIT_CANVAS, (history: DrawEvent[]) => {
      set({ history });
    });

    socket.on(SocketEvents.DRAW, (drawEvent: DrawEvent) => {
      get().handleDrawEvent(drawEvent);
    });

    socket.on(SocketEvents.USER_JOIN, (event: UserJoinEvent) => {
      get().handleUserJoin(event);
    });

    socket.on(SocketEvents.USER_LEAVE, (event: UserJoinEvent) => {
      get().handleUserLeave(event);
    });

    socket.on(SocketEvents.CLEAR, () => {
      console.log("cleared store!");
      set({ history: [] });
    });
  },

  disconnect: () => {
    const { socketClient } = get();
    if (socketClient) {
      socketClient.disconnect();
      set({ socketClient: null });
    }
  },

  joinRoom: (username: string) => {
    const { socketClient } = get();
    if (socketClient) {
      socketClient.emit(SocketEvents.USER_JOIN, { username });
    }
  },

  requestHistory: () => {
    const { socketClient } = get();
    if (socketClient) {
      socketClient.emit(SocketEvents.REQUEST_HISTORY);
    }
  },

  draw: (drawEvent: DrawEvent) => {
    const { socketClient, history } = get();
    if (socketClient) {
      socketClient.emit(SocketEvents.DRAW, drawEvent);
      set({ history: [...history, drawEvent] });
    }
  },

  clearCanvas: () => {
    const { socketClient } = get();
    if (socketClient) {
      socketClient.emit(SocketEvents.CLEAR);
      set({ history: [] });
    }
  },

  setIsDrawing: (isDrawing: boolean) => {
    set({ isDrawing });
  },

  setLastPosition: (position: { x: number; y: number }) => {
    set({ lastPosition: position });
  },

  handleDrawEvent: (drawEvent: DrawEvent) => {
    const { history } = get();
    set({ history: [...history, drawEvent] });
  },

  handleUserJoin: (event: UserJoinEvent) => {
    const { participants } = get();
    set({
      participants: {
        ...participants,
        [event.userId]: { id: event.userId, username: event.username },
      },
    });
  },

  handleUserLeave: (event: UserJoinEvent) => {
    const { participants } = get();
    const newParticipants = { ...participants };
    delete newParticipants[event.userId];
    set({ participants: newParticipants });
  },

  setDrawingColor: (color: string) => {
    set({ drawingColor: color });
  },
}));
