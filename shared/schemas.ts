import { z } from "zod";

export const uploadFoodSchema = z.object({ foodId: z.string() });
