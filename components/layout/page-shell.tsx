import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, BookHeart } from "lucide-react";

import { AppSidebar, MobileTabBar } from "@/components/layout/app-navigation";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: "4xl" | "5xl" | "6xl" | "7xl";
  withAppNav?: boolean;
};

const maxWidthClass = {
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

function PageShell({
  children,
  className,
  contentClassName,
  maxWidth = "7xl",
  withAppNav = false,
}: PageShellProps) {
  return (
    <main className={cn("min-h-screen bg-[#F8F1E8] text-[#3D2F2A]", className)}>
      {withAppNav ? <AppSidebar /> : null}
      <section
        className={cn(
          "mx-auto w-full px-4 py-6 pb-28 sm:px-6 sm:py-8 xl:pb-8",
          withAppNav && "xl:pl-56",
          maxWidthClass[maxWidth],
          contentClassName,
        )}
      >
        {children}
      </section>
      {withAppNav ? <MobileTabBar /> : null}
    </main>
  );
}

type TopNavProps = {
  action?: ReactNode;
  backHref?: string;
  backLabel?: string;
  brandHref?: string;
  brandLabel?: string;
  className?: string;
};

function TopNav({
  action,
  backHref,
  backLabel = "Back",
  brandHref = "/",
  brandLabel = "Dearly",
  className,
}: TopNavProps) {
  return (
    <nav className={cn("mb-8 flex items-center justify-between gap-4 sm:mb-10", className)}>
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C6A62] hover:text-[#3D2F2A]"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      ) : (
        <Link href={brandHref} className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          <BookHeart className="h-6 w-6" />
          {brandLabel}
        </Link>
      )}

      {backHref ? (
        <Link href={brandHref} className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          <BookHeart className="h-6 w-6" />
          {brandLabel}
        </Link>
      ) : (
        action
      )}
    </nav>
  );
}

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
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-6xl">{title}</h1>
        {description ? (
          <p className="mt-4 text-lg leading-8 text-[#6F5E57]">{description}</p>
        ) : null}
      </div>
      {actions}
    </header>
  );
}

export { PageHeader, PageShell, TopNav };
