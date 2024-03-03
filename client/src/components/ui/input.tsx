import * as React from "react";

import { cn } from "../../lib/cn";
import { disabledStyles } from "./styles/disabled-style";
import { focusStyles } from "./styles/focus-style";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "placeholder:text-muted-neutral-400 flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium ",
          disabledStyles(),
          focusStyles(),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
