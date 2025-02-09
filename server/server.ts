// server.ts
import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import roomManager from "./room-manager"; // Ensure roomManager is typed or use any for now

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

// Socket.IO connection handling
io.on("connection", (socket: Socket) => {
  console.log(`New connection: ${socket.id}`);

  // Handle joining a drafting room
  socket.on("joinRoom", (roomId: string, userData: any) => {
    // Delegate room joining to our roomManager
    roomManager.joinRoom(roomId, socket, userData);
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);

    // Broadcast updated room state to all clients in the room
    io.to(roomId).emit("roomUpdate", roomManager.getRoomState(roomId));
  });

  socket.on(
    "draftAction",
    (data: { roomId: string; action: "ban" | "pick"; ability: string }) => {
      const updatedRoom = roomManager.processDraftAction(data, socket);
      if (updatedRoom) {
        io.to(data.roomId).emit("roomUpdate", updatedRoom);
      }
    }
  );

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // Remove the user from any rooms they're in
    roomManager.removeUser(socket);
  });
});

// Start the server on the specified port
const PORT: number = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
