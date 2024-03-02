import { publicProcedure, router } from "..";
import { authedProcedure } from "../../auth/authed-procedure";

export const appRouter = router({
  potatoes: publicProcedure.query(() => "hi"),
  me: authedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});

export type AppRouter = typeof appRouter;
