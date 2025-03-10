import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const disconnect = () => prisma.$disconnect();
export default prisma;
