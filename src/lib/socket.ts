import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

// Create a single socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false, // Don't connect automatically
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Event listener for connection
socket.on("connect", () => {
  console.log("Connected to game server");
});

// Event listener for disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from game server");
});

// Event listener for errors
socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
}); 