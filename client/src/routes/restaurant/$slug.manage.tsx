import { createFileRoute } from "@tanstack/react-router";

import { trpc } from "~/client/utils/trpc";

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
    <div>
      {restaurant.name} {restaurant.id}
    </div>
  );
}
