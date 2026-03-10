import { router, publicProcedure } from '../init';
import { z } from 'zod';

export const adminRouter = router({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.prisma.admin.findMany();
    }),
    approveUser: publicProcedure
        .input(z.object({ userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.user.update({
                where: { id: input.userId },
                data: { isApproved: true },
            });
        }),
});
