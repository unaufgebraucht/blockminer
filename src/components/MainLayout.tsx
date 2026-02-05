import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export function MainLayout({ children }: { children: ReactNode }) {
  const { profile } = useGame();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin, username")
        .eq("user_id", user.id)
        .single();

      if (error) return;
      setIsAdmin(Boolean(data?.is_admin) || data?.username?.toLowerCase() === "albiza");
    };

    checkAdmin();
  }, [user]);

  useEffect(() => {
    // If the user logs out while on a protected screen, move them to auth.
    if (!user) navigate("/auth");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader username={profile?.username || "Player"} isAdmin={isAdmin} />

      <main className="mx-auto max-w-6xl px-4 md:px-8 pt-20 pb-24">
        {children}
      </main>

      <BottomTabBar isAdmin={isAdmin} />
    </div>
  );
}
