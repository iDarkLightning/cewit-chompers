import { createLazyFileRoute } from "@tanstack/react-router";

import { trpc } from "~/client/utils/trpc";
import { SignOutButton } from "../components/sign-out-button";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const test = trpc.hello.useQuery();
  const me = trpc.me.useQuery();
  return (
    <div className="p-2">
      <h3>{test.data}</h3>

      {me.data && (
        <>
          {me.data.name}
          {me.data.email}
        </>
      )}

      {me.data && <SignOutButton />}
    </div>
  );
}
