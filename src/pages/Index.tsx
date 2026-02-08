import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTexture } from '@/components/MinecraftTextures';
import { MainLayout } from '@/components/MainLayout';
import { Package, Bomb, TrendingUp, Backpack, Pickaxe, Coins, Zap, ChevronRight } from 'lucide-react';

const games = [
  {
    path: '/cases',
    name: 'CRATES',
    description: 'Open mystery crates to win rare items',
    icon: Package,
    texture: 'chest',
    accentVar: '--gold',
  },
  {
    path: '/mines',
    name: 'MINES',
    description: 'Avoid bombs and collect gems',
    icon: Bomb,
    texture: 'tnt',
    accentVar: '--destructive',
  },
  {
    path: '/upgrader',
    name: 'UPGRADER',
    description: 'Risk items for higher value rewards',
    icon: TrendingUp,
    texture: 'diamond',
    accentVar: '--accent',
  },
  {
    path: '/inventory',
    name: 'INVENTORY',
    description: 'View and sell your items',
    icon: Backpack,
    texture: 'emerald',
    accentVar: '--emerald',
  },
];

export default function Index() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, -12, 0, 12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 bg-accent flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,0.5)]"
            >
              <Pickaxe className="w-8 h-8 text-accent-foreground" />
            </motion.div>
            <h1 className="font-pixel text-2xl md:text-3xl text-foreground tracking-wider">
              MINE<span className="text-accent">CRATE</span>
            </h1>
          </div>
          <motion.p 
            className="font-minecraft text-muted-foreground max-w-md mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Open crates • Play mines • Upgrade items
            <span className="text-gold"> Win big!</span>
          </motion.p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
          {games.map((game, index) => (
            <motion.div
              key={game.path}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, type: 'spring', damping: 15 }}
            >
              <Link to={game.path}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden game-card p-5 h-full group cursor-pointer"
                  style={{
                    boxShadow: `0 0 0 0 hsl(var(${game.accentVar}) / 0)`,
                    transition: 'box-shadow 0.3s',
                  }}
                  onHoverStart={(e) => {
                    (e as any).target?.style && Object.assign((e as any).target.style, {
                      boxShadow: `0 0 20px hsl(var(${game.accentVar}) / 0.3)`,
                    });
                  }}
                  onHoverEnd={(e) => {
                    (e as any).target?.style && Object.assign((e as any).target.style, {
                      boxShadow: `0 0 0 0 hsl(var(${game.accentVar}) / 0)`,
                    });
                  }}
                >
                  {/* Subtle gradient */}
                  <div 
                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                    style={{ background: `linear-gradient(135deg, hsl(var(${game.accentVar})) 0%, transparent 70%)` }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3" 
                      style={{ imageRendering: 'pixelated' }}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      {getTexture(game.texture)}
                    </motion.div>
                    
                    <h3 
                      className="font-pixel text-sm md:text-base text-center mb-1"
                      style={{ color: `hsl(var(${game.accentVar}))` }}
                    >
                      {game.name}
                    </h3>
                    
                    <p className="font-minecraft text-muted-foreground text-center text-xs hidden md:block">
                      {game.description}
                    </p>

                    <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Play */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/cases"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent/20 border-2 border-accent text-accent font-pixel text-xs glow-diamond transition-all hover:bg-accent/30"
            >
              <Zap className="w-4 h-4" />
              OPEN CRATES
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/mines"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gold/60 text-gold font-pixel text-xs hover:bg-gold/10 transition-all"
            >
              <Bomb className="w-4 h-4" />
              PLAY MINES
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { icon: <Coins className="w-6 h-6 text-gold" />, title: 'FREE COINS', desc: 'Start with 1,000!', color: 'text-gold' },
            { icon: <div className="w-8 h-8" style={{ imageRendering: 'pixelated' }}>{getTexture('diamond-sword')}</div>, title: 'RARE ITEMS', desc: 'Win items with value', color: 'text-accent' },
            { icon: <div className="w-8 h-8" style={{ imageRendering: 'pixelated' }}>{getTexture('nether-star')}</div>, title: 'LEGENDARY', desc: 'Drops worth 1000s', color: 'text-foreground' },
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="game-card p-4 text-center group hover:border-accent/30 transition-colors"
            >
              <div className="flex justify-center mb-2">{feat.icon}</div>
              <h3 className={`font-pixel text-[10px] md:text-xs ${feat.color} mb-1`}>{feat.title}</h3>
              <p className="font-minecraft text-muted-foreground text-[10px] md:text-xs">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center font-minecraft text-muted-foreground/30 text-[10px] pb-4">
          <p>For entertainment purposes only. Not affiliated with Mojang.</p>
        </div>
      </div>
    </MainLayout>
  );
}
