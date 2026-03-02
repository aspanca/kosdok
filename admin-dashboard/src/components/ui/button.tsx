import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = (variant?: string) =>
  variant === "outline"
    ? "border border-border bg-white text-text-primary hover:border-primary hover:text-primary"
    : "bg-primary text-white hover:bg-primary/90";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger";
  size?: "default" | "sm";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50",
        size === "sm" ? "px-3 py-1.5" : "px-4 py-2",
        buttonVariants(variant),
        variant === "danger" && "bg-status-error hover:bg-status-error/90 text-white",
        className
      )}
      {...props}
    />
  )
);
