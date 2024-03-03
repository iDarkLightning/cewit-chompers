import { z } from "zod";

export const uploadFoodSchema = z.object({ foodId: z.string() });

export const createTableSchema = z.object({
  seats: z.number().int()
})

export const createMenuItemScheme = z.object({
  name: z.string(),
  price: z.number().nonnegative(),
  description: z.string(),
  ingredientIds: z.array(z.object({ ingredientId: z.string() })),
});
