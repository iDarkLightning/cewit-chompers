import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";

import { authV0 } from "./auth/auth-routes";
import { createFetchContext } from "./trpc/context";
import { appRouter } from "./trpc/router";

const hono = new Hono();

hono.route("/auth", authV0);

hono.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: createFetchContext,
  }),
);
console.log("Server running on port 3000");

export default hono;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      VITE_PUBLIC_APP_URL: string;
    }
  }
}
