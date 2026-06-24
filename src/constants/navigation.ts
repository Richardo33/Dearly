import {
  Heart,
  Home,
  Info,
  Search,
  Settings,
  Users,
} from "lucide-react";

export const appNavigation = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/people", label: "People", icon: Users },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/search", label: "Search", icon: Search },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/", label: "About", icon: Info },
] as const;

export const mobileNavigation = [
  { href: "/admin", label: "Home", icon: Home },
  { href: "/people", label: "People", icon: Users },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/search", label: "Search", icon: Search },
] as const;
