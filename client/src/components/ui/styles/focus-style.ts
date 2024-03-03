import { cva } from "class-variance-authority";

export const focusStyles = cva(
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-0 ring-offset-white",
);
