import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import { getTexture } from '@/components/MinecraftTextures';
import { useGame, GameItem } from '@/context/GameContext';
import { RARITY_COLORS } from '@/data/items';
import { Backpack, Coins, ShoppingCart } from 'lucide-react';
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
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="font-pixel text-2xl md:text-3xl text-foreground flex items-center gap-3">
            <Backpack className="text-primary" />
            INVENTORY
          </h1>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-card border-4 border-[hsl(var(--gold))]">
              <span className="font-minecraft text-muted-foreground text-sm">Total Value: </span>
              <span className="font-pixel text-[hsl(var(--gold))]">{totalValue}</span>
              <Coins className="inline-block w-4 h-4 ml-1 text-[hsl(var(--gold))]" />
            </div>
            
            {inventory.length > 0 && (
              <motion.button
                onClick={sellAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-destructive/20 border-4 border-destructive text-destructive font-minecraft hover:bg-destructive hover:text-destructive-foreground transition-all"
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
                    ? 'border-primary bg-primary text-primary-foreground'
                    : `${RARITY_COLORS[f as keyof typeof RARITY_COLORS].bg} border-white/30 text-foreground`
                  : 'border-border text-muted-foreground hover:border-white/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-[1fr,300px] gap-6">
          {/* Items Grid */}
          <div className="bg-card border-4 border-border p-4">
            {filteredInventory.length === 0 ? (
              <div className="py-16 text-center">
                <Backpack className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="font-minecraft text-muted-foreground">
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
                          ? 'border-primary'
                          : 'border-border hover:border-white/30'
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
          <div className="bg-card border-4 border-border p-4">
            <h2 className="font-minecraft text-muted-foreground mb-4">ITEM DETAILS</h2>
            
            {selectedItem ? (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`w-24 h-24 mx-auto mb-4 border-4 p-2 ${RARITY_COLORS[selectedItem.rarity].glow}`}
                  style={{ borderColor: selectedItem.rarity === 'legendary' ? 'hsl(var(--gold))' : selectedItem.rarity === 'epic' ? '#9333ea' : 'hsl(var(--primary))' }}
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

                <div className="p-3 border-4 border-border bg-muted mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-minecraft text-muted-foreground">Type</span>
                    <span className="font-minecraft text-foreground capitalize">{selectedItem.type}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-minecraft text-muted-foreground">Value</span>
                    <span className="font-minecraft text-[hsl(var(--gold))] flex items-center gap-1">
                      <Coins className="w-4 h-4" /> {selectedItem.value}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <motion.button
                    onClick={() => handleSell(selectedItem)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-primary border-4 border-primary text-primary-foreground font-minecraft hover:shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    SELL FOR {selectedItem.value}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <p className="font-minecraft text-muted-foreground text-center py-8">
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
              <div key={rarity} className="bg-card border-4 border-border p-3 text-center">
                <p className={`font-pixel text-xl ${RARITY_COLORS[rarity as keyof typeof RARITY_COLORS].text}`}>
                  {count}
                </p>
                <p className="font-minecraft text-muted-foreground text-xs uppercase">{rarity}</p>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
