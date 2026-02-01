import { GameItem } from '@/context/GameContext';

export const ITEM_POOL: Omit<GameItem, 'id'>[] = [
  // Common items (50% chance)
  { name: 'Wooden Sword', rarity: 'common', value: 5, texture: 'wooden-sword', type: 'sword' },
  { name: 'Stone Pickaxe', rarity: 'common', value: 8, texture: 'stone-pickaxe', type: 'pickaxe' },
  { name: 'Coal', rarity: 'common', value: 3, texture: 'coal', type: 'block' },
  { name: 'Iron Ingot', rarity: 'common', value: 10, texture: 'iron-ingot', type: 'block' },
  { name: 'Iron Helmet', rarity: 'common', value: 6, texture: 'iron-helmet', type: 'helmet' },
  
  // Uncommon items (30% chance)
  { name: 'Iron Sword', rarity: 'uncommon', value: 25, texture: 'iron-sword', type: 'sword' },
  { name: 'Iron Pickaxe', rarity: 'uncommon', value: 30, texture: 'iron-pickaxe', type: 'pickaxe' },
  { name: 'Gold Block', rarity: 'uncommon', value: 40, texture: 'gold-block', type: 'block' },
  { name: 'Lapis Lazuli', rarity: 'uncommon', value: 20, texture: 'lapis', type: 'gem' },
  
  // Rare items (12% chance)
  { name: 'Diamond', rarity: 'rare', value: 100, texture: 'diamond', type: 'gem' },
  { name: 'Diamond Sword', rarity: 'rare', value: 150, texture: 'diamond-sword', type: 'sword' },
  { name: 'Diamond Pickaxe', rarity: 'rare', value: 175, texture: 'diamond-pickaxe', type: 'pickaxe' },
  { name: 'Emerald', rarity: 'rare', value: 120, texture: 'emerald', type: 'gem' },
  
  // Epic items (6% chance)
  { name: 'Diamond Helmet', rarity: 'epic', value: 300, texture: 'diamond-helmet', type: 'helmet' },
  { name: 'Diamond Chestplate', rarity: 'epic', value: 450, texture: 'diamond-chestplate', type: 'chestplate' },
  { name: 'Enchanted Book', rarity: 'epic', value: 400, texture: 'enchanted-book', type: 'tool' },
  { name: 'Emerald Block', rarity: 'epic', value: 350, texture: 'emerald-block', type: 'block' },
  
  // Legendary items (2% chance)
  { name: 'Netherite Sword', rarity: 'legendary', value: 1000, texture: 'netherite-sword', type: 'sword' },
  { name: 'Netherite Pickaxe', rarity: 'legendary', value: 1200, texture: 'netherite-pickaxe', type: 'pickaxe' },
  { name: 'Dragon Egg', rarity: 'legendary', value: 2500, texture: 'dragon-egg', type: 'block' },
  { name: 'Nether Star', rarity: 'legendary', value: 2000, texture: 'nether-star', type: 'gem' },
];

export const RARITY_COLORS = {
  common: { 
    bg: 'bg-gray-500', 
    text: 'text-gray-300', 
    glow: '',
    border: 'border-gray-500',
    className: 'rarity-common'
  },
  uncommon: { 
    bg: 'bg-green-600', 
    text: 'text-green-400', 
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
    border: 'border-green-500',
    className: 'rarity-uncommon'
  },
  rare: { 
    bg: 'bg-blue-500', 
    text: 'text-blue-400', 
    glow: 'shadow-[0_0_25px_rgba(59,130,246,0.6)]',
    border: 'border-blue-500',
    className: 'rarity-rare'
  },
  epic: { 
    bg: 'bg-purple-500', 
    text: 'text-purple-400', 
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.7)]',
    border: 'border-purple-500',
    className: 'rarity-epic'
  },
  legendary: { 
    bg: 'bg-yellow-500', 
    text: 'text-yellow-400', 
    glow: 'shadow-[0_0_40px_rgba(234,179,8,0.8)]',
    border: 'border-yellow-500',
    className: 'rarity-legendary'
  },
};

export function getRandomItem(): Omit<GameItem, 'id'> {
  const rand = Math.random() * 100;
  let pool: Omit<GameItem, 'id'>[];
  
  if (rand < 2) {
    pool = ITEM_POOL.filter(i => i.rarity === 'legendary');
  } else if (rand < 8) {
    pool = ITEM_POOL.filter(i => i.rarity === 'epic');
  } else if (rand < 20) {
    pool = ITEM_POOL.filter(i => i.rarity === 'rare');
  } else if (rand < 50) {
    pool = ITEM_POOL.filter(i => i.rarity === 'uncommon');
  } else {
    pool = ITEM_POOL.filter(i => i.rarity === 'common');
  }
  
  return pool[Math.floor(Math.random() * pool.length)];
}

export const CASE_TYPES = [
  { id: 'starter', name: 'Starter Crate', price: 50, image: 'chest' },
  { id: 'warrior', name: 'Warrior Crate', price: 150, image: 'ender-chest' },
  { id: 'diamond', name: 'Diamond Crate', price: 500, image: 'diamond' },
  { id: 'legendary', name: 'Legendary Crate', price: 1500, image: 'nether-star' },
];

// Helper to get texture path
export function getTexturePath(texture: string): string {
  return `/textures/${texture}.png`;
}
