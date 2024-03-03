import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { renderToString } from "react-dom/server";

import { authRouter } from "./api/auth/auth-routes";
import { createFetchContext } from "./api/trpc/context";
import { appRouter } from "./api/trpc/routes/__root";
import { ServerEntry } from "./server-entry";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./uploadthing";

const hono = new Hono();

hono.route("/auth", authRouter);

hono.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: createFetchContext,
  }),
);

hono.get("/*", (ctx) => {
  const html = renderToString(<ServerEntry />);

  return ctx.html(html);
});

const { GET, POST } = createRouteHandler({
  router: uploadRouter,
  config: {
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
  }
});

const ut = new Hono()
  .get("/", (context) => GET(context.req.raw))
  .post("/", (context) => POST(context.req.raw));

hono.route("/api/uploadthing", ut);

console.log("Server running on port 3000");

export default hono;
