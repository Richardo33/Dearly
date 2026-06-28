import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  actions?: ReactNode;
  className?: string;
  description?: string;
  eyebrow?: ReactNode;
  title: string;
};

function PageHeader({
  actions,
  className,
  description,
  eyebrow,
  title,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end",
        className,
      )}
    >
      <div className="max-w-3xl">
        {eyebrow}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-lg leading-8 text-[#6F5E57]">{description}</p>
        ) : null}
      </div>
      {actions}
    </header>
  );
}

export { PageHeader };
