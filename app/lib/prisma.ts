import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined;
};

const prisma: PrismaClient = globalForPrisma.prisma || new PrismaClient();

export default prisma;