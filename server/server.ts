import { PrismaClient } from '@prisma/client';
import controllers from './controllers';
import express from 'express';

let prisma: PrismaClient;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(controllers);

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  let globalWithPrisma = global as typeof globalThis & { prisma: PrismaClient };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

const server = app.listen(3001, () =>
  console.log(`
🚀 Server ready at: http://localhost:3001`)
);

export default prisma;
