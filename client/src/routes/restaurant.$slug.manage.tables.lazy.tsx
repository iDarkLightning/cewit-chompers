import { QrCodeIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import Code from "react-qr-code";

import { trpc } from "~/client/utils/trpc";
import { CreateTableDrawer } from "../components/restaurant/create-table";
import { Button } from "../components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/drawer";

export const Route = createLazyFileRoute("/restaurant/$slug/manage/tables")({
  component: TablesView,
});

function TablesView() {
  const params = Route.useParams();
  const [restaurant] = trpc.restaurant.getBySlug.useSuspenseQuery({
    restaurantSlug: params.slug,
  });
  const utils = trpc.useUtils();

  const clearTable = trpc.restaurant.table.clear.useMutation({
    onSuccess: async () => {
      await utils.restaurant.getBySlug.invalidate();
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 px-6">
        <h2 className="text-xl font-medium">Table</h2>
        <CreateTableDrawer />
      </div>

      <div className="flex flex-col gap-4 px-6">
        {restaurant.tables.map((table, idx) => (
          <div
            key={table.id}
            className="rounded-lg border-[0.0125rem] border-neutral-300 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">Table {idx + 1}</p>
                <p>Seats: {table.seats}</p>
              </div>
              {table.occupied && (
                <p className="my-2 rounded-full bg-amber-200 px-4 py-0.5 font-medium">
                  Occupied
                </p>
              )}
              {!table.occupied && (
                <p className="my-2 rounded-full bg-teal-200 px-4 py-0.5 font-medium">
                  Not Occupied
                </p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="secondary" className="inline-flex gap-2">
                    <span>
                      <QrCodeIcon className="h-4 w-4" />
                    </span>
                    <span>QR Code</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="px-8 py-4">
                  <DrawerHeader>
                    <DrawerTitle>QR Code</DrawerTitle>
                    <DrawerDescription>
                      Scan this code to be seated at this table
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="flex items-center justify-center">
                    <Code
                      width={128}
                      value={window.location.origin + `/order/${table.id}`}
                      bgColor="#fff"
                      fgColor="#1c1c1c"
                    />
                  </div>
                  <Button className="my-4" asChild>
                    <Link to="/order/$id" params={{ id: table.id }}>
                      Go to Order View
                    </Link>
                  </Button>
                </DrawerContent>
              </Drawer>
              <Button variant="secondary" className="inline-flex gap-2">
                <span>
                  <XMarkIcon className="h-4 w-4" />
                </span>
                <span
                  onClick={() => {
                    clearTable.mutate({
                      tableId: table.id,
                      restaurantSlug: restaurant.slug,
                    });
                  }}
                >
                  Clear Table
                </span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
