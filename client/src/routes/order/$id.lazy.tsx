import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { trpc } from "~/client/utils/trpc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { FoodItem } from "../../components/food-item";

export const Route = createLazyFileRoute("/order/$id")({
  component: OrderView
});

function OrderView() {
  const params = Route.useParams();
  const joinMutation = trpc.customer.joinTable.useMutation();
  const { data } = trpc.customer.getOrder.useQuery(undefined, { enabled: joinMutation.isSuccess });

  useEffect(() => {
    joinMutation.mutate({ tableId: params.id });
  }, []);

  return (<Tabs defaultValue="table" className="w-[400px]">
    <TabsList>
      <TabsTrigger value="table">Order</TabsTrigger>
      <TabsTrigger value="menu">Menu</TabsTrigger>
    </TabsList>
    <TabsContent value="table">
      {data && <div>
        <p>{data.restaurant.name}</p>
        {data.customers.map((c) =>
          <div>
            {c.id}
            {c.foods.map((f) =>
              <div>
                <FoodItem
                  name={f.food.name}
                  price={f.food.price}
                  description={f.food.description}
                  imageKey={f.food.imageKey}
                />
              </div>)}
          </div>
        )}
      </div>}
    </TabsContent>
    <TabsContent value="menu">
      {data && <div>
        {data.restaurant.name}
        {data.restaurant.menu.map((food) =>
          <div>
            <FoodItem
              name={food.name}
              price={food.price}
              description={food.description}
              imageKey={food.imageKey}
            />
          </div>)}
      </div>}
    </TabsContent>
  </Tabs>);
}
