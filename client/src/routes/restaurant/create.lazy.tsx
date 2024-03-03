import { createLazyFileRoute } from "@tanstack/react-router";

import { CreateRestaurantForm } from "../../components/restaurant/create-restaurant";
import { Button } from "../../components/ui/button";

export const Route = createLazyFileRoute("/restaurant/create")({
  component: CreateRestaurant,
});

function CreateRestaurant() {
  return (
    <div>
      <h1>Create Restaurant</h1>
      <p></p>

      <CreateRestaurantForm />
    </div>
  );
}
