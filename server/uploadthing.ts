import { FileRouter, createUploadthing } from "uploadthing/server";
import { prisma } from "./api/db";
import { uploadFoodSchema } from "~/shared/schemas";

const f = createUploadthing();

export const uploadRouter = {
  image: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    }
  })
    .input(uploadFoodSchema)
    .middleware(async ({ input }) => {
      return input;
    })
    .onUploadComplete((data) => {
      prisma.food.update({
        where: {
          id: data.metadata.foodId
        },
        data: {
          imageKey: data.file.key
        }
      })
    })
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
