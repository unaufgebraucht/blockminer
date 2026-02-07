import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTexture } from '@/components/MinecraftTextures';
import { MainLayout } from '@/components/MainLayout';
import { Package, Bomb, TrendingUp, Backpack, Pickaxe, Coins, Zap } from 'lucide-react';

const games = [
  {
    path: '/cases',
    name: 'CRATES',
    description: 'Open mystery crates to win rare items',
    icon: Package,
    texture: 'chest',
    gradient: 'from-[hsl(var(--gold))]/20 to-transparent',
    borderColor: 'border-[hsl(var(--gold))]/60',
    textColor: 'text-[hsl(var(--gold))]',
  },
  {
    path: '/mines',
    name: 'MINES',
    description: 'Avoid bombs and collect gems',
    icon: Bomb,
    texture: 'tnt',
    gradient: 'from-destructive/20 to-transparent',
    borderColor: 'border-destructive/60',
    textColor: 'text-destructive',
  },
  {
    path: '/upgrader',
    name: 'UPGRADER',
    description: 'Risk items for higher value',
    icon: TrendingUp,
    texture: 'diamond',
    gradient: 'from-accent/20 to-transparent',
    borderColor: 'border-accent/60',
    textColor: 'text-accent',
  },
  {
    path: '/inventory',
    name: 'INVENTORY',
    description: 'View and sell your items',
    icon: Backpack,
    texture: 'emerald',
    gradient: 'from-[hsl(var(--emerald))]/20 to-transparent',
    borderColor: 'border-[hsl(var(--emerald))]/60',
    textColor: 'text-[hsl(var(--emerald))]',
  },
];

export default function Index() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 bg-primary flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,0.4)]"
            >
              <Pickaxe className="w-7 h-7 text-primary-foreground" />
            </motion.div>
            <h1 className="font-pixel text-2xl md:text-3xl text-foreground">
              MINE<span className="text-primary">CRATE</span>
            </h1>
          </div>
          <p className="font-minecraft text-muted-foreground max-w-md mx-auto">
            Open crates, play mines, upgrade items.
            <span className="text-[hsl(var(--gold))]"> Win big!</span>
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
          {games.map((game, index) => (
            <motion.div
              key={game.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Link to={game.path}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative overflow-hidden bg-card border-4 ${game.borderColor} p-5 h-full shadow-[3px_3px_0px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-[5px_5px_0px_rgba(0,0,0,0.3)]`}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${game.gradient} pointer-events-none`} />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3" style={{ imageRendering: 'pixelated' }}>
                      {getTexture(game.texture)}
                    </div>
                    
                    <h3 className={`font-pixel text-sm md:text-base text-center mb-1 ${game.textColor}`}>
                      {game.name}
                    </h3>
                    
                    <p className="font-minecraft text-muted-foreground text-center text-xs hidden md:block">
                      {game.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Play Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/cases"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary border-4 border-primary text-primary-foreground font-pixel text-xs shadow-[3px_3px_0px_rgba(0,0,0,0.3)] transition-all hover:shadow-[5px_5px_0px_rgba(0,0,0,0.3)]"
            >
              <Zap className="w-4 h-4" />
              OPEN CRATES
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/mines"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-4 border-[hsl(var(--gold))]/60 text-[hsl(var(--gold))] font-pixel text-xs shadow-[3px_3px_0px_rgba(0,0,0,0.3)] hover:bg-[hsl(var(--gold))]/10 transition-all"
            >
              <Bomb className="w-4 h-4" />
              PLAY MINES
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="bg-card border-4 border-border p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center">
              <Coins className="w-7 h-7 text-[hsl(var(--gold))]" />
            </div>
            <h3 className="font-pixel text-[10px] md:text-xs text-[hsl(var(--gold))] mb-1">FREE COINS</h3>
            <p className="font-minecraft text-muted-foreground text-[10px] md:text-xs">
              Start with 1,000!
            </p>
          </div>

          <div className="bg-card border-4 border-border p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2" style={{ imageRendering: 'pixelated' }}>
              {getTexture('diamond-sword')}
            </div>
            <h3 className="font-pixel text-[10px] md:text-xs text-accent mb-1">REAL ITEMS</h3>
            <p className="font-minecraft text-muted-foreground text-[10px] md:text-xs">
              Win items with value
            </p>
          </div>

          <div className="bg-card border-4 border-border p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2" style={{ imageRendering: 'pixelated' }}>
              {getTexture('nether-star')}
            </div>
            <h3 className="font-pixel text-[10px] md:text-xs text-foreground mb-1">LEGENDARY</h3>
            <p className="font-minecraft text-muted-foreground text-[10px] md:text-xs">
              Rare drops worth 1000s
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center font-minecraft text-muted-foreground/50 text-[10px] pb-4">
          <p>For entertainment purposes only. Not affiliated with Mojang.</p>
        </div>
      </div>
    </MainLayout>
  );
}
