import { useForm } from "@tanstack/react-form";

import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";

export const CreateRestaurantForm = () => {
  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async (values) => {},
  });

  return (
    <form.Provider>
      <form onSubmit={form.handleSubmit}>
        <form.Field name="name">{() => <Input />}</form.Field>
      </form>
    </form.Provider>
  );
};
