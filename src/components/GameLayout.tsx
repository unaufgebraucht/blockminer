import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Package, Bomb, TrendingUp, Backpack, Coins, Menu, X, Pickaxe } from 'lucide-react';

const navItems = [
  { path: '/cases', label: 'CRATES', icon: Package },
  { path: '/mines', label: 'MINES', icon: Bomb },
  { path: '/upgrader', label: 'UPGRADER', icon: TrendingUp },
  { path: '/inventory', label: 'INVENTORY', icon: Backpack },
];

export function GameLayout({ children }: { children: ReactNode }) {
  const { balance } = useGame();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0f0f1a] border-r-4 border-[#2a2a4a]">
        {/* Logo */}
        <div className="p-6 border-b-4 border-[#2a2a4a]">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4ade80] flex items-center justify-center" style={{ imageRendering: 'pixelated' }}>
              <Pickaxe className="w-6 h-6 text-black" />
            </div>
            <span className="font-pixel text-sm text-white">MINE<span className="text-[#4ade80]">CRAFT</span></span>
          </Link>
        </div>

        {/* Balance */}
        <div className="p-4 mx-4 mt-4 bg-[#1a1a2e] border-4 border-[#ffd700]">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#ffd700]" />
            <span className="font-pixel text-[#ffd700] text-sm">{balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 transition-all border-4 ${
                  isActive
                    ? 'bg-[#4ade80] border-[#22c55e] text-black'
                    : 'bg-[#1a1a2e] border-[#2a2a4a] text-gray-400 hover:border-[#4ade80] hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-minecraft text-lg">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t-4 border-[#2a2a4a]">
          <p className="font-minecraft text-xs text-gray-500 text-center">
            PLAY RESPONSIBLY
          </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f0f1a] border-b-4 border-[#2a2a4a]">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4ade80] flex items-center justify-center">
              <Pickaxe className="w-5 h-5 text-black" />
            </div>
            <span className="font-pixel text-xs text-white">MINE<span className="text-[#4ade80]">CRAFT</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-[#1a1a2e] border-2 border-[#ffd700]">
              <Coins className="w-4 h-4 text-[#ffd700]" />
              <span className="font-pixel text-xs text-[#ffd700]">{balance.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-[#1a1a2e] border-2 border-[#2a2a4a]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-2 bg-[#0f0f1a] border-t-2 border-[#2a2a4a]"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 transition-all border-4 ${
                    isActive
                      ? 'bg-[#4ade80] border-[#22c55e] text-black'
                      : 'bg-[#1a1a2e] border-[#2a2a4a] text-gray-400'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-minecraft">{item.label}</span>
                </Link>
              );
            })}
          </motion.nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 md:p-8 p-4 pt-20 md:pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
