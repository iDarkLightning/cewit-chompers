import { StrictMode } from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import "./globals.css";
import "@uploadthing/react/styles.css";

import { createTRPCQueryUtils } from "@trpc/react-query";

import { type AppRouter } from "~/server/api/trpc/routes/__root";
import { queryClient, trpcClient } from "../utils/trpc";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryUtils: createTRPCQueryUtils<AppRouter>({
      client: trpcClient,
      queryClient: queryClient,
    }),
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
