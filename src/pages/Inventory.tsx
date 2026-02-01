import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameLayout } from '@/components/GameLayout';
import { getTexture } from '@/components/MinecraftTextures';
import { useGame, GameItem } from '@/context/GameContext';
import { RARITY_COLORS } from '@/data/items';
import { Backpack, Coins, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function Inventory() {
  const { inventory, sellItem, balance } = useGame();
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);

  const filteredInventory = filter === 'all' 
    ? inventory 
    : inventory.filter(item => item.rarity === filter);

  const handleSell = (item: GameItem) => {
    sellItem(item.id);
    setSelectedItem(null);
    toast.success(`Sold ${item.name} for ${item.value} coins!`);
  };

  const sellAll = () => {
    if (inventory.length === 0) return;
    
    const total = inventory.reduce((sum, item) => sum + item.value, 0);
    inventory.forEach(item => sellItem(item.id));
    toast.success(`Sold all items for ${total} coins!`);
  };

  return (
    <GameLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="font-pixel text-2xl md:text-3xl text-white">
            <Backpack className="inline-block mr-3 text-[#4ade80]" />
            INVENTORY
          </h1>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-[#0f0f1a] border-4 border-[#ffd700]">
              <span className="font-minecraft text-gray-400 text-sm">Total Value: </span>
              <span className="font-pixel text-[#ffd700]">{totalValue}</span>
              <Coins className="inline-block w-4 h-4 ml-1 text-[#ffd700]" />
            </div>
            
            {inventory.length > 0 && (
              <motion.button
                onClick={sellAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-900 border-4 border-red-500 text-red-400 font-minecraft hover:bg-red-500 hover:text-white transition-all"
              >
                SELL ALL
              </motion.button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 border-4 font-minecraft text-sm transition-all uppercase ${
                filter === f
                  ? f === 'all' 
                    ? 'border-[#4ade80] bg-[#4ade80] text-black'
                    : `${RARITY_COLORS[f as keyof typeof RARITY_COLORS].bg} border-white/30 text-white`
                  : 'border-[#2a2a4a] text-gray-400 hover:border-white/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-[1fr,300px] gap-6">
          {/* Items Grid */}
          <div className="bg-[#0f0f1a] border-4 border-[#2a2a4a] p-4">
            {filteredInventory.length === 0 ? (
              <div className="py-16 text-center">
                <Backpack className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="font-minecraft text-gray-500">
                  {inventory.length === 0 
                    ? "Your inventory is empty.\nOpen some crates to get items!"
                    : "No items match this filter."
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                <AnimatePresence>
                  {filteredInventory.map((item) => (
                    <motion.button
                      key={item.id}
                      layoutId={item.id}
                      onClick={() => setSelectedItem(item)}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className={`aspect-square border-4 p-1 transition-all ${
                        selectedItem?.id === item.id
                          ? 'border-[#4ade80]'
                          : 'border-[#2a2a4a] hover:border-white/30'
                      } ${RARITY_COLORS[item.rarity].bg}/30`}
                    >
                      <div className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
                        {getTexture(item.texture)}
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="bg-[#0f0f1a] border-4 border-[#2a2a4a] p-4">
            <h2 className="font-minecraft text-gray-400 mb-4">ITEM DETAILS</h2>
            
            {selectedItem ? (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`w-24 h-24 mx-auto mb-4 border-4 p-2 ${RARITY_COLORS[selectedItem.rarity].glow}`}
                  style={{ borderColor: selectedItem.rarity === 'legendary' ? '#ffd700' : selectedItem.rarity === 'epic' ? '#9333ea' : '#4ade80' }}
                >
                  <div className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
                    {getTexture(selectedItem.texture)}
                  </div>
                </div>

                <div className="text-center mb-4">
                  <p className={`font-pixel text-lg ${RARITY_COLORS[selectedItem.rarity].text}`}>
                    {selectedItem.name}
                  </p>
                  <p className={`font-minecraft text-sm uppercase ${RARITY_COLORS[selectedItem.rarity].text}`}>
                    {selectedItem.rarity}
                  </p>
                </div>

                <div className="p-3 border-4 border-[#2a2a4a] bg-[#1a1a2e] mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-minecraft text-gray-400">Type</span>
                    <span className="font-minecraft text-white capitalize">{selectedItem.type}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-minecraft text-gray-400">Value</span>
                    <span className="font-minecraft text-[#ffd700] flex items-center gap-1">
                      <Coins className="w-4 h-4" /> {selectedItem.value}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <motion.button
                    onClick={() => handleSell(selectedItem)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-[#4ade80] border-4 border-[#22c55e] text-black font-minecraft hover:bg-[#22c55e] transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    SELL FOR {selectedItem.value}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <p className="font-minecraft text-gray-500 text-center py-8">
                Click an item to view details
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {['common', 'uncommon', 'rare', 'epic', 'legendary'].map((rarity) => {
            const count = inventory.filter(i => i.rarity === rarity).length;
            return (
              <div key={rarity} className="bg-[#0f0f1a] border-4 border-[#2a2a4a] p-3 text-center">
                <p className={`font-pixel text-xl ${RARITY_COLORS[rarity as keyof typeof RARITY_COLORS].text}`}>
                  {count}
                </p>
                <p className="font-minecraft text-gray-500 text-xs uppercase">{rarity}</p>
              </div>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
}
