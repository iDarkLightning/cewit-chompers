import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/restaurant/create")({
  component: CreateRestaurant,
});

function CreateRestaurant() {
  return (
    <div>
      <h1>Create Restaurant</h1>
      <p></p>
    </div>
  );
}
