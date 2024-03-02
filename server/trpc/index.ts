import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";

const t = initTRPC
  .context<{ authCookie: string }>()
  .create({ transformer: SuperJSON });

export const publicProcedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;
