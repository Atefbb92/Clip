import { z } from 'zod';
import { router, publicProcedure } from '../init';

export const patientsRouter = router({
    create: publicProcedure
        .input(
            z.object({
                name: z.string(),
                surname: z.string(),
                genre: z.string().optional(),
                birthDate: z.any().optional(),
                conditions: z.array(z.string()).optional(),

                photos: z.any().optional(),
                radiographies: z.any().optional(),
                scans: z.any().optional(),

                cbctUrl: z.string().nullable().optional(),
                scanMode: z.string().nullable().optional(),
                scanLink: z.string().nullable().optional(),
                prescription: z.any().optional(),

                userId: z.string(),
                status: z.string(), // e.g. "Brouillon", "En attente"

                patientType: z.string().optional(),
                pack: z.string().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            // Create Patient and linked Case in one transaction
            const result = await ctx.prisma.$transaction(async (tx) => {
                // 1. Create Patient
                const patient = await tx.patient.create({
                    data: {
                        firstName: input.surname,
                        lastName: input.name,
                        userId: input.userId,
                        genre: input.genre,
                        birthDate: input.birthDate ?? null,
                        conditions: input.conditions ?? [],
                        status: input.status,
                    },
                });

                // Determine initial history event based on status
                const today = new Date();
                const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

                const initialHistory = [{
                    date: formattedDate,
                    statut: input.status === 'Brouillon' ? 'Cas créé en brouillon' : 'Soumission du cas',
                    type: input.status === 'Brouillon' ? 'info' : 'success'
                }];

                // 2. Create associated Case
                const patientCase = await tx.case.create({
                    data: {
                        patientId: patient.id,
                        userId: input.userId,
                        status: input.status,
                        photos: input.photos ?? null,
                        radiographies: input.radiographies ?? null,
                        scans: input.scans ?? null,
                        cbctUrl: input.cbctUrl,
                        scanMode: input.scanMode,
                        scanLink: input.scanLink,
                        prescription: input.prescription ?? null,
                        patientType: input.patientType,
                        pack: input.pack,
                        history: initialHistory,
                    },
                });

                return { patient, case: patientCase };
            });

            return result;
        }),

    getAll: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input, ctx }) => {
            const patients = await ctx.prisma.patient.findMany({
                where: { userId: input.userId },
                include: {
                    cases: {
                        orderBy: { createdAt: 'desc' },
                        include: {
                            tpCheckVersions: true,
                            corrections: {
                                include: {
                                    tpChecks: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            return patients.map(p => {
                const latestCase = p.cases[0] || {}; // Get the latest case or an empty object

                let approvedTPCheckUrl: string | null = null;
                if (latestCase.id) {
                    const allTPChecks = [
                        ...(latestCase.tpCheckVersions || []),
                        ...(latestCase.corrections || []).flatMap((c: any) => c.tpChecks || [])
                    ];
                    const approvedTPCheck = allTPChecks.find(tp => tp.status === 'APPROVED');
                    if (approvedTPCheck?.url) {
                        approvedTPCheckUrl = approvedTPCheck.url;
                    }
                }

                return {
                    id: p.id,
                    name: p.firstName,
                    surname: p.lastName,
                    genre: p.genre,
                    birthDate: p.birthDate,
                    conditions: p.conditions,
                    status: p.status, // We map status from Patient or Case depending on necessity
                    caseStatus: latestCase.status,
                    globalStatus: latestCase.globalStatus,
                    approvedTPCheckUrl: approvedTPCheckUrl,
                    archived: 0, // Mock archived logic if needed
                    userId: p.userId,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                    pack: latestCase.pack,
                    patientType: latestCase.patientType,
                    photos: latestCase.photos
                };
            });
        }),

    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const patient = await ctx.prisma.patient.findUnique({
                where: { id: input.id },
                include: { cases: { orderBy: { createdAt: 'desc' } } },
            });

            if (!patient) {
                return null;
            }

            const latestCase = patient.cases[0] || {};
            return {
                id: patient.id,
                name: patient.firstName,
                surname: patient.lastName,
                genre: patient.genre,
                birthDate: patient.birthDate,
                conditions: patient.conditions,
                status: patient.status,
                caseStatus: latestCase.status,
                globalStatus: latestCase.globalStatus,
                archived: 0,
                userId: patient.userId,
                createdAt: patient.createdAt,
                updatedAt: patient.updatedAt,
                pack: latestCase.pack,
                patientType: latestCase.patientType,
                photos: latestCase.photos,
                radiographies: latestCase.radiographies,
                scans: latestCase.scans,
                history: latestCase.history
            };
        }),

    updateScans: publicProcedure
        .input(z.object({
            id: z.string(),
            scans: z.any()
        }))
        .mutation(async ({ input, ctx }) => {
            // Find the latest case for the patient
            const latestCase = await ctx.prisma.case.findFirst({
                where: { patientId: input.id },
                orderBy: { createdAt: 'desc' }
            });

            if (!latestCase) {
                throw new Error("No cases found for this patient");
            }

            // Update the scans on the latest case
            const updatedCase = await ctx.prisma.case.update({
                where: { id: latestCase.id },
                data: {
                    scans: input.scans,
                    scanMode: 'scanner',
                    scanLink: null
                }
            });

            return updatedCase;
        }),

    addHistoryEvent: publicProcedure
        .input(z.object({
            id: z.string(),
            event: z.object({
                date: z.string(),
                statut: z.string(),
                type: z.string()
            })
        }))
        .mutation(async ({ input, ctx }) => {
            const latestCase = await ctx.prisma.case.findFirst({
                where: { patientId: input.id },
                orderBy: { createdAt: 'desc' }
            });

            if (!latestCase) {
                throw new Error("No cases found for this patient");
            }

            // Ensure history is an array of events
            const currentHistory = Array.isArray(latestCase.history) ? latestCase.history : [];
            const updatedHistory = [input.event, ...currentHistory];

            const updatedCase = await ctx.prisma.case.update({
                where: { id: latestCase.id },
                data: {
                    history: updatedHistory
                }
            });

            return updatedCase;
        }),
});
