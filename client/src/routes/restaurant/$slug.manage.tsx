import { createFileRoute } from "@tanstack/react-router";

import { trpc } from "~/client/utils/trpc";
import { FoodItem } from "../../components/food-item";
import { CreateMenu } from "../../components/restaurant/create-menu";

export const Route = createFileRoute("/restaurant/$slug/manage")({
  loader: ({ context, params }) => {
    return context.queryUtils.restaurant.getBySlug.ensureData({
      restaurantSlug: params.slug,
    });
  },
  component: RestaurantView,
});

function RestaurantView() {
  const params = Route.useParams();
  const [restaurant] = trpc.restaurant.getBySlug.useSuspenseQuery({
    restaurantSlug: params.slug,
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-3xl bg-emerald-800 p-6 text-white shadow-md">
        <h1 className="text-lg font-medium">{restaurant.name}</h1>
        <div className="flex flex-wrap gap-4">
          <div className="rounded-full bg-white px-4 py-0.5 font-medium text-black">
            <p>8/17 Tables Free</p>
          </div>
        </div>
      </div>
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
