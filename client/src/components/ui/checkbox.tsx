// https://marek-rozmus.medium.com/styling-checkbox-with-tailwind-46a92c157e2d

export interface CheckboxProps {
  disabled?: boolean;
  defaultChecked?: boolean;
  id: string;
  label: string;
}

const Checkbox = (props: CheckboxProps) => (
  <div className="flex w-full gap-2">
    <input
      className="
        disabled:border-steel-400 disabled:bg-steel-400 peer relative mt-1 h-4 w-4 shrink-0 appearance-none rounded-sm border-2
        border-emerald-200 bg-white checked:border-0 checked:bg-emerald-300 checked:animate-jump-in
        focus:outline-none focus:ring-1
        focus:ring-emerald-100 focus:ring-offset-0
      "
      type="checkbox"
      {...props}
    />
    <svg
      className="pointer-events-none absolute mt-1 hidden h-4 w-4 stroke-white outline-none peer-checked:block"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <label htmlFor={props.id}>{props.label}</label>
  </div>
);

export default Checkbox;
