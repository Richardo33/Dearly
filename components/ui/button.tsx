import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-[#C98276]/25 active:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#3D2F2A] text-white shadow-sm hover:bg-[#2D211D]",
        outline:
          "border-[#D9C9BC] bg-white/50 text-[#3D2F2A] hover:bg-white",
        secondary:
          "bg-[#F8F1E8] text-[#3D2F2A] hover:bg-[#EFE3D8]",
        ghost:
          "text-[#7C6A62] hover:bg-white/60 hover:text-[#3D2F2A]",
        destructive:
          "bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-500/20",
        link: "h-auto rounded-none p-0 text-[#7C6A62] underline-offset-4 hover:text-[#3D2F2A] hover:underline",
      },
      size: {
        default: "h-11 gap-2 px-5",
        xs: "h-7 gap-1.5 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-2 px-4 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
