import { z } from 'zod';
import { router, publicProcedure } from '../init';

export const tpchecksRouter = router({
    getByCaseId: publicProcedure
        .input(z.object({ caseId: z.string() }))
        .query(async ({ input, ctx }) => {
            return await ctx.prisma.tpCheckVersion.findMany({
                where: { caseId: input.caseId },
                orderBy: { version: 'desc' },
            });
        }),

    addMessage: publicProcedure
        .input(
            z.object({
                caseId: z.string(),
                text: z.string(),
                sender: z.string().default('MEDECIN'),
            })
        )
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.tPCheckMessage.create({
                data: {
                    caseId: input.caseId,
                    text: input.text,
                    sender: input.sender,
                },
            });
        }),

    addVersion: publicProcedure
        .input(
            z.object({
                caseId: z.string(),
                url: z.string(),
                correctionId: z.string().nullable().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.$transaction(async (tx) => {
                // Determine next version number
                const existing = await tx.tpCheckVersion.findMany({
                    where: {
                        caseId: input.caseId,
                        correctionId: input.correctionId || null,
                    },
                    orderBy: { version: 'desc' },
                    take: 1,
                });
                const nextVersion = existing.length > 0 ? existing[0].version + 1 : 1;

                const tpCheck = await tx.tpCheckVersion.create({
                    data: {
                        caseId: input.caseId,
                        correctionId: input.correctionId || null,
                        version: nextVersion,
                        url: input.url,
                        status: 'PENDING',
                    },
                });

                if (!input.correctionId) {
                    await tx.case.update({
                        where: { id: input.caseId },
                        data: { globalStatus: 'EN_ATTENTE_DE_VALIDATION' },
                    });
                } else {
                    await tx.correction.update({
                        where: { id: input.correctionId },
                        data: { status: 'EN_ATTENTE_DE_VALIDATION' },
                    });
                }

                await tx.treatmentEvent.create({
                    data: {
                        caseId: input.caseId,
                        type: 'TP_CHECK_ADDED',
                        description: `TP Check v${nextVersion} ajouté`,
                        actor: 'DIAMONDSUITE',
                    },
                });

                return tpCheck;
            });
        }),

    updateStatus: publicProcedure
        .input(
            z.object({
                id: z.string(),
                status: z.enum(['APPROVED', 'REJECTED']),
                actor: z.string().default('MEDECIN'),
            })
        )
        .mutation(async ({ input, ctx }) => {
            return await ctx.prisma.$transaction(async (tx) => {
                const tpCheck = await tx.tpCheckVersion.update({
                    where: { id: input.id },
                    data: { status: input.status },
                    include: { case: true },
                });

                if (input.status === 'APPROVED') {
                    // If it's the initial treatment
                    if (!tpCheck.correctionId) {
                        await tx.case.update({
                            where: { id: tpCheck.caseId },
                            data: { globalStatus: 'EN_PRODUCTION' },
                        });
                    } else {
                        await tx.correction.update({
                            where: { id: tpCheck.correctionId },
                            data: { status: 'EN_PRODUCTION' },
                        });
                    }

                    await tx.treatmentEvent.create({
                        data: {
                            caseId: tpCheck.caseId,
                            type: 'TP_CHECK_APPROVED',
                            description: `TP Check v${tpCheck.version} validé`,
                            actor: input.actor,
                        },
                    });
                } else if (input.status === 'REJECTED') {
                    await tx.treatmentEvent.create({
                        data: {
                            caseId: tpCheck.caseId,
                            type: 'TP_CHECK_REJECTED',
                            description: `Correction demandée sur TP Check v${tpCheck.version}`,
                            actor: input.actor,
                        },
                    });
                }

                return tpCheck;
            });
        }),
});
