import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameLayout } from '@/components/GameLayout';
import { getTexture } from '@/components/MinecraftTextures';
import { useGame, GameItem } from '@/context/GameContext';
import { ITEM_POOL, RARITY_COLORS } from '@/data/items';
import { TrendingUp, Coins, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const MULTIPLIERS = [1.5, 2, 3, 5, 10];

export default function Upgrader() {
  const { inventory, removeItem, addItem } = useGame();
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [targetMultiplier, setTargetMultiplier] = useState(2);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [result, setResult] = useState<{ won: boolean; item?: GameItem } | null>(null);
  const [spinAngle, setSpinAngle] = useState(0);

  const winChance = Math.min(95, Math.floor((1 / targetMultiplier) * 100 * 0.97)); // 3% house edge

  const upgrade = () => {
    if (!selectedItem) {
      toast.error("Select an item to upgrade!");
      return;
    }

    setIsUpgrading(true);
    setResult(null);

    // Spin animation
    const targetAngle = 360 * 5 + Math.random() * 360;
    setSpinAngle(targetAngle);

    setTimeout(() => {
      const won = Math.random() * 100 < winChance;
      
      // Remove the original item
      removeItem(selectedItem.id);

      if (won) {
        // Find an item with higher value
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
    }, 3000);
  };

  const closeResult = () => {
    setResult(null);
    setSpinAngle(0);
  };

  return (
    <GameLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="font-pixel text-2xl md:text-3xl text-white mb-8">
          <TrendingUp className="inline-block mr-3 text-[#4ade80]" />
          UPGRADER
        </h1>

        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          {/* Item Selection */}
          <div className="bg-[#0f0f1a] border-4 border-[#2a2a4a] p-4">
            <h2 className="font-minecraft text-gray-400 mb-4">SELECT ITEM TO UPGRADE</h2>
            
            {inventory.length === 0 ? (
              <p className="font-minecraft text-gray-500 text-center py-8">
                No items in inventory.<br />Open some crates first!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
                {inventory.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    whileHover={{ scale: 1.05 }}
                    disabled={isUpgrading}
                    className={`aspect-square border-4 p-1 transition-all ${
                      selectedItem?.id === item.id
                        ? 'border-[#4ade80] bg-[#4ade80]/20'
                        : 'border-[#2a2a4a] bg-[#1a1a2e] hover:border-[#4ade80]/50'
                    } ${isUpgrading ? 'opacity-50' : ''}`}
                  >
                    <div className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
                      {getTexture(item.texture)}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {selectedItem && (
              <div className="mt-4 p-3 border-4 border-[#2a2a4a] bg-[#1a1a2e]">
                <p className={`font-minecraft ${RARITY_COLORS[selectedItem.rarity].text}`}>
                  {selectedItem.name}
                </p>
                <p className="font-minecraft text-[#ffd700] text-sm flex items-center gap-1">
                  <Coins className="w-4 h-4" /> {selectedItem.value}
                </p>
              </div>
            )}
          </div>

          {/* Upgrader */}
          <div className="bg-[#0f0f1a] border-4 border-[#2a2a4a] p-6">
            {/* Multiplier Selection */}
            <div className="mb-6">
              <h2 className="font-minecraft text-gray-400 mb-3">TARGET MULTIPLIER</h2>
              <div className="flex gap-2 flex-wrap">
                {MULTIPLIERS.map((mult) => (
                  <button
                    key={mult}
                    onClick={() => setTargetMultiplier(mult)}
                    disabled={isUpgrading}
                    className={`px-4 py-2 border-4 font-pixel transition-all ${
                      targetMultiplier === mult
                        ? 'border-[#4ade80] bg-[#4ade80] text-black'
                        : 'border-[#2a2a4a] text-gray-400 hover:border-[#4ade80]/50'
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>

            {/* Upgrade Visualization */}
            <div className="relative mb-6">
              <div className="flex items-center justify-center gap-4 md:gap-8">
                {/* Input Item */}
                <div className={`w-24 h-24 md:w-32 md:h-32 border-4 p-2 ${
                  selectedItem ? 'border-[#4ade80]' : 'border-[#2a2a4a]'
                } bg-[#1a1a2e]`}>
                  {selectedItem ? (
                    <div className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
                      {getTexture(selectedItem.texture)}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-minecraft text-xs text-center">
                      SELECT<br />ITEM
                    </div>
                  )}
                </div>

                {/* Arrow / Spinner */}
                <div className="relative">
                  <motion.div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#ffd700] flex items-center justify-center bg-[#1a1a2e]"
                    style={{ rotate: spinAngle }}
                    animate={{ rotate: isUpgrading ? spinAngle : 0 }}
                    transition={{ duration: 3, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-[#ffd700]" />
                    <span className="font-pixel text-[#4ade80] text-lg">{winChance}%</span>
                  </motion.div>
                </div>

                {/* Output Item */}
                <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-[#ffd700] p-2 bg-[#1a1a2e]">
                  {selectedItem ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-pixel text-[#ffd700] text-lg">{targetMultiplier}x</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-minecraft text-xs text-center">
                      ?
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Potential Win */}
            {selectedItem && (
              <div className="text-center mb-6 p-4 border-4 border-[#2a2a4a] bg-[#1a1a2e]">
                <p className="font-minecraft text-gray-400">POTENTIAL VALUE</p>
                <p className="font-pixel text-2xl text-[#ffd700]">
                  {Math.floor(selectedItem.value * targetMultiplier)} coins
                </p>
                <p className="font-minecraft text-gray-500 text-sm">
                  Win Chance: <span className="text-[#4ade80]">{winChance}%</span>
                </p>
              </div>
            )}

            {/* Upgrade Button */}
            <motion.button
              onClick={upgrade}
              disabled={!selectedItem || isUpgrading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 border-4 font-pixel text-lg transition-all ${
                selectedItem && !isUpgrading
                  ? 'bg-[#4ade80] border-[#22c55e] text-black hover:bg-[#22c55e]'
                  : 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
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
                    <div className={`p-6 border-4 ${RARITY_COLORS[result.item.rarity].glow}`}
                      style={{ borderColor: '#4ade80' }}
                    >
                      <p className="font-pixel text-xl text-[#4ade80] mb-4">UPGRADE SUCCESS!</p>
                      <div className="w-20 h-20 mx-auto mb-3" style={{ imageRendering: 'pixelated' }}>
                        {getTexture(result.item.texture)}
                      </div>
                      <p className={`font-minecraft ${RARITY_COLORS[result.item.rarity].text}`}>
                        {result.item.name}
                      </p>
                      <p className="font-minecraft text-[#ffd700]">
                        Value: {result.item.value} coins
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 border-4 border-red-500 bg-red-900/20">
                      <p className="font-pixel text-xl text-red-500">UPGRADE FAILED!</p>
                      <p className="font-minecraft text-gray-400 mt-2">Your item was lost.</p>
                    </div>
                  )}
                  <button
                    onClick={closeResult}
                    className="mt-4 px-6 py-2 bg-[#2a2a4a] border-4 border-[#4ade80] text-white font-minecraft hover:bg-[#4ade80] hover:text-black transition-all"
                  >
                    CONTINUE
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
