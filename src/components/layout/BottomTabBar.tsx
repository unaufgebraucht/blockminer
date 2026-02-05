import { Link, useLocation } from "react-router-dom";
import { Backpack, Bomb, Crown, Package, TrendingUp, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", label: "Home", icon: Home },
  { path: "/cases", label: "Crates", icon: Package },
  { path: "/mines", label: "Mines", icon: Bomb },
  { path: "/upgrader", label: "Upgrade", icon: TrendingUp },
  { path: "/inventory", label: "Inv", icon: Backpack },
] as const;

export function BottomTabBar({ isAdmin }: { isAdmin: boolean }) {
  const location = useLocation();

  const visibleTabs = isAdmin
    ? [...tabs, { path: "/admin", label: "Admin", icon: Crown }]
    : tabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-4 border-border">
      <div className="mx-auto max-w-6xl px-2 md:px-8">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${visibleTabs.length}, minmax(0, 1fr))` }}>
          {visibleTabs.map((t) => {
            const isActive = location.pathname === t.path;
            return (
              <Link
                key={t.path}
                to={t.path}
                className={cn(
                  "py-2.5 px-1 flex flex-col items-center justify-center gap-1 border-r-2 border-border last:border-r-0",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                )}
              >
                <t.icon className="w-5 h-5" />
                <span className="font-minecraft text-[11px] leading-none">
                  {t.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
