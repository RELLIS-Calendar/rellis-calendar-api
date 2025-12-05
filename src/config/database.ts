import { PrismaClient } from '../../generated/prisma/client';

export const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});