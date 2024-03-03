import { publicProcedure, router } from "..";
import { authedProcedure } from "../../auth/authed-procedure";
import { restaurantRouter } from "./restaurant-router";

export const appRouter = router({
  restaurant: restaurantRouter,
  potatoes: publicProcedure.query(() => "hi"),
  me: authedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});

export type AppRouter = typeof appRouter;
