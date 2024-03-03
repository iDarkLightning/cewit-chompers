import { createLazyFileRoute } from "@tanstack/react-router";

import { CreateRestaurantForm } from "../../components/restaurant/create-restaurant";

export const Route = createLazyFileRoute("/restaurant/create")({
  component: CreateRestaurant,
});

function CreateRestaurant() {
  return (
    <div className="flex h-screen flex-col justify-center gap-1">
      <div className="my-4">
        <h1 className="text-lg font-semibold">Create a Restaurant</h1>
        <p className="font-medium text-neutral-600">
          Register your restaurant to create your menu
        </p>
      </div>

      <CreateRestaurantForm />
    </div>
  );
}
