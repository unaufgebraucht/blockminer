import { Link, useNavigate } from "react-router-dom";
import { Coins, LogOut, Pickaxe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b-4 border-border">
      <div className="mx-auto max-w-6xl px-4 md:px-8 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0">
            <Pickaxe className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <div className="font-pixel text-xs text-foreground truncate">
              MINE<span className="text-primary">CRATE</span>
            </div>
            <div className="font-minecraft text-[11px] text-muted-foreground truncate">
              {username}{isAdmin ? " • ADMIN" : ""}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-2 bg-background border-2 border-border">
            <Coins className="w-4 h-4 text-primary" />
            <span className="font-pixel text-xs text-foreground">
              {balance.toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-background border-2 border-border text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
