import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-700 text-white shadow hover:bg-blue-800 font-semibold border border-blue-800",
        brand:
          "bg-blue-600 text-white shadow hover:bg-blue-700 font-semibold",
        secondary:
          "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 shadow-sm font-medium",
        outline:
          "border-2 border-blue-700 text-blue-700 bg-white hover:bg-blue-50 font-semibold",
        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-blue-800",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-700 shadow-sm font-semibold",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm font-semibold",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base rounded-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
