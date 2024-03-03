import { createLazyFileRoute } from "@tanstack/react-router";

import { trpc } from "~/client/utils/trpc";
import { SignOutButton } from "../components/sign-out-button";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const test = trpc.potatoes.useQuery();
  const me = trpc.me.useQuery();

  console.log(test.data, me.data);
  return (
    <div className="p-2">
      <h3>{test.data}</h3>
      {me.data && (
        <>
          {me.data.name}
          {me.data.email}
        </>
      )}
      {!!me.data && <SignOutButton />}
    </div>
  );
}
