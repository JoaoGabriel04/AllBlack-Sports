import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0";

  const variants = {
    primary: "bg-ink text-on-primary hover:opacity-90",
    secondary: "bg-soft-cloud text-ink hover:opacity-80",
    gold: "bg-gold text-on-primary hover:opacity-90 shadow-[0_0_20px_rgba(212,175,55,0.3)]",
    outline:
      "border border-hairline text-ink bg-transparent hover:bg-soft-cloud",
  };

  const sizes = {
    sm: "h-9 px-5 text-sm",
    md: "h-12 px-8 text-sm",
    lg: "h-14 px-10 text-base",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
