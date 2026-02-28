import { router, publicProcedure } from '../init';

export const adminRouter = router({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.prisma.admin.findMany();
    }),
});
