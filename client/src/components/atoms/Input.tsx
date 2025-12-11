import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        placeholder:text-gray-400 ${className}`}
      {...props}
    />
  );
}

