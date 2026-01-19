"use client";

import { Home, BookOpen, Settings, BarChart3, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePlanSwitcherContext } from "./PlanSwitcherContext";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/learn", icon: BookOpen, label: "Learn" },
  { href: "/progress", icon: BarChart3, label: "Progress" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { handleOpen } = usePlanSwitcherContext();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-card-border sm:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all flex-1",
                isActive
                  ? "text-accent bg-accent/10"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        <button
          type="button"
          onClick={handleOpen}
          className="flex flex-col items-center justify-center w-14 h-14 -mt-3 rounded-full bg-accent text-accent-foreground border-2 border-card-border shadow-lg active:scale-95 transition-all z-10"
          aria-label="Switch hobby"
        >
          <Plus className="w-6 h-6" />
        </button>

        {navItems.slice(2).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all flex-1",
                isActive
                  ? "text-accent bg-accent/10"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
