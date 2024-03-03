import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchParamSchema = z.object({
  redirect: z.string().optional()
});

export const Route = createFileRoute("/home")({
  validateSearch: searchParamSchema,
});
