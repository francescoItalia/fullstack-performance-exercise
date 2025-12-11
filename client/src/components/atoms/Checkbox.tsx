import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export function Checkbox({ label, className = "", ...props }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-gray-300 text-indigo-600 
          focus:ring-indigo-500 focus:ring-offset-0"
        {...props}
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

