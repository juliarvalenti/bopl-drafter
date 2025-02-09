// server.ts
import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import roomManager from "./room-manager.js"; // Note: include the .js extension for ESM

// Create an Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with basic CORS settings (adjust as needed)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware to parse JSON bodies
app.use(express.json());

// Simple health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("WebSocket Server is running.");
});

io.on("connection", (socket: Socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("joinRoom", (roomId: string, userData: any) => {
    try {
      roomManager.joinRoom(roomId, socket, userData);
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      const details = roomManager.getRoomDetails(roomId);
      console.log(`Emitting roomUpdate for room ${roomId}:`, details);
      io.to(roomId).emit("roomUpdate", details);
    } catch (error) {
      console.error(`Error joining room ${roomId}:`, error);
    }
  });

  socket.on(
    "draftAction",
    (data: { roomId: string; action: "ban" | "pick"; ability: string }) => {
      const updatedRoom = roomManager.processDraftAction(data, socket);
      console.log(
        `Processed draftAction from ${socket.id}:`,
        data,
        updatedRoom
      );
      if (updatedRoom) {
        io.to(data.roomId).emit(
          "roomUpdate",
          roomManager.getRoomDetails(data.roomId)
        );
      }
    }
  );

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    roomManager.removeUser(socket);
  });
});

// Start the server on the specified port
const PORT: number = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
