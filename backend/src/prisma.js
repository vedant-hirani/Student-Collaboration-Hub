import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?pgbouncer=true&connection_limit=1",
    },
  },
  log: ['query', 'info', 'warn', 'error'], // Enable logging for debugging
});

export default prisma;
