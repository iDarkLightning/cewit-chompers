import { Suspense, useEffect, useState } from "react";
import {
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";
import { Ingredient } from "@prisma/client";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { AnimationControls, motion, useAnimationControls } from "framer-motion";
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
    }),
  setBasicInfo: (basicInfo: BasicInfo) => set({ basicInfo }),
  setStep: (step: FormStore["step"]) => set({ step }),
}));

const WizardStepOne = (props: { submitCallback: () => void }) => {
  const { basicInfo, setBasicInfo } = useFormStore();
  const navigate = useNavigate();

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

const WizardStepTwo = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    [],
  );
  //   const setStep = useFormStore((s) => s.setStep);

  const [ingredients] = trpc.ingredients.getAll.useSuspenseQuery();

  return (
    <div>
      <div className="flex items-center justify-between gap-8">
        <div>
          <p className="text-lg font-medium">Add Ingredients</p>
          <p className="text-sm text-neutral-500">
            Add all the ingredients that are used in this dish
          </p>
        </div>

        <VaulDrawer.NestedRoot>
          <DrawerTrigger asChild>
            <Button variant="secondary" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerPortal>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Select Ingredients</DrawerTitle>
              </DrawerHeader>
              <div className="px-8 py-4">
                <ScrollArea className="flex h-72 flex-col ">
                  {ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="my-4 flex items-center justify-between gap-12"
                    >
                      <p>{ingredient.name}</p>
                      <Button
                        onClick={() =>
                          setSelectedIngredients((cur) => [...cur, ingredient])
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
        <Button variant="secondary" className="flex-1 items-center gap-1">
          <span>
            <ChevronLeftIcon className="h-4 w-4" />
          </span>
          <span>Back</span>
        </Button>
        <Button className="flex-1 items-center gap-1">
          <span>Next</span>
          <span>
            <ChevronRightIcon className="h-4 w-4" />
          </span>
        </Button>
      </div>
    </div>
  );
};

const WizardStepThree = () => {
  return (
    <div>
      <p>Step 3</p>
    </div>
  );
};

const CreateDishForm = () => {
  const [step, setStep] = useFormStore((s) => [s.step, s.setStep]);
  const animationControls = useAnimationControls();

  //   if (step === "basicInfo") {
  //     return (
  //       <WizardStepOne
  //         submitCallback={() => {
  //           animationControls.start({
  //             x: "-10%",
  //             opacity: 0,
  //             transition: { duration: 0.1 },
  //           });
  //           setTimeout(() => setStep("ingredients"), 150);
  //         }}
  //       />
  //     );
  //   }

  //   if (step === "ingredients") {
  //     return (
  //       <Suspense>
  //         <WizardStepTwo />
  //       </Suspense>
  //     );
  //   }

  //   if (step === "picture") {
  //     return <WizardStepThree />;
  //   }

  return (
    <motion.div animate={animationControls}>
      {step === "basicInfo" && (
        <WizardStepOne
          submitCallback={() => {
            animationControls.start({
              x: "-10%",
              opacity: 0,
              transition: { duration: 0.1 },
            });
            setTimeout(() => setStep("ingredients"), 150);
          }}
        />
      )}

      {step === "ingredients" && (
        <Suspense>
          <WizardStepTwo />
        </Suspense>
      )}

      {step === "picture" && <WizardStepThree />}
    </motion.div>
  );
};

export const CreateMenu = () => {
  const reset = useFormStore((s) => s.reset);

  return (
    <Drawer
      onClose={() => {
        setTimeout(reset, 500);
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="secondary">
          <span className="mr-4">
            <PlusIcon className="h-4 w-4" />
          </span>
          <span>Add Item</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        {/* <DrawerHeader>
          <DrawerTitle>Add a new dish</DrawerTitle>
          <DrawerDescription>Make sure its yummy!</DrawerDescription>
        </DrawerHeader> */}
        {/* <div> */}
        {/* <AnimatePresence> */}
        <ResizablePanel>
          <CreateDishForm />
        </ResizablePanel>
        {/* </AnimatePresence> */}
        {/* </div> */}
      </DrawerContent>
    </Drawer>
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
