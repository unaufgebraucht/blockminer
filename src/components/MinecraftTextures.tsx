import { getTexturePath } from '@/data/items';

interface TextureProps {
  texture: string;
  size?: number;
  className?: string;
}

export function MinecraftTexture({ texture, size = 64, className = '' }: TextureProps) {
  return (
    <img
      src={getTexturePath(texture)}
      alt={texture}
      width={size}
      height={size}
      className={`pixel-texture ${className}`}
      style={{ imageRendering: 'pixelated' }}
      onError={(e) => {
        // Fallback to a placeholder if texture doesn't load
        (e.target as HTMLImageElement).src = '/placeholder.svg';
      }}
    />
  );
}

export function getTexture(texture: string) {
  return <MinecraftTexture texture={texture} className="w-full h-full object-contain" />;
}

export default MinecraftTexture;
