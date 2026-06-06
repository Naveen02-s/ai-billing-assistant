import { PrismaClient } from "@prisma/client";

const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
});

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export const connectPrisma = async ({ retries = 5, delayMs = 1000 } = {}) => {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await prisma.$connect();
      console.log("Prisma connected to PostgreSQL");
      return;
    } catch (error) {
      console.error(`Prisma connection failed (${attempt}/${retries}):`, error);
      if (attempt === retries) throw error;
      await sleep(delayMs * attempt);
    }
  }
};

export const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect();
    console.log("Prisma disconnected");
  } catch (error) {
    console.error("Prisma disconnect failed:", error);
  }
};

export default prisma;
