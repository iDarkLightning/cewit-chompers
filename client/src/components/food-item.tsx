export const FoodItem = (props:
  {
    name: string,
    description: string,
    price: number,
    imageKey: string | null
  }) => {
  return (<>
    {props.imageKey && <img src={`https://utfs.io/f/${props.imageKey}`} />}
    <div>{props.name}</div>
    <div>{props.price}</div>
    <div>{props.description}</div>
  </>)
}
