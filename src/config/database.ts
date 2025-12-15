import { PrismaClient } from '../../generated/prisma/client';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import 'dotenv/config';

const getEnvVar = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

const adapter = new PrismaMariaDb({
    host: getEnvVar('DB_HOST'),
    port: parseInt(getEnvVar('DB_PORT')),
    user: getEnvVar('DB_USER'),
    password: getEnvVar('DB_PASSWORD'),
    database: getEnvVar('DB_NAME'),
    connectionLimit: 5,
})

export const prisma = new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});