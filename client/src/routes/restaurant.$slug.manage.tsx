import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { trpc } from "~/client/utils/trpc";

export const Route = createFileRoute("/restaurant/$slug/manage")({
  loader: ({ context, params }) => {
    console.log("IS THIS RUNNING");
    return context.queryUtils.restaurant.getBySlug.ensureData({
      restaurantSlug: params.slug,
    });
  },
  component: RestaurantManageLayout,
});

function RestaurantManageLayout() {
  console.log("dwa");
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
            <p>
              {restaurant.tables.filter((t) => !t.occupied).length}/
              {restaurant.tables.length} Tables Free
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 rounded-xl bg-neutral-100 p-2">
        <Link
          className="flex-1 rounded-lg py-1 text-center font-medium"
          to="/restaurant/$slug/manage/menu"
          params={{ slug: restaurant.slug }}
          activeProps={{ className: "bg-white" }}
        >
          Menu
        </Link>
        <Link
          className="flex-1 rounded-lg py-1 text-center font-medium"
          to="/restaurant/$slug/manage/tables"
          params={{ slug: restaurant.slug }}
          activeProps={{ className: "bg-white" }}
        >
          Table
        </Link>
      </div>

      <Outlet />
    </div>
  );
}
