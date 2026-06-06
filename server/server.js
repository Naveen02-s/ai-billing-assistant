import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { socketCorsOptions } from "./config/cors.js";
import prisma, { connectPrisma, disconnectPrisma } from "./lib/prisma.js";
import { initSocket } from "./lib/socket.js";

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: socketCorsOptions
});

initSocket(io);

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down Smart Billing API...`);
  server.close(async () => {
    await disconnectPrisma();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

connectPrisma()
  .then(() => {
    server.listen(port, () => {
      console.log(`Smart Billing API running on port ${port}`);
    });
  })
  .catch(async (error) => {
    console.error("Failed to start Smart Billing API:", error);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  });
