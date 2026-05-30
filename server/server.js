import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { initSocket } from "./lib/socket.js";

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }
});

initSocket(io);

server.listen(port, () => {
  console.log(`Smart Billing API running on port ${port}`);
});
