import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type FieldProps = ComponentProps<"label"> & {
  label: string;
  hint?: string;
};

function Field({ className, label, hint, children, ...props }: FieldProps) {
  return (
    <label className={cn("block", className)} {...props}>
      <span className="mb-2 block text-sm font-semibold text-[#3D2F2A]">
        {label}
      </span>
      {children}
      {hint ? <p className="mt-2 text-xs text-[#8A746B]">{hint}</p> : null}
    </label>
  );
}

function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-[#E7D8CB] bg-[#FFFDF9] px-4 py-3 text-sm text-[#3D2F2A] outline-none transition placeholder:text-[#9B8B83] focus:border-[#C98276] focus:ring-2 focus:ring-[#C98276]/15",
        className,
      )}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-2xl border border-[#E7D8CB] bg-[#FFFDF9] px-4 py-3 text-sm text-[#3D2F2A] outline-none transition placeholder:text-[#9B8B83] focus:border-[#C98276] focus:ring-2 focus:ring-[#C98276]/15",
        className,
      )}
      {...props}
    />
  );
}

type InputFrameProps = ComponentProps<"div"> & {
  icon?: ReactNode;
};

function InputFrame({ className, icon, children, ...props }: InputFrameProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-[#E7D8CB] bg-white/70 px-4 py-3 shadow-sm focus-within:border-[#C98276] focus-within:ring-2 focus-within:ring-[#C98276]/15",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </div>
  );
}

export { Field, Input, InputFrame, Textarea };
