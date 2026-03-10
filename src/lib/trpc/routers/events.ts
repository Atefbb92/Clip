import { z } from 'zod';
import { router, publicProcedure } from '../init';

export const eventsRouter = router({
    getByCaseId: publicProcedure
        .input(z.object({ caseId: z.string() }))
        .query(async ({ input, ctx }) => {
            return await ctx.prisma.treatmentEvent.findMany({
                where: { caseId: input.caseId },
                orderBy: { date: 'desc' },
            });
        }),

    create: publicProcedure
        .input(
            z.object({
                caseId: z.string(),
                type: z.enum([
                    'STATUS_CHANGE',
                    'TP_CHECK_ADDED',
                    'TP_CHECK_APPROVED',
                    'TP_CHECK_REJECTED',
                    'CORRECTION_REQUESTED',
                    'LIVRAISON_SET',
                    'TREATMENT_STARTED'
                ]),
                description: z.string().optional(),
                actor: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.treatmentEvent.create({
                data: input,
            });
        }),
});
