import { trpc } from "~/client/utils/trpc";
import Checkbox from "./ui/checkbox";

export const Welcome = () => {
  const commonIngredients = [
    "chicken",
    "beef",
    "potatoes",
    "rice",
    "pasta",
    "cilantro",
    "flour",
    "cheese",
  ];

  const likes = trpc.restaurant.create.useMutation({});

  return (
    <>
      <div className="flex flex-col gap-3">
        <h1 className="animate-fade-right text-4xl font-semibold">
          Welcome to Choosy Chompers
        </h1>
        <p className="animate-fade-up text-xl text-neutral-600">
          Choose the foods you'd like to eat.
        </p>
        <video
          id="video"
          // loop
          autoplay=""
          muted
          className="block rounded-xl shadow-lg"
        >
          <source src="/public/chompers.mp4" type="video/mp4" />
        </video>
        <p>We'll assume you don't like the ones you don't select:</p>
        <div>
          {commonIngredients.map((i) => (
            <Checkbox label={i} key={i} id={i} />
          ))}
        </div>
        <button 
          onClick={() => {
            const liked: string[] = commonIngredients.filter(
              (i) => document.getElementById(i)?.checked,
            );
            const disliked: string[] = commonIngredients.filter(
              (i) => !document.getElementById(i)?.checked,
            );
          }}
          className="w-left bg-emerald-300 rounded-[30px] hover:bg-emerald-400 hover:animate-jump"
        >
          Submit
        </button>
      </div>
    </>
  );
};
