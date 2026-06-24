import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        accent: "bg-[#F3D6D0] text-[#9B645C]",
        muted: "bg-[#F8F1E8] text-[#7C6A62]",
        outline: "border border-[#D9C9BC] bg-white/50 text-[#7C6A62]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
