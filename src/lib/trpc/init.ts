import { initTRPC } from '@trpc/server';
import { prisma } from '../prisma';

export const createContext = async () => {
    return {
        prisma,
    };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create();


// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
