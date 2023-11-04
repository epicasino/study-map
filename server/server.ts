import { PrismaClient } from '@prisma/client';
import controllers from './controllers';
import express from 'express';
import cors from 'cors';

let prisma: PrismaClient;
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

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

const server = app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:3001`)
);

export default prisma;
