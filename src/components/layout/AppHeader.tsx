import { Link, useNavigate } from "react-router-dom";
import { Coins, LogOut, Pickaxe, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";
import { motion } from "framer-motion";

export function AppHeader({
  username,
  isAdmin,
}: {
  username: string;
  isAdmin: boolean;
}) {
  const { signOut } = useAuth();
  const { balance } = useGame();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b-4 border-border">
      <div className="mx-auto max-w-6xl px-4 md:px-8 h-14 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 min-w-0 group">
          <motion.div
            whileHover={{ rotate: -15 }}
            className="w-9 h-9 bg-primary flex items-center justify-center shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
          >
            <Pickaxe className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div className="min-w-0 hidden sm:block">
            <div className="font-pixel text-xs text-foreground truncate leading-tight">
              MINE<span className="text-primary">CRATE</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Username badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 border-2 border-border rounded-sm">
            {isAdmin && <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />}
            <span className="font-minecraft text-xs text-muted-foreground truncate max-w-[100px]">
              {username}
            </span>
          </div>

          {/* Balance */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(var(--gold))]/10 border-2 border-[hsl(var(--gold))]/30">
            <Coins className="w-4 h-4 text-[hsl(var(--gold))]" />
            <span className="font-pixel text-xs text-[hsl(var(--gold))]">
              {balance.toLocaleString()}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 bg-muted/50 border-2 border-border text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
