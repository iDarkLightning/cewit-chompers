import { QueryClient } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink, loggerLink } from "@trpc/react-query";
import SuperJSON from "superjson";

import { type AppRouter } from "~/server/api/trpc/routes/__root";

export const queryClient = new QueryClient();

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: `${window.location.origin}/trpc`,
    }),
    loggerLink(),
  ],
});
