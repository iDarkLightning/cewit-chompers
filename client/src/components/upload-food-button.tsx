import { UploadButton } from "~/client/utils/uploadthing"

export const FoodImageUploadButton = (props: { foodId: string }) => {
  return <UploadButton
    endpoint="image"
    input={{ foodId: props.foodId }}
  />
}
