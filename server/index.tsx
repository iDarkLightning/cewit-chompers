import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";

import { authRouter } from "./api/auth/auth-routes";
import { createFetchContext } from "./api/trpc/context";
import { appRouter } from "./api/trpc/routes/__root";
import { ServerEntry } from "./server-entry";

const hono = new Hono();

hono.route("/auth", authRouter);

hono.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: createFetchContext,
  }),
);

// hono.get("/*", async (ctx) => {
//   const html = await renderToReadableStream(<ServerEntry />);

//   return ctx.newResponse(html, {
//     headers: {
//       "content-type": "text/html;",
//       "transfer-encoding": "chunked",
//     },
//   });
// });

console.log("Server running on port 3000");

export default hono;
