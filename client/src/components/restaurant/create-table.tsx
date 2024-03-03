import { useState } from "react";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useForm } from "@tanstack/react-form";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { trpc } from "~/client/utils/trpc";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";

const routeApi = getRouteApi("/restaurant/$slug/manage/tables");

const CreateTableForm = () => {
  const params = routeApi.useParams();

  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const create = trpc.restaurant.table.create.useMutation({
    onSuccess: (data) => {
      utils.restaurant.getBySlug.invalidate();
      // utils.restaurant.table.
    },
  });

  const form = useForm({
    defaultValues: {
      seats: "",
    },
    onSubmit: async (values) => {
      create.mutate({
        seats: parseInt(values.value.seats),
        restaurantSlug: params.slug,
      });
    },
    validatorAdapter: zodValidator,
  });

  return (
    <form.Provider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-8"
      >
        <form.Field name="seats">
          {(field) => (
            <fieldset className="flex flex-col gap-1">
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-neutral-800"
              >
                Seats
              </label>
              <Input
                type="number"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </fieldset>
          )}
        </form.Field>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} className="w-full">
              {isSubmitting ? "..." : "Add"}
            </Button>
          )}
        />
      </form>
    </form.Provider>
  );
};

export const CreateTableDrawer = () => {
  const [open, onOpenChange] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => onOpenChange(true)}>
        <span className="mr-4">
          <PlusIcon className="h-4 w-4" />
        </span>
        <span>Add Table</span>
      </Button>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-8 py-4">
          <DrawerHeader>
            <DrawerTitle>Create Table</DrawerTitle>
            <DrawerDescription>
              Create a new table for this restaurant
            </DrawerDescription>
          </DrawerHeader>
          <CreateTableForm />
        </DrawerContent>
      </Drawer>
    </>
  );
};
