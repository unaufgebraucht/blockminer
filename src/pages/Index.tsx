import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTexture } from '@/components/MinecraftTextures';
import { Package, Bomb, TrendingUp, Backpack, Pickaxe, Coins, Users, Trophy } from 'lucide-react';

const games = [
  {
    path: '/cases',
    name: 'CRATES',
    description: 'Open mystery crates to win rare Minecraft items',
    icon: Package,
    texture: 'chest',
    color: '#ffd700',
  },
  {
    path: '/mines',
    name: 'MINES',
    description: 'Avoid TNT bombs and collect diamonds & emeralds',
    icon: Bomb,
    texture: 'tnt',
    color: '#ef4444',
  },
  {
    path: '/upgrader',
    name: 'UPGRADER',
    description: 'Risk your items for a chance at higher value',
    icon: TrendingUp,
    texture: 'diamond',
    color: '#4ade80',
  },
  {
    path: '/inventory',
    name: 'INVENTORY',
    description: 'View and sell your collected items',
    icon: Backpack,
    texture: 'emerald',
    color: '#4AEDD9',
  },
];

const stats = [
  { label: 'ONLINE PLAYERS', value: '1,247', icon: Users },
  { label: 'TOTAL WON', value: '$2.4M', icon: Trophy },
  { label: 'ITEMS OPENED', value: '847K', icon: Package },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Hero */}
      <header className="relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1a] via-transparent to-[#1a1a2e]" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 bg-[#4ade80] flex items-center justify-center" style={{ imageRendering: 'pixelated' }}>
                <Pickaxe className="w-10 h-10 text-black" />
              </div>
              <h1 className="font-pixel text-3xl md:text-5xl text-white">
                MINE<span className="text-[#4ade80]">CRAFT</span>
              </h1>
            </div>

            <p className="font-minecraft text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Open crates, play mines, upgrade items. <br />
              <span className="text-[#ffd700]">Win big with Minecraft-themed gambling!</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/cases"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#4ade80] border-4 border-[#22c55e] text-black font-pixel text-lg hover:bg-[#22c55e] transition-all"
                >
                  <Package className="w-5 h-5" />
                  OPEN CRATES
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/mines"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-4 border-[#ffd700] text-[#ffd700] font-pixel text-lg hover:bg-[#ffd700] hover:text-black transition-all"
                >
                  <Bomb className="w-5 h-5" />
                  PLAY MINES
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Stats */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0f0f1a] border-4 border-[#2a2a4a] p-4 text-center"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-[#4ade80]" />
              <p className="font-pixel text-xl md:text-2xl text-[#ffd700]">{stat.value}</p>
              <p className="font-minecraft text-gray-500 text-xs md:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Games Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-pixel text-2xl text-white text-center mb-8">CHOOSE YOUR GAME</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.path}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={game.path}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-[#0f0f1a] border-4 p-6 h-full transition-all"
                  style={{ borderColor: game.color }}
                >
                  <div className="w-20 h-20 mx-auto mb-4" style={{ imageRendering: 'pixelated' }}>
                    {getTexture(game.texture)}
                  </div>
                  
                  <h3 className="font-pixel text-lg text-center mb-2" style={{ color: game.color }}>
                    {game.name}
                  </h3>
                  
                  <p className="font-minecraft text-gray-400 text-center text-sm">
                    {game.description}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#0f0f1a] border-4 border-[#2a2a4a] p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#ffd700]/20 flex items-center justify-center border-4 border-[#ffd700]">
              <Coins className="w-8 h-8 text-[#ffd700]" />
            </div>
            <h3 className="font-pixel text-sm text-[#ffd700] mb-2">FREE COINS</h3>
            <p className="font-minecraft text-gray-400">
              Start with 1000 free coins and play instantly!
            </p>
          </div>

          <div className="bg-[#0f0f1a] border-4 border-[#2a2a4a] p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4" style={{ imageRendering: 'pixelated' }}>
              {getTexture('diamond-sword')}
            </div>
            <h3 className="font-pixel text-sm text-[#4AEDD9] mb-2">REAL ITEMS</h3>
            <p className="font-minecraft text-gray-400">
              Win authentic Minecraft items with real value
            </p>
          </div>

          <div className="bg-[#0f0f1a] border-4 border-[#2a2a4a] p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4" style={{ imageRendering: 'pixelated' }}>
              {getTexture('nether-star')}
            </div>
            <h3 className="font-pixel text-sm text-white mb-2">LEGENDARY DROPS</h3>
            <p className="font-minecraft text-gray-400">
              Rare legendary items worth thousands of coins
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-[#2a2a4a] mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4ade80] flex items-center justify-center">
                <Pickaxe className="w-5 h-5 text-black" />
              </div>
              <span className="font-pixel text-sm text-white">
                MINE<span className="text-[#4ade80]">CRAFT</span>
              </span>
            </div>
            
            <p className="font-minecraft text-gray-500 text-sm text-center">
              For entertainment purposes only. Play responsibly.
            </p>
            
            <p className="font-minecraft text-gray-600 text-xs">
              Not affiliated with Mojang or Microsoft
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
