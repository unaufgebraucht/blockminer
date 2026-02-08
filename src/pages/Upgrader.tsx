import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import { MinecraftTexture } from '@/components/MinecraftTextures';
import { useGame, GameItem } from '@/context/GameContext';
import { ITEM_POOL, RARITY_COLORS } from '@/data/items';
import { TrendingUp, Coins, RotateCcw, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const MULTIPLIERS = [1.5, 2, 3, 5, 10];

export default function Upgrader() {
  const { inventory, removeItem, addItem } = useGame();
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [targetMultiplier, setTargetMultiplier] = useState(2);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [result, setResult] = useState<{ won: boolean; item?: GameItem } | null>(null);
  const [needleAngle, setNeedleAngle] = useState(0);
  const animationRef = useRef<number | null>(null);
  const { playClick, playUpgradeStart, playUpgradeWin, playUpgradeLose } = useSoundEffects();

  const winChance = Math.min(95, Math.floor((1 / targetMultiplier) * 100 * 0.97));
  const winZoneDeg = (winChance / 100) * 360;

  const upgrade = useCallback(() => {
    if (!selectedItem) {
      toast.error("Select an item to upgrade!");
      return;
    }

    playClick();
    playUpgradeStart();
    setIsUpgrading(true);
    setResult(null);

    const won = Math.random() * 100 < winChance;
    
    const baseRotations = 4 + Math.random() * 2;
    let targetAngle: number;
    
    if (won) {
      targetAngle = Math.random() * winZoneDeg * 0.9 + winZoneDeg * 0.05;
    } else {
      const redZone = 360 - winZoneDeg;
      targetAngle = winZoneDeg + Math.random() * redZone * 0.9 + redZone * 0.05;
    }
    
    const finalRotation = (baseRotations * 360) + targetAngle;
    const duration = 5000;
    const startTime = Date.now();
    const startAngle = needleAngle % 360;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentAngle = startAngle + (finalRotation * easeOut);
      
      setNeedleAngle(currentAngle);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          removeItem(selectedItem.id);

          if (won) {
            const newValue = Math.floor(selectedItem.value * targetMultiplier);
            const possibleItems = ITEM_POOL.filter(i => i.value >= newValue * 0.8 && i.value <= newValue * 1.2);
            const winningTemplate = possibleItems.length > 0 
              ? possibleItems[Math.floor(Math.random() * possibleItems.length)]
              : ITEM_POOL.find(i => i.rarity === 'legendary') || ITEM_POOL[0];
            
            const winningItem: GameItem = {
              ...winningTemplate,
              id: `upgraded-${Date.now()}`,
              value: newValue,
            };
            
            addItem(winningItem);
            setResult({ won: true, item: winningItem });
            playUpgradeWin();
            toast.success(`Upgraded to ${winningItem.name}!`);
          } else {
            setResult({ won: false });
            playUpgradeLose();
            toast.error("Upgrade failed! Item lost.");
          }

          setIsUpgrading(false);
          setSelectedItem(null);
        }, 600);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [selectedItem, targetMultiplier, winChance, winZoneDeg, needleAngle, removeItem, addItem, playClick, playUpgradeStart, playUpgradeWin, playUpgradeLose]);

  const closeResult = () => {
    playClick();
    setResult(null);
  };

  // SVG wheel rendering
  const radius = 120;
  const cx = 140;
  const cy = 140;

  const polarToCartesian = (angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const describeArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(endAngle);
    const end = polarToCartesian(startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-pixel text-xl md:text-2xl text-foreground mb-6 flex items-center gap-3"
        >
          <ChevronUp className="text-accent w-6 h-6" />
          UPGRADER
        </motion.h1>

        <div className="grid md:grid-cols-[280px,1fr] gap-4">
          {/* Item Selection */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="game-card p-4"
          >
            <h2 className="font-minecraft text-muted-foreground mb-3 text-sm">SELECT ITEM</h2>
            
            {inventory.length === 0 ? (
              <p className="font-minecraft text-muted-foreground text-center py-8 text-sm">
                No items in inventory.<br />Open some crates first!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                {inventory.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => { playClick(); setSelectedItem(item); }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isUpgrading}
                    className={`aspect-square border-2 p-1 transition-all relative group ${
                      selectedItem?.id === item.id
                        ? 'border-accent glow-diamond ring-2 ring-accent/30'
                        : `${RARITY_COLORS[item.rarity].className} hover:brightness-125`
                    } ${isUpgrading ? 'opacity-40 pointer-events-none' : ''} bg-muted`}
                  >
                    <MinecraftTexture texture={item.texture} className="w-full h-full" />
                    {/* Hover tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 whitespace-nowrap">
                      <div className="bg-card border border-border px-2 py-1">
                        <span className="font-minecraft text-[10px] text-gold">{item.value}c</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {selectedItem && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 p-2 border-2 ${RARITY_COLORS[selectedItem.rarity].className} bg-muted`}
              >
                <p className={`font-minecraft text-sm ${RARITY_COLORS[selectedItem.rarity].text}`}>
                  {selectedItem.name}
                </p>
                <p className="font-minecraft text-gold text-xs flex items-center gap-1">
                  <Coins className="w-3 h-3" /> {selectedItem.value}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Upgrader Main */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="game-card p-5"
          >
            {/* Multiplier Selection */}
            <div className="mb-5">
              <h2 className="font-minecraft text-muted-foreground mb-2 text-sm">MULTIPLIER</h2>
              <div className="flex gap-2 flex-wrap">
                {MULTIPLIERS.map((mult) => (
                  <motion.button
                    key={mult}
                    onClick={() => { playClick(); setTargetMultiplier(mult); }}
                    disabled={isUpgrading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 border-2 font-pixel text-sm transition-all ${
                      targetMultiplier === mult
                        ? 'border-accent bg-accent/20 text-accent glow-diamond'
                        : 'border-border text-muted-foreground hover:border-accent/50 bg-muted'
                    }`}
                  >
                    {mult}x
                  </motion.button>
                ))}
              </div>
            </div>

            {/* SVG Wheel */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <svg width="280" height="280" viewBox="0 0 280 280">
                  <defs>
                    {/* Outer glow */}
                    <filter id="wheelGlow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="needleShadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
                    </filter>
                    {/* Gradients */}
                    <linearGradient id="winGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(145, 60%, 50%)" />
                      <stop offset="100%" stopColor="hsl(145, 60%, 35%)" />
                    </linearGradient>
                    <linearGradient id="loseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(0, 70%, 55%)" />
                      <stop offset="100%" stopColor="hsl(0, 70%, 40%)" />
                    </linearGradient>
                    <radialGradient id="centerGrad">
                      <stop offset="0%" stopColor="hsl(220, 15%, 18%)" />
                      <stop offset="100%" stopColor="hsl(220, 15%, 8%)" />
                    </radialGradient>
                  </defs>

                  {/* Outer ring */}
                  <circle cx={cx} cy={cy} r={radius + 10} fill="none" stroke="hsl(220, 15%, 15%)" strokeWidth="6" />
                  <circle cx={cx} cy={cy} r={radius + 7} fill="none" stroke="hsl(220, 15%, 25%)" strokeWidth="1" />

                  {/* Win zone */}
                  <path d={describeArc(0, winZoneDeg)} fill="url(#winGrad)" stroke="hsl(145, 60%, 30%)" strokeWidth="1" />
                  
                  {/* Lose zone */}
                  <path d={describeArc(winZoneDeg, 360)} fill="url(#loseGrad)" stroke="hsl(0, 70%, 30%)" strokeWidth="1" />

                  {/* Tick marks around edge */}
                  {Array.from({ length: 36 }).map((_, i) => {
                    const angle = (i * 10 - 90) * Math.PI / 180;
                    const r1 = radius - 2;
                    const r2 = radius + 2;
                    return (
                      <line
                        key={i}
                        x1={cx + r1 * Math.cos(angle)}
                        y1={cy + r1 * Math.sin(angle)}
                        x2={cx + r2 * Math.cos(angle)}
                        y2={cy + r2 * Math.sin(angle)}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Zone labels */}
                  <text
                    x={cx + 50 * Math.cos(((winZoneDeg / 2) - 90) * Math.PI / 180)}
                    y={cy + 50 * Math.sin(((winZoneDeg / 2) - 90) * Math.PI / 180)}
                    fill="white"
                    fontSize="14"
                    fontFamily="'Press Start 2P'"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }}
                  >
                    WIN
                  </text>
                  <text
                    x={cx + 50 * Math.cos((((winZoneDeg + 360) / 2) - 90) * Math.PI / 180)}
                    y={cy + 50 * Math.sin((((winZoneDeg + 360) / 2) - 90) * Math.PI / 180)}
                    fill="white"
                    fontSize="14"
                    fontFamily="'Press Start 2P'"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }}
                  >
                    LOSE
                  </text>

                  {/* Spinning Needle */}
                  <g transform={`rotate(${needleAngle}, ${cx}, ${cy})`} filter="url(#needleShadow)">
                    <line
                      x1={cx} y1={cy}
                      x2={cx} y2={cy - radius + 10}
                      stroke="hsl(45, 100%, 50%)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Needle tip */}
                    <polygon
                      points={`${cx},${cy - radius + 4} ${cx - 6},${cy - radius + 18} ${cx + 6},${cy - radius + 18}`}
                      fill="hsl(45, 100%, 50%)"
                    />
                    {/* Needle base dot */}
                    <circle cx={cx} cy={cy} r="6" fill="hsl(45, 100%, 50%)" />
                  </g>

                  {/* Center circle */}
                  <circle cx={cx} cy={cy} r="28" fill="url(#centerGrad)" stroke="hsl(220, 15%, 25%)" strokeWidth="3" />
                  <text
                    x={cx}
                    y={cy}
                    fill="hsl(45, 100%, 50%)"
                    fontSize="14"
                    fontFamily="'Press Start 2P'"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {targetMultiplier}x
                  </text>
                </svg>

                {/* Spinning glow effect */}
                {isUpgrading && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ 
                      boxShadow: [
                        '0 0 20px hsl(175, 70%, 50%, 0.3)',
                        '0 0 40px hsl(175, 70%, 50%, 0.6)',
                        '0 0 20px hsl(175, 70%, 50%, 0.3)',
                      ]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
            </div>

            {/* Win Chance Bar */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-1">
                <span className="font-minecraft text-muted-foreground text-xs">Win Chance</span>
                <span className="font-pixel text-sm text-emerald">{winChance}%</span>
              </div>
              <div className="h-3 bg-muted border border-border overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald to-emerald/70"
                  initial={false}
                  animate={{ width: `${winChance}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </div>
            </div>

            {/* Items Display */}
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className={`w-16 h-16 md:w-20 md:h-20 border-2 p-1.5 transition-all ${
                selectedItem ? `${RARITY_COLORS[selectedItem.rarity].className} ${RARITY_COLORS[selectedItem.rarity].glow}` : 'border-border'
              } bg-muted`}>
                {selectedItem ? (
                  <MinecraftTexture texture={selectedItem.texture} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground font-minecraft text-[10px] text-center">
                    SELECT
                  </div>
                )}
              </div>

              <motion.div
                animate={{ rotate: isUpgrading ? 360 : 0 }}
                transition={{ duration: 0.8, repeat: isUpgrading ? Infinity : 0, ease: "linear" }}
                className="text-accent"
              >
                <RotateCcw className="w-6 h-6" />
              </motion.div>

              <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-gold p-1.5 bg-muted glow-gold">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-pixel text-lg text-gold">?</span>
                </div>
              </div>
            </div>

            {/* Potential Win */}
            {selectedItem && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-center mb-4 p-3 border-2 border-border bg-muted"
              >
                <p className="font-minecraft text-muted-foreground text-xs">POTENTIAL VALUE</p>
                <p className="font-pixel text-xl text-gold">
                  {Math.floor(selectedItem.value * targetMultiplier)} <span className="text-sm">coins</span>
                </p>
              </motion.div>
            )}

            {/* Upgrade Button */}
            <motion.button
              onClick={upgrade}
              disabled={!selectedItem || isUpgrading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 border-2 font-pixel text-base transition-all ${
                selectedItem && !isUpgrading
                  ? 'bg-accent/20 border-accent text-accent hover:bg-accent/30 glow-diamond'
                  : 'bg-muted border-border text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isUpgrading ? (
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  UPGRADING...
                </motion.span>
              ) : 'UPGRADE'}
            </motion.button>

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="mt-5 text-center"
                >
                  {result.won && result.item ? (
                    <div className={`p-5 border-2 ${RARITY_COLORS[result.item.rarity].className} ${RARITY_COLORS[result.item.rarity].glow}`}>
                      <motion.p 
                        className="font-pixel text-lg text-emerald mb-3"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, repeat: 2 }}
                      >
                        UPGRADE SUCCESS!
                      </motion.p>
                      <motion.div 
                        className="w-16 h-16 mx-auto mb-2"
                        initial={{ rotateY: 180 }}
                        animate={{ rotateY: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <MinecraftTexture texture={result.item.texture} className="w-full h-full" />
                      </motion.div>
                      <p className={`font-minecraft ${RARITY_COLORS[result.item.rarity].text}`}>
                        {result.item.name}
                      </p>
                      <p className="font-minecraft text-gold text-sm">
                        Value: {result.item.value} coins
                      </p>
                    </div>
                  ) : (
                    <motion.div 
                      className="p-5 border-2 border-destructive bg-destructive/10"
                      animate={{ x: [0, -8, 8, -4, 4, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="font-pixel text-lg text-destructive">UPGRADE FAILED!</p>
                      <p className="font-minecraft text-muted-foreground mt-1 text-sm">Your item was lost.</p>
                    </motion.div>
                  )}
                  <button
                    onClick={closeResult}
                    className="mt-3 mc-btn px-5 py-2 font-minecraft text-sm border-2 border-border hover:border-accent transition-all"
                  >
                    CONTINUE
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
