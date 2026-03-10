import { z } from 'zod';
import { router, publicProcedure } from '../init';

export const casesRouter = router({
    getByPatientId: publicProcedure
        .input(z.object({ patientId: z.string() }))
        .query(async ({ input, ctx }) => {
            return await ctx.prisma.case.findMany({
                where: { patientId: input.patientId },
                orderBy: { createdAt: 'desc' },
                include: {
                    messages: { orderBy: { createdAt: 'asc' } },
                    tpCheckVersions: true,
                    treatmentEvents: { orderBy: { date: 'desc' } },
                    corrections: {
                        include: {
                            tpChecks: true
                        },
                        orderBy: { version: 'asc' }
                    }
                }
            });
        }),

    startTreatment: publicProcedure
        .input(z.object({ id: z.string(), actor: z.string().default('MEDECIN') }))
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.$transaction(async (tx) => {
                const updatedCase = await tx.case.update({
                    where: { id: input.id },
                    data: { globalStatus: 'EN_TRAITEMENT' },
                });

                await tx.treatmentEvent.create({
                    data: {
                        caseId: input.id,
                        type: 'TREATMENT_STARTED',
                        description: 'Le traitement a démarré',
                        actor: input.actor,
                    },
                });

                return updatedCase;
            });
        }),

    setDelivered: publicProcedure
        .input(z.object({ id: z.string(), actor: z.string().default('DIAMONDSUITE') }))
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.$transaction(async (tx) => {
                await tx.treatmentEvent.create({
                    data: {
                        caseId: input.id,
                        type: 'LIVRAISON_SET',
                        description: 'Set en livraison',
                        actor: input.actor,
                    },
                });
                return { success: true };
            });
        }),

    requestCorrection: publicProcedure
        .input(
            z.object({
                id: z.string(),
                photos: z.any().optional(),
                scans: z.any().optional(),
                actor: z.string().default('MEDECIN'),
            })
        )
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.$transaction(async (tx) => {
                const existingCorrections = await tx.correction.findMany({
                    where: { caseId: input.id },
                    orderBy: { version: 'desc' },
                    take: 1,
                });

                const nextVersion = existingCorrections.length > 0 ? existingCorrections[0].version + 1 : 1;

                const correction = await tx.correction.create({
                    data: {
                        caseId: input.id,
                        version: nextVersion,
                        photos: input.photos ?? null,
                        scans: input.scans ?? null,
                        status: 'EN_PLANIFICATION',
                    },
                });

                await tx.treatmentEvent.create({
                    data: {
                        caseId: input.id,
                        type: 'CORRECTION_REQUESTED',
                        description: `Correction ${nextVersion} demandée`,
                        actor: input.actor,
                    },
                });

                return correction;
            });
        }),

    getCorrections: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            return await ctx.prisma.correction.findMany({
                where: { caseId: input.id },
                include: { tpChecks: true },
                orderBy: { version: 'asc' },
            });
        }),
});
