import { trpc } from "~/client/utils/trpc";
import Checkbox from "./ui/checkbox";
import { useNavigate } from "@tanstack/react-router";

export const Welcome = (props: { redirectOnFinish: string | undefined }) => {
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

  const likesMutation = trpc.customer.addLikes.useMutation();
  const dislikesMutation = trpc.customer.addDislikes.useMutation();

  const navigate = useNavigate();

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
          autoPlay={true}
          muted
          className="block rounded-xl shadow-lg"
        >
          <source src="/public/chompers.mp4" type="video/mp4" />
        </video>
        <p>We'll assume you don't like the ones you don't select</p>
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

            likesMutation.mutate({ likes: liked });
            dislikesMutation.mutate({ dislikes: disliked });

            if (props.redirectOnFinish) {
              navigate({
                to: props.redirectOnFinish
              });
            }
          }}
          className=""
        >
          Submit
        </button>
      </div>
    </>
  );
};
