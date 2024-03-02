import { z } from "zod";

import { publicProcedure, router } from ".";
import { authedProcedure } from "../auth/authed-procedure";

export const appRouter = router({
  hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
    return `Hello ${input ?? "World"}!`;
  }),
  me: authedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});

export type AppRouter = typeof appRouter;
