import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface GameItem {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  value: number;
  texture: string;
  type: 'sword' | 'pickaxe' | 'helmet' | 'chestplate' | 'gem' | 'block' | 'tool';
}

interface GameState {
  balance: number;
  inventory: GameItem[];
  addBalance: (amount: number) => void;
  removeBalance: (amount: number) => boolean;
  addItem: (item: GameItem) => void;
  removeItem: (itemId: string) => void;
  sellItem: (itemId: string) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(1000);
  const [inventory, setInventory] = useState<GameItem[]>([]);

  const addBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const removeBalance = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  const addItem = (item: GameItem) => {
    setInventory(prev => [...prev, { ...item, id: `${item.id}-${Date.now()}` }]);
  };

  const removeItem = (itemId: string) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
  };

  const sellItem = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      addBalance(item.value);
      removeItem(itemId);
    }
  };

  return (
    <GameContext.Provider value={{
      balance,
      inventory,
      addBalance,
      removeBalance,
      addItem,
      removeItem,
      sellItem,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
