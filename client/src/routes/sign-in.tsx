import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchParamSchema = z.object({
  callback: z.string().optional(),
  error: z.string().optional(),
  token: z.string().optional(),
});

export const Route = createFileRoute("/sign-in")({
  validateSearch: searchParamSchema,
});
