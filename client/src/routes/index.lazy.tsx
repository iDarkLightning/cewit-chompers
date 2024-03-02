import { createLazyFileRoute } from "@tanstack/react-router";

import { trpc } from "~/client/utils/trpc";
import { SignOutButton } from "../components/sign-out-button";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const test = trpc.hello.useQuery();
  return (
    <div className="p-2">
      <h3>{test.data}</h3>

      <SignOutButton />
    </div>
  );
}
