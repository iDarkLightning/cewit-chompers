import { Suspense, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";
import { Ingredient } from "@prisma/client";
import { useForm } from "@tanstack/react-form";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import {
  AnimationControls,
  animationControls,
  motion,
  useAnimationControls,
} from "framer-motion";
import useMeasure from "react-use-measure";
import { Drawer as VaulDrawer } from "vaul";
import { z } from "zod";
import { create } from "zustand";

import { trpc } from "~/client/utils/trpc";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { UploadButton } from "~/client/utils/uploadthing";

const routeApi = getRouteApi("/restaurant/$slug/manage");

type BasicInfo = {
  name: string;
  price: string;
  description: string;
};

type FormStore = {
  step: "basicInfo" | "ingredients" | "picture";
  basicInfo: BasicInfo;
  setBasicInfo: (basicInfo: BasicInfo) => void;
  setStep: (step: FormStore["step"]) => void;
  reset: () => void;
  foodId: string | null;
  setFoodId: (foodId: string) => void;
  ingredients: Ingredient[];
  setIngredients: (ingredients: Ingredient[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const useFormStore = create<FormStore>((set) => ({
  step: "basicInfo",
  basicInfo: {
    name: "",
    price: "",
    description: "",
  },
  reset: () =>
    set({
      step: "basicInfo",
      basicInfo: { name: "", price: "", description: "" },
      ingredients: [],
    }),
  foodId: null,
  open: false,
  setFoodId: (foodId: string) => set({ foodId }),
  setBasicInfo: (basicInfo: BasicInfo) => set({ basicInfo }),
  setStep: (step: FormStore["step"]) => set({ step }),
  ingredients: [],
  setIngredients: (ingredients: Ingredient[]) => set({ ingredients }),
  onOpenChange: (open) => set({ open }),
}));

const WizardStepOne = (props: { submitCallback: () => void }) => {
  const { basicInfo, setBasicInfo } = useFormStore();

  const form = useForm({
    defaultValues: basicInfo,
    onSubmit: (values) => {
      setBasicInfo(values.value);
      props.submitCallback();
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
        className="flex flex-col gap-6"
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
        <form.Field
          name="price"
          validators={{
            onChange: z.coerce.number(),
          }}
        >
          {(field) => (
            <fieldset className="flex flex-col gap-1">
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-neutral-800"
              >
                Price
              </label>
              <div className="relative shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  type="number"
                  name={field.name}
                  className="block w-full py-1.5 pl-7 pr-20"
                  placeholder="0.00"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  <p className="text-sm font-medium">USD</p>
                </div>
              </div>
            </fieldset>
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <fieldset className="flex flex-col gap-1">
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-neutral-800"
              >
                Description
              </label>
              <Textarea
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
            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full items-center gap-1"
            >
              <span>{isSubmitting ? "..." : "Next"}</span>
              <span>
                <ChevronRightIcon className="h-4 w-4" />
              </span>
            </Button>
          )}
        />
      </form>
    </form.Provider>
  );
};

const WizardStepTwo = (props: { animationControls: AnimationControls }) => {
  const params = routeApi.useParams();
  const [
    basicInfo,
    setStep,
    setFoodId,
    selectedIngredients,
    setSelectedIngredients,
  ] = useFormStore((s) => [
    s.basicInfo,
    s.setStep,
    s.setFoodId,
    s.ingredients,
    s.setIngredients,
  ]);

  const [ingredients] = trpc.ingredients.getAll.useSuspenseQuery();
  const createMutation = trpc.restaurant.menu.create.useMutation({
    onSuccess: (data) => {
      setFoodId(data.id);

      props.animationControls.start({
        x: "-10%",
        opacity: 0,
        transition: { duration: 0.1 },
      });
      setTimeout(() => setStep("picture"), 150);
      setTimeout(
        () =>
          props.animationControls.start({
            x: "0%",
            opacity: 1,
            transition: { duration: 0.015 },
          }),
        225,
      );
    },
  });

  const create = () => {
    createMutation.mutate({
      name: basicInfo.name,
      price: parseFloat(basicInfo.price),
      description: basicInfo.description,
      ingredientIds: selectedIngredients.map((i) => ({
        ingredientId: i.id,
      })),
      restaurantSlug: params.slug,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <DrawerHeader>
          <DrawerTitle>Add your ingredients</DrawerTitle>
          <DrawerDescription>
            Now, let's add some ingredients to your dish!
          </DrawerDescription>
        </DrawerHeader>

        <VaulDrawer.NestedRoot>
          <DrawerTrigger asChild>
            <Button variant="secondary" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerPortal>
            <DrawerOverlay />
            <DrawerContent className="px-8 py-4">
              <DrawerHeader>
                <DrawerTitle>Select Ingredients</DrawerTitle>
                <DrawerDescription>
                  Add all the ingredients in your dish
                </DrawerDescription>
              </DrawerHeader>
              <div>
                <ScrollArea className="flex h-72 flex-col ">
                  {ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="my-4 flex items-center justify-between gap-12"
                    >
                      <p>{ingredient.name}</p>
                      <Button
                        onClick={() =>
                          setSelectedIngredients([
                            ...selectedIngredients,
                            ingredient,
                          ])
                        }
                        disabled={selectedIngredients.includes(ingredient)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </DrawerContent>
          </DrawerPortal>
        </VaulDrawer.NestedRoot>
      </div>

      <div className="my-4 flex flex-wrap gap-3">
        {selectedIngredients.length === 0 && (
          <div className="flex w-full flex-col items-center justify-center rounded-lg border-[0.0125rem] border-dashed border-neutral-300 px-4 py-8">
            <p className="text-lg font-medium">No ingredients selected</p>
            <p className="text-sm text-neutral-500">
              Add some ingredients above!
            </p>
          </div>
        )}
        {selectedIngredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="rounded-full bg-slate-100 px-4 py-1"
          >
            <p>{ingredient.name}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 py-4">
        <Button
          variant="secondary"
          className="flex-1 items-center gap-1"
          onClick={() => {
            props.animationControls.start({
              x: "10%",
              opacity: 0,
              transition: { duration: 0.1 },
            });
            setTimeout(() => setStep("basicInfo"), 150);
            setTimeout(
              () =>
                props.animationControls.start({
                  x: "0%",
                  opacity: 1,
                  transition: { duration: 0.015 },
                }),
              225,
            );
          }}
        >
          <span>
            <ChevronLeftIcon className="h-4 w-4" />
          </span>
          <span>Back</span>
        </Button>
        <Button className="flex-1 items-center gap-1" onClick={create}>
          <span>Next</span>
          <span>
            <ChevronRightIcon className="h-4 w-4" />
          </span>
        </Button>
      </div>
    </div>
  );
};

const WizardStepThree = (props: { animationControls: AnimationControls }) => {
  const [foodId, setStep, onOpenChange] = useFormStore((s) => [s.foodId, s.setStep, s.onOpenChange]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <DrawerHeader>
          <DrawerTitle>Upload A Picture</DrawerTitle>
          <DrawerDescription>
            Add a picture of your dish!
          </DrawerDescription>
        </DrawerHeader>
      </div>
      <UploadButton
        endpoint="image"
        input={{ foodId: foodId! }}
      />
      <div className="flex gap-2 py-4">
        <Button
          variant="secondary"
          className="flex-1 items-center gap-1"
          onClick={() => {
            props.animationControls.start({
              x: "10%",
              opacity: 0,
              transition: { duration: 0.1 },
            });
            setTimeout(() => setStep("ingredients"), 150);
            setTimeout(
              () =>
                props.animationControls.start({
                  x: "0%",
                  opacity: 1,
                  transition: { duration: 0.015 },
                }),
              225,
            );
          }}
        >
          <span>
            <ChevronLeftIcon className="h-4 w-4" />
          </span>
          <span>Back</span>
        </Button>
        <Button className="flex-1 items-center gap-1" onClick={() => onOpenChange(false)}>
          <span>Finish</span>
          <span>
            <ChevronRightIcon className="h-4 w-4" />
          </span>
        </Button>
      </div>
    </div>
  );
};

const CreateDishForm = () => {
  const [step, setStep] = useFormStore((s) => [s.step, s.setStep]);
  const animationControls = useAnimationControls();

  return (
    <motion.div animate={animationControls}>
      {step === "basicInfo" && (
        <>
          <DrawerHeader>
            <DrawerTitle>Add a new dish</DrawerTitle>
            <DrawerDescription>
              Let's start by adding some of the basic info!
            </DrawerDescription>
          </DrawerHeader>
          <WizardStepOne
            submitCallback={() => {
              animationControls.start({
                x: "-10%",
                opacity: 0,
                transition: { duration: 0.1 },
              });
              setTimeout(() => setStep("ingredients"), 150);
              setTimeout(
                () =>
                  animationControls.start({
                    x: "0%",
                    opacity: 1,
                    transition: { duration: 0.015 },
                  }),
                225,
              );
            }}
          />
        </>
      )}

      {step === "ingredients" && (
        <>
          {/* <DrawerHeader>
            <DrawerTitle>Add a new dish</DrawerTitle>
            <DrawerDescription>
              Let's start by adding some of the basic info!
            </DrawerDescription>
          </DrawerHeader> */}
          <Suspense>
            <WizardStepTwo animationControls={animationControls} />
          </Suspense>
        </>
      )}

      {step === "picture" && <WizardStepThree animationControls={animationControls}/>}
    </motion.div>
  );
};

export const CreateMenu = () => {
  const [reset, open, onOpenChange] = useFormStore((s) => [s.reset, s.open, s.onOpenChange]);

  return (<>
    <Button variant="secondary" onClick={() => onOpenChange(true)}>
      <span className="mr-4">
        <PlusIcon className="h-4 w-4" />
      </span>
      <span>Add Item</span>
    </Button>
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      onClose={() => {
        setTimeout(reset, 500);
      }}
    >
      <DrawerTrigger asChild>
      </DrawerTrigger>
      <DrawerContent>
        {/* <DrawerHeader>
          <DrawerTitle>Add a new dish</DrawerTitle>
          <DrawerDescription>Make sure its yummy!</DrawerDescription>
        {/* <div> */}
        {/* <AnitePresence> */}
        <ResizablePanel>
          <CreateDishForm />
        </ResizablePanel>
        {/* </AnimatePresence> */}
        {/* </div> */}
      </DrawerContent>
    </Drawer>
  </>
  );
};

function ResizablePanel(props: { children: React.ReactNode }) {
  let [ref, { height }] = useMeasure();

  return (
    <motion.div
      animate={{ height: height || "auto", transition: { duration: 0.25 } }}
      className="relative overflow-hidden"
    >
      {/* <AnimatePresence initial={false}> */}
      <div
        ref={ref}
        className={`${height ? "absolute" : "relative"} w-full px-8 py-4`}
      >
        {props.children}
      </div>
      {/* </AnimatePresence> */}
    </motion.div>
  );
}
