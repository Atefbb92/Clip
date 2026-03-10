import { router, publicProcedure } from '../init';
import { adminRouter } from './admin';
import { patientsRouter } from './patients';
import { eventsRouter } from './events';
import { tpchecksRouter } from './tpchecks';
import { casesRouter } from './cases';

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
    patients: patientsRouter,
    events: eventsRouter,
    tpchecks: tpchecksRouter,
    cases: casesRouter,
});

export type AppRouter = typeof appRouter;
