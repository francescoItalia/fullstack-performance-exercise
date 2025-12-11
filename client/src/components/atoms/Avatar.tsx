type AvatarProps = {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

export function Avatar({ src, alt, size = "md" }: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover`}
    />
  );
}

