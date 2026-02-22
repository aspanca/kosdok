import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - Main CTA button
        primary: "bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md",
        
        // Secondary - Less prominent actions
        secondary: "bg-background-page text-text-primary hover:bg-border-light border border-border",
        
        // Outline - Bordered button
        outline: "border border-border bg-white text-text-primary hover:border-primary hover:text-primary",
        
        // Ghost - Minimal button
        ghost: "text-text-secondary hover:bg-background-page hover:text-text-primary",
        
        // Link - Text only
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        
        // Success - Confirmation actions
        success: "bg-status-success text-white hover:bg-status-success/90",
        
        // Danger - Destructive actions
        danger: "bg-status-error text-white hover:bg-status-error/90",
        
        // White - For dark backgrounds
        white: "bg-white text-primary hover:bg-white/95 shadow-lg",
        
        // Gradient - Eye-catching CTA
        gradient: "bg-gradient-to-r from-primary to-primary-light text-white hover:opacity-90 shadow-md",
        
        // Default (legacy support)
        default: "bg-primary text-white hover:bg-primary/90",
        destructive: "bg-status-error text-white hover:bg-status-error/90",
      },
      size: {
        xs: "h-7 px-2.5 text-[11px] rounded",
        sm: "h-8 px-3 text-[12px] rounded-md",
        default: "h-10 px-4 text-[13px] rounded-lg",
        lg: "h-11 px-6 text-[14px] rounded-lg",
        xl: "h-12 px-8 text-[15px] rounded-xl",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Duke u ngarkuar...</span>
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
