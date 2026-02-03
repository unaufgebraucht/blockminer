import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import { MinecraftTexture } from '@/components/MinecraftTextures';
import { useGame, GameItem } from '@/context/GameContext';
import { ITEM_POOL, RARITY_COLORS } from '@/data/items';
import { TrendingUp, Coins, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const MULTIPLIERS = [1.5, 2, 3, 5, 10];

export default function Upgrader() {
  const { inventory, removeItem, addItem } = useGame();
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [targetMultiplier, setTargetMultiplier] = useState(2);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [result, setResult] = useState<{ won: boolean; item?: GameItem } | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const animationRef = useRef<number | null>(null);
  const { playClick, playUpgradeStart, playUpgradeWin, playUpgradeLose } = useSoundEffects();

  const winChance = Math.min(95, Math.floor((1 / targetMultiplier) * 100 * 0.97));

  const upgrade = useCallback(() => {
    if (!selectedItem) {
      toast.error("Select an item to upgrade!");
      return;
    }

    playClick();
    playUpgradeStart();
    setIsUpgrading(true);
    setResult(null);

    // Determine outcome first
    const won = Math.random() * 100 < winChance;
    
    // Calculate target rotation
    // Green zone: 0 to winChance% of the wheel
    // Red zone: winChance% to 100% of the wheel
    const baseRotations = 5; // Number of full rotations before stopping
    let targetAngle: number;
    
    if (won) {
      // Land in green zone (0 to winChance degrees, mapped to 0-360)
      const greenZoneDegrees = (winChance / 100) * 360;
      targetAngle = Math.random() * greenZoneDegrees;
    } else {
      // Land in red zone (winChance to 100 degrees, mapped to 0-360)
      const greenZoneDegrees = (winChance / 100) * 360;
      targetAngle = greenZoneDegrees + Math.random() * (360 - greenZoneDegrees);
    }
    
    const finalRotation = (baseRotations * 360) + targetAngle;
    const duration = 4000;
    const startTime = Date.now();
    const startRotation = wheelRotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic ease-out for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (finalRotation * easeOut);
      
      setWheelRotation(currentRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete - show result
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
        }, 500);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [selectedItem, targetMultiplier, winChance, wheelRotation, removeItem, addItem, playClick, playUpgradeStart, playUpgradeWin, playUpgradeLose]);

  const closeResult = () => {
    playClick();
    setResult(null);
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
                    onClick={() => {
                      playClick();
                      setSelectedItem(item);
                    }}
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
                    onClick={() => {
                      playClick();
                      setTargetMultiplier(mult);
                    }}
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

            {/* Circular Wheel */}
            <div className="flex justify-center mb-6">
              <div className="relative w-64 h-64">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                  <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-[hsl(var(--gold))]" />
                </div>

                {/* Wheel */}
                <motion.div
                  className="relative w-full h-full rounded-full border-8 border-border overflow-hidden"
                  style={{
                    background: `conic-gradient(
                      hsl(var(--emerald)) 0deg ${(winChance / 100) * 360}deg,
                      hsl(var(--destructive)) ${(winChance / 100) * 360}deg 360deg
                    )`,
                    transform: `rotate(${-wheelRotation}deg)`,
                  }}
                >
                  {/* Win/Lose labels */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${(winChance / 100) * 180}deg)` }}
                  >
                    <span className="font-pixel text-white text-xl drop-shadow-lg" style={{ transform: 'translateX(-40px)' }}>
                      WIN
                    </span>
                  </div>
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${(winChance / 100) * 360 + ((100 - winChance) / 100) * 180}deg)` }}
                  >
                    <span className="font-pixel text-white text-xl drop-shadow-lg" style={{ transform: 'translateX(-40px)' }}>
                      LOSE
                    </span>
                  </div>
                </motion.div>

                {/* Center circle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-card border-4 border-border flex items-center justify-center">
                    <span className="font-pixel text-lg text-[hsl(var(--gold))]">{targetMultiplier}x</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chance Display */}
            <div className="text-center mb-4">
              <span className="font-minecraft text-muted-foreground">Win Chance: </span>
              <span className="font-pixel text-lg text-[hsl(var(--emerald))]">{winChance}%</span>
            </div>

            {/* Items Display */}
            <div className="flex items-center justify-center gap-6 mb-6">
              {/* Input Item */}
              <div className={`w-20 h-20 md:w-24 md:h-24 border-4 p-2 ${
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

              {/* Arrow */}
              <motion.div
                animate={{ rotate: isUpgrading ? 360 : 0 }}
                transition={{ duration: 1, repeat: isUpgrading ? Infinity : 0, ease: "linear" }}
                className="text-primary"
              >
                <RotateCcw className="w-8 h-8" />
              </motion.div>

              {/* Output Item */}
              <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-[hsl(var(--gold))] p-2 bg-secondary glow-gold">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-pixel text-lg text-[hsl(var(--gold))]">?</span>
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
