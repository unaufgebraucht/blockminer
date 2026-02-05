import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface GameItem {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  value: number;
  texture: string;
  type: 'sword' | 'pickaxe' | 'helmet' | 'chestplate' | 'gem' | 'block' | 'tool';
}

export interface UserProfile {
  username: string;
  balance: number;
}

interface GameState {
  balance: number;
  inventory: GameItem[];
  loading: boolean;
  profile: UserProfile | null;
  addBalance: (amount: number) => void;
  removeBalance: (amount: number) => boolean;
  addItem: (item: GameItem) => void;
  removeItem: (itemId: string) => void;
  sellItem: (itemId: string) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(1000);
  const [inventory, setInventory] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Load user data when authenticated
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Reset to defaults when logged out
      setBalance(1000);
      setInventory([]);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load profile (balance and username)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('balance, username')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setBalance(profileData.balance);
        setProfile({
          username: profileData.username,
          balance: profileData.balance,
        });
      }

      // Load inventory
      const { data: inventoryData } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id);

      if (inventoryData) {
        setInventory(inventoryData.map(item => ({
          id: item.id,
          name: item.item_name,
          rarity: item.item_rarity as GameItem['rarity'],
          value: item.item_value,
          texture: item.item_texture,
          type: item.item_type as GameItem['type'],
        })));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = async (newBalance: number) => {
    if (!user) return;

    setBalance(newBalance);
    setProfile((prev) => (prev ? { ...prev, balance: newBalance } : prev));

    const { error } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating balance:', error);
    }
  };

  const addBalance = (amount: number) => {
    updateBalance(balance + amount);
  };

  const removeBalance = (amount: number): boolean => {
    if (balance >= amount) {
      updateBalance(balance - amount);
      return true;
    }
    return false;
  };

  const addItem = async (item: GameItem) => {
    if (!user) return;

    const tempId = `temp-${crypto.randomUUID()}`;
    const optimisticItem: GameItem = { ...item, id: tempId };

    setInventory((prev) => [...prev, optimisticItem]);

    const { data, error } = await supabase
      .from('inventory')
      .insert({
        user_id: user.id,
        item_name: item.name,
        item_rarity: item.rarity,
        item_value: item.value,
        item_texture: item.texture,
        item_type: item.type,
      })
      .select('id')
      .single();

    if (error || !data?.id) {
      console.error('Error saving inventory item:', error);
      // rollback optimistic add
      setInventory((prev) => prev.filter((i) => i.id !== tempId));
      return;
    }

    // Replace temp id with real UUID from the database
    setInventory((prev) => prev.map((i) => (i.id === tempId ? { ...i, id: data.id } : i)));
  };

  const removeItem = async (itemId: string) => {
    if (!user) return;

    setInventory((prev) => prev.filter((item) => item.id !== itemId));

    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing inventory item:', error);
      // Best-effort reload to resync
      loadUserData();
    }
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
      loading,
      profile,
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
