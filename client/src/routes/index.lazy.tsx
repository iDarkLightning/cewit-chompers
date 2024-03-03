import { createLazyFileRoute } from "@tanstack/react-router";

import { trpc } from "~/client/utils/trpc";
import { SignOutButton } from "../components/sign-out-button";
import { FoodImageUploadButton } from "../components/upload-food-button";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const test = trpc.potatoes.useQuery();
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
      {!!me.data && <SignOutButton />}
      <FoodImageUploadButton foodId="cltaq36z90001ig9dgiar3w37" />
    </div>
  );
}
