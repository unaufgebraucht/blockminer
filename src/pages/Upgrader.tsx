import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import { MinecraftTexture } from '@/components/MinecraftTextures';
import { useGame, GameItem } from '@/context/GameContext';
import { ITEM_POOL, RARITY_COLORS } from '@/data/items';
import { TrendingUp, Coins, Check, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const MULTIPLIERS = [1.5, 2, 3, 5, 10];

export default function Upgrader() {
  const { inventory, removeItem, addItem } = useGame();
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [targetMultiplier, setTargetMultiplier] = useState(2);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [result, setResult] = useState<{ won: boolean; item?: GameItem } | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [indicatorPosition, setIndicatorPosition] = useState(50);

  const winChance = Math.min(95, Math.floor((1 / targetMultiplier) * 100 * 0.97));

  const upgrade = () => {
    if (!selectedItem) {
      toast.error("Select an item to upgrade!");
      return;
    }

    setIsUpgrading(true);
    setResult(null);

    // Determine outcome first
    const won = Math.random() * 100 < winChance;
    
    // Animate the indicator
    const targetPosition = won 
      ? Math.random() * winChance // Land in green zone
      : winChance + Math.random() * (100 - winChance); // Land in red zone

    // Animate with multiple passes
    let currentPos = indicatorPosition;
    const duration = 3000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Add some extra rotations at the start
      const extraRotation = progress < 0.5 ? Math.sin(progress * Math.PI * 6) * 20 : 0;
      const newPos = currentPos + (targetPosition - currentPos + 200) * easeOut + extraRotation;
      
      setIndicatorPosition(newPos % 100);
      setWheelRotation(prev => prev + (1 - progress) * 10);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIndicatorPosition(targetPosition);
        
        // Show result
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
            toast.success(`Upgraded to ${winningItem.name}!`);
          } else {
            setResult({ won: false });
            toast.error("Upgrade failed! Item lost.");
          }

          setIsUpgrading(false);
          setSelectedItem(null);
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  };

  const closeResult = () => {
    setResult(null);
    setIndicatorPosition(50);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-pixel text-2xl md:text-3xl text-foreground mb-8 flex items-center gap-3"
        >
          <TrendingUp className="text-primary" />
          UPGRADER
        </motion.h1>

        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          {/* Item Selection */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="game-card p-4"
          >
            <h2 className="font-minecraft text-muted-foreground mb-4">SELECT ITEM TO UPGRADE</h2>
            
            {inventory.length === 0 ? (
              <p className="font-minecraft text-muted-foreground text-center py-8">
                No items in inventory.<br />Open some crates first!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2">
                {inventory.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    whileHover={{ scale: 1.05 }}
                    disabled={isUpgrading}
                    className={`aspect-square border-4 p-1 transition-all ${
                      selectedItem?.id === item.id
                        ? 'border-primary glow-purple'
                        : `${RARITY_COLORS[item.rarity].className} hover:border-primary/50`
                    } ${isUpgrading ? 'opacity-50' : ''} bg-secondary`}
                  >
                    <MinecraftTexture texture={item.texture} className="w-full h-full" />
                  </motion.button>
                ))}
              </div>
            )}

            {selectedItem && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 border-4 ${RARITY_COLORS[selectedItem.rarity].className} bg-secondary`}
              >
                <p className={`font-minecraft ${RARITY_COLORS[selectedItem.rarity].text}`}>
                  {selectedItem.name}
                </p>
                <p className="font-minecraft text-[hsl(var(--gold))] text-sm flex items-center gap-1">
                  <Coins className="w-4 h-4" /> {selectedItem.value}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Upgrader */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="game-card p-6"
          >
            {/* Multiplier Selection */}
            <div className="mb-6">
              <h2 className="font-minecraft text-muted-foreground mb-3">TARGET MULTIPLIER</h2>
              <div className="flex gap-2 flex-wrap">
                {MULTIPLIERS.map((mult) => (
                  <button
                    key={mult}
                    onClick={() => setTargetMultiplier(mult)}
                    disabled={isUpgrading}
                    className={`px-4 py-2 border-4 font-pixel transition-all ${
                      targetMultiplier === mult
                        ? 'border-primary bg-primary text-primary-foreground glow-purple'
                        : 'border-border text-muted-foreground hover:border-primary/50 bg-secondary'
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Upgrade Bar */}
            <div className="mb-6">
              <div className="relative h-20 bg-secondary border-4 border-border overflow-hidden">
                {/* Win Zone (Green) */}
                <div 
                  className="absolute top-0 left-0 h-full bg-green-600/30 border-r-4 border-green-500"
                  style={{ width: `${winChance}%` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                
                {/* Lose Zone (Red) */}
                <div 
                  className="absolute top-0 right-0 h-full bg-red-600/30"
                  style={{ width: `${100 - winChance}%` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                </div>

                {/* Indicator */}
                <motion.div
                  className="absolute top-0 w-1 h-full bg-white z-10"
                  style={{ left: `${indicatorPosition}%` }}
                  animate={isUpgrading ? { 
                    boxShadow: ['0 0 10px white', '0 0 30px white', '0 0 10px white']
                  } : {}}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white" />
                </motion.div>

                {/* Percentage labels */}
                <div className="absolute bottom-1 left-2 font-pixel text-xs text-green-400">{winChance}%</div>
                <div className="absolute bottom-1 right-2 font-pixel text-xs text-red-400">{100 - winChance}%</div>
              </div>
            </div>

            {/* Items Display */}
            <div className="flex items-center justify-center gap-6 mb-6">
              {/* Input Item */}
              <div className={`w-24 h-24 md:w-28 md:h-28 border-4 p-2 ${
                selectedItem ? RARITY_COLORS[selectedItem.rarity].className : 'border-border'
              } bg-secondary`}>
                {selectedItem ? (
                  <MinecraftTexture texture={selectedItem.texture} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground font-minecraft text-xs text-center">
                    SELECT<br />ITEM
                  </div>
                )}
              </div>

              {/* Arrow with rotation */}
              <motion.div
                animate={{ rotate: isUpgrading ? wheelRotation : 0 }}
                className="text-primary"
              >
                <RotateCcw className={`w-10 h-10 ${isUpgrading ? 'spin-upgrader' : ''}`} />
              </motion.div>

              {/* Output Item */}
              <div className="w-24 h-24 md:w-28 md:h-28 border-4 border-[hsl(var(--gold))] p-2 bg-secondary glow-gold">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-pixel text-xl text-[hsl(var(--gold))]">{targetMultiplier}x</span>
                </div>
              </div>
            </div>

            {/* Potential Win */}
            {selectedItem && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-6 p-4 border-4 border-border bg-secondary"
              >
                <p className="font-minecraft text-muted-foreground">POTENTIAL VALUE</p>
                <p className="font-pixel text-2xl text-[hsl(var(--gold))]">
                  {Math.floor(selectedItem.value * targetMultiplier)} coins
                </p>
              </motion.div>
            )}

            {/* Upgrade Button */}
            <motion.button
              onClick={upgrade}
              disabled={!selectedItem || isUpgrading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 border-4 font-pixel text-lg transition-all ${
                selectedItem && !isUpgrading
                  ? 'mc-btn mc-btn-primary'
                  : 'bg-muted border-border text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isUpgrading ? 'UPGRADING...' : 'UPGRADE'}
            </motion.button>

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-6 text-center"
                >
                  {result.won && result.item ? (
                    <div className={`p-6 border-4 ${RARITY_COLORS[result.item.rarity].className} ${RARITY_COLORS[result.item.rarity].glow} pulse-win`}>
                      <p className="font-pixel text-xl text-[hsl(var(--emerald))] mb-4">UPGRADE SUCCESS!</p>
                      <div className="w-20 h-20 mx-auto mb-3">
                        <MinecraftTexture texture={result.item.texture} className="w-full h-full" />
                      </div>
                      <p className={`font-minecraft ${RARITY_COLORS[result.item.rarity].text}`}>
                        {result.item.name}
                      </p>
                      <p className="font-minecraft text-[hsl(var(--gold))]">
                        Value: {result.item.value} coins
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 border-4 border-destructive bg-destructive/20 shake-lose glow-red">
                      <p className="font-pixel text-xl text-destructive">UPGRADE FAILED!</p>
                      <p className="font-minecraft text-muted-foreground mt-2">Your item was lost.</p>
                    </div>
                  )}
                  <button
                    onClick={closeResult}
                    className="mt-4 mc-btn px-6 py-2 font-minecraft"
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
