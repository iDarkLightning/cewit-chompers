export const FoodItem = (props: {
  name: string;
  description: string;
  price: number;
  imageKey: string | null;
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border-[0.0125rem] border-neutral-200 bg-white">
      {props.imageKey && (
        <img
          src={`https://utfs.io/f/${props.imageKey}`}
          alt={props.name}
          className="rounded-md"
        />
      )}
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-lg font-medium">{props.name}</p>
          <p className="rounded-full border-[0.0125rem] border-amber-200 bg-amber-300 px-4 py-0.5 text-amber-900">
            ${props.price}
          </p>
        </div>
        <p className="text-sm text-neutral-600">
          {props.description.substring(0, 50)}
        </p>
      </div>
    </div>
  );
};
