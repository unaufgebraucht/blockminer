import { getTexturePath } from '@/data/items';
import { useState } from 'react';

interface TextureProps {
  texture: string;
  size?: number;
  className?: string;
}

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
  default: (
    <svg viewBox="0 0 16 16" className="w-full h-full">
      <rect x="0" y="0" width="16" height="16" fill="#666666" />
      <rect x="4" y="4" width="8" height="8" fill="#888888" />
      <text x="8" y="11" textAnchor="middle" fontSize="6" fill="#FFFFFF">?</text>
    </svg>
  ),
};

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
      src={getTexturePath(texture)}
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
