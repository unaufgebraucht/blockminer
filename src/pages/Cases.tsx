import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import { getTexture } from '@/components/MinecraftTextures';
import { useGame, GameItem } from '@/context/GameContext';
import { CASE_TYPES, RARITY_COLORS, ITEM_POOL } from '@/data/items';
import { Coins, Package, Eye, Percent } from 'lucide-react';
import { toast } from 'sonner';
import { useSoundEffects } from '@/hooks/useSoundEffects';

// Calculate drop chances per case
const CASE_CHANCES: Record<string, Record<string, number>> = {
  starter: { common: 70, uncommon: 30, rare: 0, epic: 0, legendary: 0 },
  warrior: { common: 48, uncommon: 40, rare: 12, epic: 0, legendary: 0 },
  diamond: { common: 0, uncommon: 57, rare: 35, epic: 8, legendary: 0 },
  legendary: { common: 0, uncommon: 0, rare: 45, epic: 40, legendary: 15 },
};

export default function Cases() {
  const { balance, removeBalance, addItem } = useGame();
  const [selectedCase, setSelectedCase] = useState(CASE_TYPES[0]);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<GameItem | null>(null);
  const [spinItems, setSpinItems] = useState<GameItem[]>([]);
  const [spinOffset, setSpinOffset] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const animationRef = useRef<number | null>(null);
  const { playClick, playCrateOpen, playCrateSpin, playWin } = useSoundEffects();

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getItemsForCase = (caseType: typeof CASE_TYPES[0]): Omit<GameItem, 'id'>[] => {
    switch (caseType.id) {
      case 'starter':
        return ITEM_POOL.filter(i => ['common', 'uncommon'].includes(i.rarity));
      case 'warrior':
        return ITEM_POOL.filter(i => ['common', 'uncommon', 'rare'].includes(i.rarity));
      case 'diamond':
        return ITEM_POOL.filter(i => ['uncommon', 'rare', 'epic'].includes(i.rarity));
      case 'legendary':
        return ITEM_POOL.filter(i => ['rare', 'epic', 'legendary'].includes(i.rarity));
      default:
        return ITEM_POOL;
    }
  };

  const getRandomItemForCase = (caseType: typeof CASE_TYPES[0]): Omit<GameItem, 'id'> => {
    const pool = getItemsForCase(caseType);
    const chances = CASE_CHANCES[caseType.id];
    const rand = Math.random() * 100;
    
    let filteredPool: Omit<GameItem, 'id'>[];
    let cumulative = 0;
    
    for (const rarity of ['legendary', 'epic', 'rare', 'uncommon', 'common'] as const) {
      cumulative += chances[rarity];
      if (rand < cumulative) {
        filteredPool = pool.filter(i => i.rarity === rarity);
        if (filteredPool.length > 0) {
          return filteredPool[Math.floor(Math.random() * filteredPool.length)];
        }
      }
    }
    
    // Fallback
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const openCase = () => {
    if (balance < selectedCase.price) {
      toast.error("Not enough coins!");
      return;
    }

    if (!removeBalance(selectedCase.price)) {
      return;
    }

    playClick();
    playCrateOpen();
    setIsOpening(true);
    setWonItem(null);
    setSpinOffset(0);

    // FIRST: Determine the winning item
    const winningItemTemplate = getRandomItemForCase(selectedCase);
    const finalItem: GameItem = { 
      ...winningItemTemplate, 
      id: `win-${Date.now()}` 
    };

    // Generate spin items with the winning item at a specific position
    const items: GameItem[] = [];
    const winningPosition = 35; // Where the winning item will be placed
    
    for (let i = 0; i < 50; i++) {
      if (i === winningPosition) {
        // Place the actual winning item here
        items.push(finalItem);
      } else {
        // Random filler items
        const item = getRandomItemForCase(selectedCase);
        items.push({ ...item, id: `spin-${i}` });
      }
    }
    
    setSpinItems(items);

    // Animate the spinner
    const itemWidth = 120;
    const targetOffset = winningPosition * itemWidth;
    const duration = 4000;
    const startTime = Date.now();
    let lastTickTime = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for deceleration
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentOffset = targetOffset * easeOut;
      
      setSpinOffset(currentOffset);
      
      // Play tick sound periodically during spin
      if (elapsed - lastTickTime > 100 && progress < 0.9) {
        playCrateSpin();
        lastTickTime = elapsed;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete - award the SAME item that was shown
        setTimeout(() => {
          setIsOpening(false);
          setWonItem(finalItem);
          addItem(finalItem);
          playWin();
          toast.success(`You won ${finalItem.name}!`);
        }, 300);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const closeResult = () => {
    playClick();
    setWonItem(null);
    setSpinItems([]);
  };

  const caseItems = getItemsForCase(selectedCase);
  const chances = CASE_CHANCES[selectedCase.id];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="font-pixel text-2xl md:text-3xl text-foreground mb-8 flex items-center gap-3">
          <Package className="text-primary" />
          CRATES
        </h1>

        {/* Case Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {CASE_TYPES.map((caseType) => (
            <motion.button
              key={caseType.id}
              onClick={() => {
                playClick();
                setSelectedCase(caseType);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 border-4 transition-all ${
                selectedCase.id === caseType.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-3" style={{ imageRendering: 'pixelated' }}>
                {getTexture(caseType.image)}
              </div>
              <p className="font-minecraft text-foreground text-sm">{caseType.name}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Coins className="w-4 h-4 text-[hsl(var(--gold))]" />
                <span className="font-pixel text-[hsl(var(--gold))] text-xs">{caseType.price}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Opening Area */}
        <div className="bg-card border-4 border-border p-6">
          {/* Loot Preview Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 border-4 border-border bg-secondary font-minecraft text-sm hover:border-primary transition-all"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'HIDE' : 'VIEW'} LOOT
            </button>
          </div>

          {/* Loot Preview Panel */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-4 border-4 border-[hsl(var(--gold))]/50 bg-secondary/50">
                  <h3 className="font-minecraft text-foreground mb-4 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-[hsl(var(--gold))]" />
                    POSSIBLE LOOT - {selectedCase.name}
                  </h3>
                  
                  {/* Chances by rarity */}
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map(rarity => (
                      <div 
                        key={rarity} 
                        className={`p-2 text-center border-2 ${chances[rarity] > 0 ? RARITY_COLORS[rarity].border : 'border-border opacity-30'}`}
                      >
                        <p className={`font-pixel text-lg ${chances[rarity] > 0 ? RARITY_COLORS[rarity].text : 'text-muted-foreground'}`}>
                          {chances[rarity]}%
                        </p>
                        <p className="font-minecraft text-xs text-muted-foreground uppercase">{rarity}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Items grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {caseItems.map((item, idx) => (
                      <div
                        key={idx}
                        className={`aspect-square border-4 p-1 ${RARITY_COLORS[item.rarity].className} bg-secondary relative group`}
                        title={`${item.name} - ${item.value} coins`}
                      >
                        <div className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
                          {getTexture(item.texture)}
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                          <div className="bg-card border-2 border-border p-2 whitespace-nowrap">
                            <p className={`font-minecraft text-xs ${RARITY_COLORS[item.rarity].text}`}>{item.name}</p>
                            <p className="font-minecraft text-xs text-[hsl(var(--gold))]">{item.value} coins</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spinner */}
          {isOpening && spinItems.length > 0 && (
            <div className="relative h-32 overflow-hidden mb-6 border-4 border-[hsl(var(--gold))]">
              {/* Center indicator */}
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-[hsl(var(--gold))] z-10 transform -translate-x-1/2" />
              <div className="absolute top-0 left-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[hsl(var(--gold))] transform -translate-x-1/2 z-10" />
              <div className="absolute bottom-0 left-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[hsl(var(--gold))] transform -translate-x-1/2 z-10" />
              
              <div
                className="flex gap-2 absolute left-1/2"
                style={{ 
                  transform: `translateX(-${spinOffset}px)`,
                }}
              >
                {spinItems.map((item, index) => (
                  <div
                    key={index}
                    className={`w-28 h-28 flex-shrink-0 border-4 p-2 ${RARITY_COLORS[item.rarity].bg} border-white/20`}
                  >
                    <div className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
                      {getTexture(item.texture)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Won Item Display */}
          <AnimatePresence>
            {wonItem && !isOpening && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-center mb-6"
              >
                <div className={`inline-block p-8 border-4 ${RARITY_COLORS[wonItem.rarity].glow}`}
                  style={{ borderColor: wonItem.rarity === 'legendary' ? 'hsl(var(--gold))' : wonItem.rarity === 'epic' ? '#9333ea' : wonItem.rarity === 'rare' ? '#3b82f6' : 'hsl(var(--primary))' }}
                >
                  <div className="w-24 h-24 mx-auto mb-4" style={{ imageRendering: 'pixelated' }}>
                    {getTexture(wonItem.texture)}
                  </div>
                  <p className={`font-pixel text-lg ${RARITY_COLORS[wonItem.rarity].text}`}>
                    {wonItem.name}
                  </p>
                  <p className="font-minecraft text-muted-foreground mt-2">
                    Value: <span className="text-[hsl(var(--gold))]">{wonItem.value}</span> coins
                  </p>
                </div>
                <button
                  onClick={closeResult}
                  className="mt-4 px-6 py-2 bg-muted border-4 border-primary text-foreground font-minecraft hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  CONTINUE
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Open Button */}
          {!isOpening && !wonItem && (
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6" style={{ imageRendering: 'pixelated' }}>
                {getTexture(selectedCase.image)}
              </div>
              <p className="font-pixel text-xl text-foreground mb-2">{selectedCase.name}</p>
              <motion.button
                onClick={openCase}
                disabled={balance < selectedCase.price}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 border-4 font-pixel text-lg transition-all ${
                  balance >= selectedCase.price
                    ? 'bg-primary border-primary text-primary-foreground hover:shadow-[4px_4px_0px_rgba(0,0,0,0.3)]'
                    : 'bg-muted border-border text-muted-foreground cursor-not-allowed'
                }`}
              >
                OPEN FOR {selectedCase.price} <Coins className="inline-block w-5 h-5 ml-1" />
              </motion.button>
            </div>
          )}

          {isOpening && (
            <div className="text-center">
              <p className="font-pixel text-xl text-[hsl(var(--gold))] animate-pulse">OPENING...</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}