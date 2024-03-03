import { publicProcedure, router } from "..";
import { authedProcedure } from "../../auth/authed-procedure";
import { ingredientRouter } from "./ingredient-router";
import { restaurantRouter } from "./restaurant-router";
import { userRouter } from "./user-router";

export const appRouter = router({
  restaurant: restaurantRouter,
  customer: userRouter,
  ingredients: ingredientRouter,
  potatoes: publicProcedure.query(() => "hi"),
  me: authedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});

export type AppRouter = typeof appRouter;
