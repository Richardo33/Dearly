import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const surfaceVariants = cva(
  "border border-[#E7D8CB] bg-white/70 shadow-sm backdrop-blur",
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-5",
        lg: "p-6",
      },
      radius: {
        md: "rounded-2xl",
        lg: "rounded-[1.5rem]",
        xl: "rounded-[2rem]",
      },
    },
    defaultVariants: {
      padding: "md",
      radius: "xl",
    },
  },
);

type SurfaceProps = ComponentProps<"div"> & VariantProps<typeof surfaceVariants>;

function Surface({ className, padding, radius, ...props }: SurfaceProps) {
  return (
    <div
      className={cn(surfaceVariants({ padding, radius, className }))}
      {...props}
    />
  );
}

export { Surface, surfaceVariants };
