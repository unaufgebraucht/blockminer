import { Link, useLocation } from "react-router-dom";
import { Backpack, Bomb, Crown, Package, TrendingUp, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    ? [...tabs, { path: "/admin" as const, label: "Admin", icon: Crown }]
    : tabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t-4 border-border">
      <div className="mx-auto max-w-6xl px-1 md:px-8">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${visibleTabs.length}, minmax(0, 1fr))`,
          }}
        >
          {visibleTabs.map((t) => {
            const isActive = location.pathname === t.path;
            return (
              <Link
                key={t.path}
                to={t.path}
                className={cn(
                  "relative py-2 px-1 flex flex-col items-center justify-center gap-0.5 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute top-0 left-2 right-2 h-[3px] bg-primary"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <t.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_6px_hsl(var(--primary))]")} />
                <span className="font-minecraft text-[10px] leading-none">
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
