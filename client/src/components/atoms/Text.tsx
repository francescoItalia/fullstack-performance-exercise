import type { ReactNode } from "react";

type TextProps = {
  children: ReactNode;
  variant?: "body" | "caption" | "heading";
  className?: string;
};

const variantClasses = {
  body: "text-base text-gray-900",
  caption: "text-sm text-gray-500",
  heading: "text-lg font-semibold text-gray-900",
};

export function Text({ children, variant = "body", className = "" }: TextProps) {
  return (
    <span className={`${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

