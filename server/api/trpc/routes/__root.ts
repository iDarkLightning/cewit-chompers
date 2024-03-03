import { publicProcedure, router } from "..";
import { authedProcedure } from "../../auth/authed-procedure";
import { restaurantRouter } from "./restaurant-router";
import { userRouter } from "./user-router";

export const appRouter = router({
  restaurant: restaurantRouter,
  customer: userRouter,
  potatoes: publicProcedure.query(() => "hi"),
  me: authedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});

export type AppRouter = typeof appRouter;
