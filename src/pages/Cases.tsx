import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import { getTexture } from '@/components/MinecraftTextures';
import { useGame, GameItem } from '@/context/GameContext';
import { CASE_TYPES, getRandomItem, RARITY_COLORS } from '@/data/items';
import { Coins, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function Cases() {
  const { balance, removeBalance, addItem } = useGame();
  const [selectedCase, setSelectedCase] = useState(CASE_TYPES[0]);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<GameItem | null>(null);
  const [spinItems, setSpinItems] = useState<GameItem[]>([]);

  const openCase = () => {
    if (balance < selectedCase.price) {
      toast.error("Not enough coins!");
      return;
    }

    if (!removeBalance(selectedCase.price)) {
      return;
    }

    setIsOpening(true);
    setWonItem(null);

    // Generate spin items
    const items: GameItem[] = [];
    for (let i = 0; i < 30; i++) {
      const item = getRandomItem();
      items.push({ ...item, id: `spin-${i}` });
    }
    
    // The winning item is placed at position 25
    const winningItem = getRandomItem();
    const finalItem: GameItem = { ...winningItem, id: `win-${Date.now()}` };
    items[25] = finalItem;
    
    setSpinItems(items);

    // After animation, show result
    setTimeout(() => {
      setIsOpening(false);
      setWonItem(finalItem);
      addItem(finalItem);
      toast.success(`You won ${finalItem.name}!`);
    }, 4000);
  };

  const closeResult = () => {
    setWonItem(null);
    setSpinItems([]);
  };

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
              onClick={() => setSelectedCase(caseType)}
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
          {/* Spinner */}
          {isOpening && spinItems.length > 0 && (
            <div className="relative h-32 overflow-hidden mb-6 border-4 border-[hsl(var(--gold))]">
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-[hsl(var(--gold))] z-10 transform -translate-x-1/2" />
              <div className="absolute top-0 left-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[hsl(var(--gold))] transform -translate-x-1/2 z-10" />
              <div className="absolute bottom-0 left-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[hsl(var(--gold))] transform -translate-x-1/2 z-10" />
              
              <motion.div
                className="flex gap-2 absolute"
                initial={{ x: 0 }}
                animate={{ x: -2600 }}
                transition={{ duration: 4, ease: [0.1, 0.8, 0.2, 1] }}
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
              </motion.div>
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
