import { useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/16/solid";
import { createLazyFileRoute } from "@tanstack/react-router";

import { trpc } from "~/client/utils/trpc";
import { FoodItem } from "../../components/food-item";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

export const Route = createLazyFileRoute("/order/$id")({
  component: OrderView,
});

function OrderView() {
  const params = Route.useParams();
  const [me] = trpc.me.useSuspenseQuery();
  const joinMutation = trpc.customer.joinTable.useMutation();
  const { data, refetch } = trpc.customer.getOrder.useQuery(undefined, {
    enabled: joinMutation.isSuccess,
    refetchInterval: 10_000,
  });

  useEffect(() => {
    joinMutation.mutate({ tableId: params.id });
  }, []);

  const addFoodToOrder = trpc.customer.addToOrder.useMutation({
    onSuccess: () => refetch(),
  });

  const removeFoodFromOrder = trpc.customer.removeFromOrder.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <>
      <div className="flex flex-col gap-4 rounded-3xl bg-emerald-800 p-6 text-white shadow-md">
        <h1 className="text-lg font-medium">{data?.restaurant.name}</h1>
        <div className="flex flex-wrap gap-4">
          <div className="rounded-full bg-white px-4 py-0.5 font-medium text-black">
            <p>
              {data?.customers.length}/{data?.seats} Party Members
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="table" className="my-4 w-full">
        <TabsList className="w-full">
          <TabsTrigger value="table" className="flex-1">
            Order
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex-1">
            Menu
          </TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          {data && (
            <div>
              {data.customers.map((c) => (
                <div>
                  <div className="my-2 rounded-lg border-[0.0125rem] border-neutral-300 px-5 py-2">
                    <p className="font-medium">{c.user.name}</p>
                  </div>
                  {c.foods.map((f) => (
                    <div>
                      <FoodItem
                        name={f.food.name}
                        price={f.food.price}
                        description={f.food.description}
                        imageKey={f.food.imageKey}
                        actionEl={
                          <>
                            {me.id === c.user.id ? (
                              <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() =>
                                  removeFoodFromOrder.mutate({
                                    foodId: f.food.id,
                                  })
                                }
                              >
                                <span className="mr-4">
                                  <TrashIcon className="h-4 w-4" />
                                </span>
                                <span>Remove from Order</span>
                              </Button>
                            ) : null}
                          </>
                        }
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="menu">
          {data && (
            <div>
              {data.restaurant.menu.map((food) => (
                <div>
                  <FoodItem
                    name={food.name}
                    price={food.price}
                    description={food.description}
                    imageKey={food.imageKey}
                    actionEl={
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() =>
                          addFoodToOrder.mutate({
                            foodId: food.id,
                          })
                        }
                      >
                        <span className="mr-4">
                          <PlusIcon className="h-4 w-4" />
                        </span>
                        <span>Add to Order</span>
                      </Button>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
