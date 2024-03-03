import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";

import { queryClient, trpc, trpcClient } from "~/client/utils/trpc";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </trpc.Provider>
      </>
    );
  },
});
