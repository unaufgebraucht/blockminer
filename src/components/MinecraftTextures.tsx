import { getTexturePath } from '@/data/items';
import { useState } from 'react';

interface TextureProps {
  texture: string;
  size?: number;
  className?: string;
}

// Map of textures that are GIFs instead of PNGs
const GIF_TEXTURES = ['nether-star', 'enchanted-book'];

// SVG fallback icons for missing textures
const FallbackIcons: Record<string, JSX.Element> = {
  diamond: (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <polygon points="8,1 15,6 8,15 1,6" fill="#5DECFF" />
      <polygon points="8,1 8,15 1,6" fill="#4AC8E0" />
      <polygon points="8,1 8,15 15,6" fill="#7DF3FF" />
    </svg>
  ),
  emerald: (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <polygon points="8,1 14,4 14,12 8,15 2,12 2,4" fill="#50C878" />
      <polygon points="8,1 8,15 2,12 2,4" fill="#3AAD5C" />
      <polygon points="8,1 8,15 14,12 14,4" fill="#6AE88B" />
    </svg>
  ),
  tnt: (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="0" y="0" width="16" height="16" fill="#FF4444" />
      <rect x="2" y="4" width="12" height="8" fill="#FFFFFF" />
      <text x="8" y="10" textAnchor="middle" fontSize="5" fill="#FF0000" fontWeight="bold">TNT</text>
    </svg>
  ),
  chest: (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="1" y="3" width="14" height="10" fill="#8B4513" rx="1" />
      <rect x="1" y="3" width="14" height="4" fill="#A0522D" />
      <rect x="6" y="6" width="4" height="3" fill="#DAA520" />
      <rect x="7" y="7" width="2" height="1" fill="#B8860B" />
    </svg>
  ),
  'nether-star': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" fill="#FFFF88" />
      <polygon points="8,2 9,6 13,6 10,9 11,13 8,10 5,13 6,9 3,6 7,6" fill="#FFFFFF" />
    </svg>
  ),
  coal: (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="2" y="2" width="12" height="12" fill="#333333" rx="2" />
      <rect x="4" y="4" width="3" height="3" fill="#1a1a1a" />
      <rect x="9" y="8" width="3" height="3" fill="#1a1a1a" />
      <rect x="5" y="10" width="2" height="2" fill="#444444" />
    </svg>
  ),
  'dragon-egg': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <ellipse cx="8" cy="9" rx="6" ry="7" fill="#1A0A2E" />
      <ellipse cx="6" cy="6" rx="1" ry="1.5" fill="#4B0082" />
      <ellipse cx="10" cy="8" rx="1.5" ry="1" fill="#4B0082" />
      <ellipse cx="7" cy="11" rx="1" ry="1" fill="#4B0082" />
    </svg>
  ),
  stone: (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="0" y="0" width="16" height="16" fill="#8B8B8B" />
      <rect x="2" y="2" width="4" height="4" fill="#7A7A7A" />
      <rect x="10" y="6" width="4" height="4" fill="#7A7A7A" />
      <rect x="4" y="10" width="4" height="4" fill="#9A9A9A" />
    </svg>
  ),
  'wooden-sword': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="12" y="2" width="2" height="10" fill="#8B4513" transform="rotate(45 13 7)" />
      <rect x="4" y="10" width="4" height="2" fill="#654321" transform="rotate(45 6 11)" />
    </svg>
  ),
  'iron-sword': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="12" y="2" width="2" height="10" fill="#C0C0C0" transform="rotate(45 13 7)" />
      <rect x="4" y="10" width="4" height="2" fill="#8B4513" transform="rotate(45 6 11)" />
    </svg>
  ),
  'diamond-sword': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="12" y="2" width="2" height="10" fill="#5DECFF" transform="rotate(45 13 7)" />
      <rect x="4" y="10" width="4" height="2" fill="#8B4513" transform="rotate(45 6 11)" />
    </svg>
  ),
  'netherite-sword': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="12" y="2" width="2" height="10" fill="#4A3B3B" transform="rotate(45 13 7)" />
      <rect x="4" y="10" width="4" height="2" fill="#654321" transform="rotate(45 6 11)" />
    </svg>
  ),
  'stone-pickaxe': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="7" y="6" width="2" height="8" fill="#8B4513" />
      <rect x="4" y="2" width="8" height="3" fill="#8B8B8B" />
      <rect x="4" y="5" width="2" height="2" fill="#8B8B8B" />
      <rect x="10" y="5" width="2" height="2" fill="#8B8B8B" />
    </svg>
  ),
  'iron-pickaxe': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="7" y="6" width="2" height="8" fill="#8B4513" />
      <rect x="4" y="2" width="8" height="3" fill="#C0C0C0" />
      <rect x="4" y="5" width="2" height="2" fill="#C0C0C0" />
      <rect x="10" y="5" width="2" height="2" fill="#C0C0C0" />
    </svg>
  ),
  'diamond-pickaxe': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="7" y="6" width="2" height="8" fill="#8B4513" />
      <rect x="4" y="2" width="8" height="3" fill="#5DECFF" />
      <rect x="4" y="5" width="2" height="2" fill="#5DECFF" />
      <rect x="10" y="5" width="2" height="2" fill="#5DECFF" />
    </svg>
  ),
  'netherite-pickaxe': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="7" y="6" width="2" height="8" fill="#654321" />
      <rect x="4" y="2" width="8" height="3" fill="#4A3B3B" />
      <rect x="4" y="5" width="2" height="2" fill="#4A3B3B" />
      <rect x="10" y="5" width="2" height="2" fill="#4A3B3B" />
    </svg>
  ),
  'iron-ingot': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="2" y="6" width="12" height="6" fill="#C0C0C0" rx="1" />
      <rect x="3" y="7" width="10" height="2" fill="#D8D8D8" />
    </svg>
  ),
  'iron-helmet': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="2" y="4" width="12" height="8" fill="#C0C0C0" rx="2" />
      <rect x="4" y="10" width="3" height="3" fill="#A0A0A0" />
      <rect x="9" y="10" width="3" height="3" fill="#A0A0A0" />
    </svg>
  ),
  'diamond-helmet': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="2" y="4" width="12" height="8" fill="#5DECFF" rx="2" />
      <rect x="4" y="10" width="3" height="3" fill="#4AC8E0" />
      <rect x="9" y="10" width="3" height="3" fill="#4AC8E0" />
    </svg>
  ),
  'diamond-chestplate': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="1" y="2" width="14" height="12" fill="#5DECFF" rx="1" />
      <rect x="6" y="2" width="4" height="4" fill="transparent" />
      <rect x="3" y="6" width="10" height="6" fill="#4AC8E0" />
    </svg>
  ),
  'gold-block': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="0" y="0" width="16" height="16" fill="#FFD700" />
      <rect x="2" y="2" width="4" height="4" fill="#FFC000" />
      <rect x="10" y="10" width="4" height="4" fill="#FFE55C" />
    </svg>
  ),
  lapis: (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <circle cx="8" cy="8" r="6" fill="#1E3A8A" />
      <circle cx="6" cy="6" r="2" fill="#3B82F6" />
    </svg>
  ),
  'emerald-block': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="0" y="0" width="16" height="16" fill="#50C878" />
      <rect x="2" y="2" width="4" height="4" fill="#3AAD5C" />
      <rect x="10" y="10" width="4" height="4" fill="#6AE88B" />
    </svg>
  ),
  'enchanted-book': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="2" y="3" width="12" height="10" fill="#8B4513" rx="1" />
      <rect x="3" y="4" width="10" height="8" fill="#F5DEB3" />
      <rect x="5" y="6" width="6" height="1" fill="#000" />
      <rect x="5" y="8" width="4" height="1" fill="#000" />
    </svg>
  ),
  'ender-chest': (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="1" y="3" width="14" height="10" fill="#0a2a1a" rx="1" />
      <rect x="1" y="3" width="14" height="4" fill="#0d3d26" />
      <rect x="6" y="6" width="4" height="3" fill="#10B981" />
      <rect x="7" y="7" width="2" height="1" fill="#059669" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="0" y="0" width="16" height="16" fill="#666666" />
      <rect x="4" y="4" width="8" height="8" fill="#888888" />
      <text x="8" y="11" textAnchor="middle" fontSize="6" fill="#FFFFFF">?</text>
    </svg>
  ),
};

export function getTexturePathWithExt(texture: string): string {
  if (GIF_TEXTURES.includes(texture)) {
    return `/textures/${texture}.gif`;
  }
  return `/textures/${texture}.png`;
}

export function MinecraftTexture({ texture, size = 64, className = '' }: TextureProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    const FallbackIcon = FallbackIcons[texture] || FallbackIcons.default;
    return (
      <div 
        className={`pixel-texture ${className}`}
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
      >
        {FallbackIcon}
      </div>
    );
  }

  return (
    <img
      src={getTexturePathWithExt(texture)}
      alt={texture}
      width={size}
      height={size}
      className={`pixel-texture ${className}`}
      style={{ imageRendering: 'pixelated' }}
      onError={() => setFailed(true)}
    />
  );
}

export function getTexture(texture: string) {
  return <MinecraftTexture texture={texture} className="w-full h-full object-contain" />;
}

export default MinecraftTexture;
