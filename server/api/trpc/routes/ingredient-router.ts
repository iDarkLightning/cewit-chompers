import { publicProcedure, router } from "..";

export const ingredientRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.ingredient.findMany();
  }),
})
