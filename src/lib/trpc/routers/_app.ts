import { router, publicProcedure } from '../init';
import { adminRouter } from './admin';

export const appRouter = router({
    healthcheck: publicProcedure.query(async ({ ctx }) => {
        try {
            const dbPing = await ctx.prisma.$queryRaw`SELECT 1 as connected`;
            return { status: 'ok', db: 'connected', ping: dbPing, timestamp: new Date() };
        } catch (error: any) {
            return { status: 'error', db: 'disconnected', error: error.message, timestamp: new Date() };
        }
    }),
    admin: adminRouter,
});

export type AppRouter = typeof appRouter;
