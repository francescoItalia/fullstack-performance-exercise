import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const variantStyles = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
} as const;

/**
 * Button atom with primary/secondary variants.
 */
export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

