import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Package, 
  Bomb, 
  TrendingUp, 
  Backpack, 
  Coins, 
  User, 
  Wallet, 
  Gamepad2,
  LogOut,
  Menu,
  X,
  Pickaxe,
  Crown,
  Sparkles
} from 'lucide-react';

type TabType = 'profile' | 'wallet' | 'games';

const gameItems = [
  { path: '/cases', label: 'CRATES', icon: Package, color: 'text-[hsl(var(--gold))]' },
  { path: '/mines', label: 'MINES', icon: Bomb, color: 'text-destructive' },
  { path: '/upgrader', label: 'UPGRADER', icon: TrendingUp, color: 'text-[hsl(var(--emerald))]' },
  { path: '/inventory', label: 'INVENTORY', icon: Backpack, color: 'text-accent' },
];

export function MainLayout({ children }: { children: ReactNode }) {
  const { balance, profile, inventory } = useGame();
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('games');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('is_admin, username')
        .eq('user_id', user.id)
        .single();
      setIsAdmin(data?.is_admin || data?.username?.toLowerCase() === 'albiza');
    };
    checkAdmin();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Profile Card */}
            <div className="relative overflow-hidden p-4 bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/20 border-4 border-primary flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <p className="font-pixel text-lg text-foreground">{profile?.username || 'Player'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="px-2 py-0.5 bg-accent/20 border border-accent text-accent font-minecraft text-xs">
                      LVL 1
                    </div>
                    {isAdmin && (
                      <div className="px-2 py-0.5 bg-[hsl(var(--gold))]/20 border border-[hsl(var(--gold))] text-[hsl(var(--gold))] font-minecraft text-xs flex items-center gap-1">
                        <Crown className="w-3 h-3" /> ADMIN
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-card border-4 border-border text-center">
                <p className="font-pixel text-lg text-[hsl(var(--gold))]">{balance.toLocaleString()}</p>
                <p className="font-minecraft text-xs text-muted-foreground">COINS</p>
              </div>
              <Link to="/inventory" className="p-3 bg-card border-4 border-border text-center hover:border-primary transition-colors">
                <p className="font-pixel text-lg text-accent">{inventory?.length || 0}</p>
                <p className="font-minecraft text-xs text-muted-foreground">ITEMS</p>
              </Link>
            </div>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 bg-destructive/10 border-4 border-destructive/50 text-destructive font-minecraft hover:bg-destructive hover:text-destructive-foreground transition-all"
            >
              <LogOut className="w-5 h-5" />
              LOGOUT
            </button>
          </motion.div>
        );
      case 'wallet':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Balance Card */}
            <div className="relative overflow-hidden p-6 bg-gradient-to-br from-[hsl(var(--gold))]/20 to-[hsl(var(--gold))]/5 border-4 border-[hsl(var(--gold))]/50 text-center">
              <div className="absolute top-2 right-2">
                <Sparkles className="w-5 h-5 text-[hsl(var(--gold))]/50" />
              </div>
              <Coins className="w-14 h-14 mx-auto mb-3 text-[hsl(var(--gold))] drop-shadow-lg" />
              <p className="font-minecraft text-xs text-muted-foreground mb-1">YOUR BALANCE</p>
              <p className="font-pixel text-4xl text-[hsl(var(--gold))] drop-shadow-lg">{balance.toLocaleString()}</p>
              <p className="font-minecraft text-xs text-[hsl(var(--gold))]/70 mt-1">COINS</p>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/inventory"
                className="p-3 bg-[hsl(var(--emerald))]/10 border-4 border-[hsl(var(--emerald))]/50 text-center font-minecraft text-sm text-[hsl(var(--emerald))] hover:bg-[hsl(var(--emerald))]/20 transition-colors"
              >
                SELL ITEMS
              </Link>
              <Link
                to="/cases"
                className="p-3 bg-primary/10 border-4 border-primary/50 text-center font-minecraft text-sm text-primary hover:bg-primary/20 transition-colors"
              >
                OPEN CRATES
              </Link>
            </div>
          </motion.div>
        );
      case 'games':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {gameItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 p-4 transition-all border-4 ${
                    isActive
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-card border-border text-foreground hover:border-primary'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? '' : item.color}`} />
                  <span className="font-minecraft text-lg">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Admin Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-3 p-4 transition-all border-4 ${
                  location.pathname === '/admin'
                    ? 'bg-[hsl(var(--gold))] border-[hsl(var(--gold))] text-background'
                    : 'bg-card border-[hsl(var(--gold))]/50 text-[hsl(var(--gold))] hover:border-[hsl(var(--gold))]'
                }`}
              >
                <Crown className="w-6 h-6" />
                <span className="font-minecraft text-lg">ADMIN</span>
              </Link>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-card border-r-4 border-border">
        {/* Logo */}
        <div className="p-6 border-b-4 border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary flex items-center justify-center">
              <Pickaxe className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="font-pixel text-sm text-foreground">MINE<span className="text-primary">CRATE</span></span>
          </Link>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b-4 border-border">
          {[
            { id: 'profile' as TabType, icon: User, label: 'Profile' },
            { id: 'wallet' as TabType, icon: Wallet, label: 'Wallet' },
            { id: 'games' as TabType, icon: Gamepad2, label: 'Games' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 p-3 flex flex-col items-center gap-1 transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-minecraft text-xs">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-auto">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-4 border-border">
          <p className="font-minecraft text-xs text-muted-foreground text-center">
            PLAY RESPONSIBLY
          </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b-4 border-border">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
              <Pickaxe className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-pixel text-xs text-foreground">MINE<span className="text-primary">CRATE</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-2 bg-background border-2 border-[hsl(var(--gold))]">
              <Coins className="w-4 h-4 text-[hsl(var(--gold))]" />
              <span className="font-pixel text-xs text-[hsl(var(--gold))]">{balance.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-background border-2 border-border"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card border-t-2 border-border overflow-hidden"
            >
              {/* Mobile Tab Bar */}
              <div className="flex border-b-2 border-border">
                {[
                  { id: 'profile' as TabType, icon: User, label: 'Profile' },
                  { id: 'wallet' as TabType, icon: Wallet, label: 'Wallet' },
                  { id: 'games' as TabType, icon: Gamepad2, label: 'Games' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 p-3 flex flex-col items-center gap-1 transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-muted-foreground'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-minecraft text-xs">{tab.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Mobile Tab Content */}
              <div className="p-4">
                {activeTab === 'games' ? (
                  <div className="space-y-2">
                    {gameItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 p-3 transition-all border-4 ${
                            isActive
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'bg-card border-border text-foreground'
                          }`}
                        >
                          <item.icon className={`w-5 h-5 ${isActive ? '' : item.color}`} />
                          <span className="font-minecraft">{item.label}</span>
                        </Link>
                      );
                    })}
                    
                    {/* Admin Link Mobile */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 p-3 transition-all border-4 ${
                          location.pathname === '/admin'
                            ? 'bg-[hsl(var(--gold))] border-[hsl(var(--gold))] text-background'
                            : 'bg-card border-[hsl(var(--gold))]/50 text-[hsl(var(--gold))]'
                        }`}
                      >
                        <Crown className="w-5 h-5" />
                        <span className="font-minecraft">ADMIN</span>
                      </Link>
                    )}
                  </div>
                ) : activeTab === 'wallet' ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-br from-[hsl(var(--gold))]/20 to-[hsl(var(--gold))]/5 border-4 border-[hsl(var(--gold))]/50 text-center">
                      <Coins className="w-10 h-10 mx-auto mb-2 text-[hsl(var(--gold))]" />
                      <p className="font-pixel text-3xl text-[hsl(var(--gold))]">{balance.toLocaleString()}</p>
                      <p className="font-minecraft text-xs text-muted-foreground">COINS</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/inventory"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 bg-[hsl(var(--emerald))]/10 border-4 border-[hsl(var(--emerald))]/50 text-center font-minecraft text-xs text-[hsl(var(--emerald))]"
                      >
                        SELL ITEMS
                      </Link>
                      <Link
                        to="/cases"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 bg-primary/10 border-4 border-primary/50 text-center font-minecraft text-xs text-primary"
                      >
                        OPEN CRATES
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/50">
                      <div className="w-12 h-12 bg-primary/20 border-2 border-primary flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-pixel text-sm">{profile?.username || 'Player'}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="px-1.5 py-0.5 bg-accent/20 border border-accent text-accent font-minecraft text-[10px]">LVL 1</span>
                          {isAdmin && <span className="px-1.5 py-0.5 bg-[hsl(var(--gold))]/20 border border-[hsl(var(--gold))] text-[hsl(var(--gold))] font-minecraft text-[10px]">ADMIN</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-destructive/10 border-4 border-destructive/50 text-destructive font-minecraft text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      LOGOUT
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:p-8 p-4 pt-24 md:pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
