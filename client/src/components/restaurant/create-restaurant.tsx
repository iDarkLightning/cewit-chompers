import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";

import { trpc } from "~/client/utils/trpc";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const CreateRestaurantForm = () => {
  const navigate = useNavigate();

  const create = trpc.restaurant.create.useMutation({
    onSuccess: (data) => {
      navigate({
        to: "/restaurant/$slug/manage",
        params: {
          slug: data.slug,
        },
      });
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async (values) => {
      create.mutate({
        name: values.value.name,
      });
    },
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
        <form.Field name="name">
          {(field) => (
            <fieldset className="flex flex-col gap-1">
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-neutral-800"
              >
                Name
              </label>
              <Input
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
              {isSubmitting ? "..." : "Create"}
            </Button>
          )}
        />
        <p></p>
      </form>
    </form.Provider>
  );
};
