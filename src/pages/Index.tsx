import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTexture } from '@/components/MinecraftTextures';
import { MainLayout } from '@/components/MainLayout';
import { Package, Bomb, TrendingUp, Backpack, Pickaxe, Coins, Users, Trophy } from 'lucide-react';

const games = [
  {
    path: '/cases',
    name: 'CRATES',
    description: 'Open mystery crates to win rare items',
    icon: Package,
    texture: 'chest',
    color: 'hsl(var(--gold))',
  },
  {
    path: '/mines',
    name: 'MINES',
    description: 'Avoid bombs and collect gems',
    icon: Bomb,
    texture: 'tnt',
    color: 'hsl(var(--destructive))',
  },
  {
    path: '/upgrader',
    name: 'UPGRADER',
    description: 'Risk items for higher value',
    icon: TrendingUp,
    texture: 'diamond',
    color: 'hsl(var(--primary))',
  },
  {
    path: '/inventory',
    name: 'INVENTORY',
    description: 'View and sell your items',
    icon: Backpack,
    texture: 'emerald',
    color: 'hsl(var(--accent))',
  },
];

const stats = [
  { label: 'ONLINE PLAYERS', value: '1,247', icon: Users },
  { label: 'TOTAL WON', value: '$2.4M', icon: Trophy },
  { label: 'ITEMS OPENED', value: '847K', icon: Package },
];

export default function Index() {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-primary flex items-center justify-center">
              <Pickaxe className="w-9 h-9 text-primary-foreground" />
            </div>
            <h1 className="font-pixel text-2xl md:text-4xl text-foreground">
              MINE<span className="text-primary">CRATE</span>
            </h1>
          </div>
          <p className="font-minecraft text-lg text-muted-foreground max-w-xl mx-auto">
            Open crates, play mines, upgrade items.
            <span className="text-[hsl(var(--gold))]"> Win big!</span>
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-card border-4 border-border p-4 text-center"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="font-pixel text-lg md:text-xl text-[hsl(var(--gold))]">{stat.value}</p>
              <p className="font-minecraft text-muted-foreground text-xs">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Games Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-pixel text-xl text-foreground text-center mb-6">CHOOSE YOUR GAME</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.path}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link to={game.path}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-card border-4 p-6 h-full transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
                    style={{ borderColor: game.color }}
                  >
                    <div className="w-20 h-20 mx-auto mb-4" style={{ imageRendering: 'pixelated' }}>
                      {getTexture(game.texture)}
                    </div>
                    
                    <h3 className="font-pixel text-lg text-center mb-2" style={{ color: game.color }}>
                      {game.name}
                    </h3>
                    
                    <p className="font-minecraft text-muted-foreground text-center text-sm">
                      {game.description}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/cases"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary border-4 border-primary text-primary-foreground font-pixel text-sm shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-all"
            >
              <Package className="w-5 h-5" />
              OPEN CRATES
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/mines"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-4 border-[hsl(var(--gold))] text-[hsl(var(--gold))] font-pixel text-sm shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:bg-[hsl(var(--gold))] hover:text-background transition-all"
            >
              <Bomb className="w-5 h-5" />
              PLAY MINES
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-card border-4 border-border p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[hsl(var(--gold))]/20 flex items-center justify-center border-4 border-[hsl(var(--gold))]">
              <Coins className="w-8 h-8 text-[hsl(var(--gold))]" />
            </div>
            <h3 className="font-pixel text-sm text-[hsl(var(--gold))] mb-2">FREE COINS</h3>
            <p className="font-minecraft text-muted-foreground text-sm">
              Start with 1000 free coins!
            </p>
          </div>

          <div className="bg-card border-4 border-border p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4" style={{ imageRendering: 'pixelated' }}>
              {getTexture('diamond-sword')}
            </div>
            <h3 className="font-pixel text-sm text-accent mb-2">REAL ITEMS</h3>
            <p className="font-minecraft text-muted-foreground text-sm">
              Win items with real value
            </p>
          </div>

          <div className="bg-card border-4 border-border p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4" style={{ imageRendering: 'pixelated' }}>
              {getTexture('nether-star')}
            </div>
            <h3 className="font-pixel text-sm text-foreground mb-2">LEGENDARY DROPS</h3>
            <p className="font-minecraft text-muted-foreground text-sm">
              Rare items worth thousands
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 text-center font-minecraft text-muted-foreground text-xs">
          <p>For entertainment purposes only. Play responsibly.</p>
          <p className="mt-1 text-muted-foreground/50">Not affiliated with Mojang or Microsoft</p>
        </div>
      </div>
    </MainLayout>
  );
}
