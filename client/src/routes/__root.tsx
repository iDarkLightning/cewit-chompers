import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { createTRPCQueryUtils } from "@trpc/react-query";

import { queryClient, trpc, trpcClient } from "~/client/utils/trpc";
import { type AppRouter } from "~/server/api/trpc/routes/__root";
import { cn } from "../lib/cn";

export const Route = createRootRouteWithContext<{
  queryUtils: ReturnType<typeof createTRPCQueryUtils<AppRouter>>;
}>()({
  wrapInSuspense: true,
  component: () => {
    return (
      <>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <div
              className={cn(
                "max-w-[100rem] px-4 py-6 md:mx-auto md:w-[80%] lg:w-[85%] 2xl:w-[90%]",
              )}
            >
              <Outlet />
            </div>
          </QueryClientProvider>
        </trpc.Provider>
      </>
    );
  },
});
