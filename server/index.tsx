import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { renderToString } from "react-dom/server";

import { authRouter } from "./api/auth/auth-routes";
import { createFetchContext } from "./api/trpc/context";
import { appRouter } from "./api/trpc/routes/__root";
import { ServerEntry } from "./server-entry";

const hono = new Hono();

hono.route("/auth", authRouter);

hono.use("/trpc/*", (ctx, next) => {
  console.log("DWA");

  return trpcServer({
    router: appRouter,
    createContext: createFetchContext,
  })(ctx, next);
});

hono.get("/*", (ctx) => {
  const html = renderToString(<ServerEntry />);

  return ctx.html(html);
});

console.log("Server running on port 3000");

export default hono;
