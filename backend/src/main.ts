import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { DrawEvent, UserJoinEvent } from "@/types/events";
import { SocketEvents } from "@/enums/events";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const connectedUsers = new Map<string, string>();
const drawHistory: DrawEvent[] = [];

io.on("connection", (socket) => {
  socket.on(SocketEvents.USER_JOIN, (data: UserJoinEvent) => {
    connectedUsers.set(socket.id, data.username);
    socket.broadcast.emit(SocketEvents.USER_JOIN, {
      userId: socket.id,
      username: data.username,
    });
  });

  socket.on(SocketEvents.DRAW, (data: DrawEvent) => {
    const drawData = {
      ...data,
      userId: socket.id,
    };
    drawHistory.push(drawData);
    socket.broadcast.emit(SocketEvents.DRAW, drawData);
  });

  socket.on(SocketEvents.REQUEST_HISTORY, () => {
    socket.emit(SocketEvents.INIT_CANVAS, drawHistory);
  });

  socket.on(SocketEvents.CLEAR, () => {
    drawHistory.splice(0, drawHistory.length);
    socket.broadcast.emit(SocketEvents.CLEAR);
  });

  socket.on("disconnect", () => {
    const username = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);
    socket.broadcast.emit(SocketEvents.USER_LEAVE, {
      userId: socket.id,
      username,
    });
  });
});

httpServer.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});
