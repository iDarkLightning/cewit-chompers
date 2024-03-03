import { createFileRoute } from "@tanstack/react-router";

import { trpc } from "~/client/utils/trpc";
import { FoodItem } from "../components/food-item";
import { CreateMenu } from "../components/restaurant/create-menu";

export const Route = createFileRoute("/restaurant/$slug/manage/menu")({
  component: RestaurantView,
});

function RestaurantView() {
  const params = Route.useParams();
  const [restaurant] = trpc.restaurant.getBySlug.useSuspenseQuery({
    restaurantSlug: params.slug,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 px-6">
        <h2 className="text-xl font-medium">Menu</h2>
        <CreateMenu />
      </div>

      <div className="flex flex-col gap-4 px-6">
        {restaurant.menu.map((food) => (
          <div>
            <FoodItem
              name={food.name}
              price={food.price}
              description={food.description}
              imageKey={food.imageKey}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
