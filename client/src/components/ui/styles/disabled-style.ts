import { cva } from "class-variance-authority";

export const disabledStyles = cva(
  "disabled:pointer-events-none disabled:opacity-50",
);
