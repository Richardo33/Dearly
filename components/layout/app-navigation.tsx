"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";

import { appConfig } from "@/src/constants/app";
import { appNavigation, mobileNavigation } from "@/src/constants/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type AppNavigationProps = {
  isAdmin?: boolean;
};

function AppSidebar({ isAdmin = false }: AppNavigationProps) {
  const pathname = usePathname();
  const navigationItems = appNavigation.filter(
    (item) => isAdmin || item.href !== "/settings",
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-48 border-r border-[#E7D8CB] bg-[#FFF9EF]/95 px-4 py-6 backdrop-blur xl:flex xl:flex-col">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-lg font-bold text-[#3D2F2A]"
        aria-label="Dearly home"
      >
        <Heart className="h-5 w-5 text-[#D9798F]" />
        {appConfig.name}
      </Link>

      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold text-[#7C6A62] transition hover:bg-white hover:text-[#3D2F2A]",
                active && "bg-[#F3D6D0] text-[#7C4F46]",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rotate-[-3deg] rounded-2xl bg-[#F5E3C6] p-4 text-[11px] leading-5 text-[#7C4F46] shadow-sm">
        <p className="font-bold">Quick note</p>
        <p className="mt-1">
          Open a person profile to manage diary, wishlist, timeline, and little
          things.
        </p>
      </div>
    </aside>
  );
}

function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-[1.25rem] border border-[#E7D8CB] bg-[#FFFDF8]/95 p-2 shadow-xl backdrop-blur xl:hidden">
      {mobileNavigation.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex min-w-0 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold text-[#8A746B]",
              active && "bg-[#F3D6D0] text-[#7C4F46]",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export { AppSidebar, MobileTabBar };
