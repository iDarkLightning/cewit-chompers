import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/order/$id")({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryUtils.me.ensureData().catch((_) => {
      return null;
    })

    if (!user) {
      throw redirect({
        to: "/sign-in", search: {
          callback: `/home?${new URLSearchParams({ redirect: location.href }).toString()}`
        }
      });
    }
  }
});
