import React from 'react';

// Minecraft-style pixel textures using pure CSS
export const textures: Record<string, React.ReactNode> = {
  // Blocks
  'diamond': <DiamondGem />,
  'emerald': <EmeraldGem />,
  'gold-block': <GoldBlock />,
  'coal': <CoalBlock />,
  'tnt': <TNTBlock />,
  'iron-ingot': <IronIngot />,
  'lapis': <LapisBlock />,
  'emerald-block': <EmeraldBlock />,
  'dragon-egg': <DragonEgg />,
  'nether-star': <NetherStar />,
  
  // Swords
  'wooden-sword': <WoodenSword />,
  'iron-sword': <IronSword />,
  'diamond-sword': <DiamondSword />,
  'netherite-sword': <NetheriteSword />,
  
  // Pickaxes
  'stone-pickaxe': <StonePickaxe />,
  'iron-pickaxe': <IronPickaxe />,
  'diamond-pickaxe': <DiamondPickaxe />,
  'netherite-pickaxe': <NetheritePickaxe />,
  
  // Armor
  'leather-helmet': <LeatherHelmet />,
  'iron-helmet': <IronHelmet />,
  'diamond-helmet': <DiamondHelmet />,
  'diamond-chestplate': <DiamondChestplate />,
  
  // Other
  'enchanted-book': <EnchantedBook />,
  'chest': <Chest />,
  'ender-chest': <EnderChest />,
  'diamond-chest': <DiamondChest />,
  'legendary-chest': <LegendaryChest />,
};

function PixelGrid({ colors, size = 16 }: { colors: string[][]; size?: number }) {
  const pixelSize = 100 / colors.length;
  return (
    <svg viewBox={`0 0 ${colors[0].length} ${colors.length}`} className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {colors.map((row, y) =>
        row.map((color, x) =>
          color !== 'transparent' && (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />
          )
        )
      )}
    </svg>
  );
}

function DiamondGem() {
  const t = 'transparent';
  const d1 = '#4AEDD9'; // Light diamond
  const d2 = '#2BC4B4'; // Mid diamond
  const d3 = '#1A9A8C'; // Dark diamond
  const w = '#FFFFFF';  // White highlight
  
  const colors = [
    [t, t, t, t, t, d1, d1, d1, d1, t, t, t, t, t, t, t],
    [t, t, t, t, d1, d1, w, d1, d1, d1, t, t, t, t, t, t],
    [t, t, t, d1, d1, w, d1, d1, d2, d1, d1, t, t, t, t, t],
    [t, t, d1, d1, w, d1, d1, d2, d2, d2, d1, d1, t, t, t, t],
    [t, d1, d1, w, d1, d1, d2, d2, d2, d3, d2, d1, d1, t, t, t],
    [d1, d1, w, d1, d1, d2, d2, d2, d3, d3, d3, d2, d1, d1, t, t],
    [d1, d1, d1, d1, d2, d2, d2, d3, d3, d3, d3, d2, d2, d1, d1, t],
    [t, d1, d1, d2, d2, d2, d3, d3, d3, d3, d3, d3, d2, d1, d1, t],
    [t, t, d1, d2, d2, d3, d3, d3, d3, d3, d3, d2, d2, d1, t, t],
    [t, t, t, d1, d2, d3, d3, d3, d3, d3, d2, d2, d1, t, t, t],
    [t, t, t, t, d1, d2, d3, d3, d3, d2, d2, d1, t, t, t, t],
    [t, t, t, t, t, d1, d2, d2, d2, d2, d1, t, t, t, t, t],
    [t, t, t, t, t, t, d1, d1, d1, d1, t, t, t, t, t, t],
  ];
  return <PixelGrid colors={colors} />;
}

function EmeraldGem() {
  const t = 'transparent';
  const e1 = '#50C878'; // Light emerald
  const e2 = '#3CB371'; // Mid emerald
  const e3 = '#228B22'; // Dark emerald
  const w = '#90EE90';  // Highlight
  
  const colors = [
    [t, t, t, t, t, t, e1, e1, e1, t, t, t, t, t, t, t],
    [t, t, t, t, t, e1, w, e1, e1, e1, t, t, t, t, t, t],
    [t, t, t, t, e1, w, e1, e1, e2, e1, e1, t, t, t, t, t],
    [t, t, t, e1, w, e1, e1, e2, e2, e2, e1, e1, t, t, t, t],
    [t, t, e1, w, e1, e1, e2, e2, e2, e3, e2, e1, e1, t, t, t],
    [t, e1, w, e1, e1, e2, e2, e2, e3, e3, e3, e2, e1, e1, t, t],
    [t, e1, e1, e1, e2, e2, e2, e3, e3, e3, e3, e2, e2, e1, t, t],
    [t, t, e1, e2, e2, e2, e3, e3, e3, e3, e3, e3, e2, e1, t, t],
    [t, t, t, e1, e2, e3, e3, e3, e3, e3, e3, e2, e1, t, t, t],
    [t, t, t, t, e1, e2, e3, e3, e3, e3, e2, e1, t, t, t, t],
    [t, t, t, t, t, e1, e2, e2, e2, e2, e1, t, t, t, t, t],
    [t, t, t, t, t, t, e1, e1, e1, e1, t, t, t, t, t, t],
  ];
  return <PixelGrid colors={colors} />;
}

function TNTBlock() {
  const r1 = '#FF0000'; // Red
  const r2 = '#CC0000'; // Dark red
  const w = '#FFFFFF';  // White
  const b = '#1A1A1A';  // Black
  
  const colors = [
    [r1, r1, r1, r1, w, w, w, w, w, w, w, w, r1, r1, r1, r1],
    [r1, r2, r2, r1, w, b, b, b, b, b, b, w, r1, r2, r2, r1],
    [r1, r2, r2, r1, w, b, w, w, b, b, b, w, r1, r2, r2, r1],
    [r1, r2, r2, r1, w, b, w, w, b, b, b, w, r1, r2, r2, r1],
    [r1, r1, r1, r1, w, b, b, w, b, b, b, w, r1, r1, r1, r1],
    [r2, r2, r2, r2, w, b, b, w, b, b, b, w, r2, r2, r2, r2],
    [r1, r1, r1, r1, w, b, b, w, b, b, b, w, r1, r1, r1, r1],
    [r1, r2, r2, r1, w, b, b, w, b, b, b, w, r1, r2, r2, r1],
    [r1, r2, r2, r1, w, w, w, w, w, w, w, w, r1, r2, r2, r1],
    [r1, r2, r2, r1, r1, r2, r2, r1, r1, r2, r2, r1, r1, r2, r2, r1],
    [r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1],
    [r2, r2, r2, r2, r2, r2, r2, r2, r2, r2, r2, r2, r2, r2, r2, r2],
    [r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1],
    [r1, r2, r2, r1, r1, r2, r2, r1, r1, r2, r2, r1, r1, r2, r2, r1],
    [r1, r2, r2, r1, r1, r2, r2, r1, r1, r2, r2, r1, r1, r2, r2, r1],
    [r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1, r1],
  ];
  return <PixelGrid colors={colors} />;
}

function GoldBlock() {
  const g1 = '#FFD700';
  const g2 = '#DAA520';
  const g3 = '#B8860B';
  const w = '#FFED4A';
  
  const colors = Array(16).fill(null).map((_, y) =>
    Array(16).fill(null).map((_, x) => {
      if ((x + y) % 4 === 0) return w;
      if ((x + y) % 3 === 0) return g3;
      if ((x + y) % 2 === 0) return g2;
      return g1;
    })
  );
  return <PixelGrid colors={colors} />;
}

function CoalBlock() {
  const c1 = '#2C2C2C';
  const c2 = '#1A1A1A';
  const c3 = '#3D3D3D';
  
  const colors = Array(16).fill(null).map((_, y) =>
    Array(16).fill(null).map((_, x) => {
      if ((x * y) % 7 === 0) return c3;
      if ((x + y) % 3 === 0) return c1;
      return c2;
    })
  );
  return <PixelGrid colors={colors} />;
}

function IronIngot() {
  const t = 'transparent';
  const i1 = '#D4D4D4';
  const i2 = '#A8A8A8';
  const i3 = '#7C7C7C';
  
  const colors = [
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, i1, i1, i1, i1, i1, i1, i1, i1, i1, i1, i1, i1, t, t],
    [t, i1, i1, i1, i1, i1, i1, i1, i1, i1, i1, i1, i1, i1, i1, t],
    [t, i1, i1, i2, i2, i2, i2, i2, i2, i2, i2, i2, i2, i1, i1, t],
    [t, i1, i2, i2, i2, i2, i2, i2, i2, i2, i2, i2, i2, i2, i1, t],
    [t, i1, i2, i2, i3, i3, i3, i3, i3, i3, i3, i3, i2, i2, i1, t],
    [t, i1, i2, i3, i3, i3, i3, i3, i3, i3, i3, i3, i3, i2, i1, t],
    [t, i1, i3, i3, i3, i3, i3, i3, i3, i3, i3, i3, i3, i3, i1, t],
    [t, t, i1, i1, i1, i1, i1, i1, i1, i1, i1, i1, i1, i1, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, t],
  ];
  return <PixelGrid colors={colors} />;
}

function LapisBlock() {
  const l1 = '#1E3A8A';
  const l2 = '#2563EB';
  const l3 = '#3B82F6';
  
  const colors = Array(16).fill(null).map((_, y) =>
    Array(16).fill(null).map((_, x) => {
      if ((x * y) % 5 === 0) return l3;
      if ((x + y) % 3 === 0) return l1;
      return l2;
    })
  );
  return <PixelGrid colors={colors} />;
}

function EmeraldBlock() {
  const e1 = '#50C878';
  const e2 = '#3CB371';
  const e3 = '#228B22';
  
  const colors = Array(16).fill(null).map((_, y) =>
    Array(16).fill(null).map((_, x) => {
      if ((x + y) % 4 === 0) return '#90EE90';
      if ((x * y) % 5 === 0) return e3;
      if ((x + y) % 2 === 0) return e2;
      return e1;
    })
  );
  return <PixelGrid colors={colors} />;
}

function DragonEgg() {
  const p1 = '#1A0A2E';
  const p2 = '#2D1B4E';
  const p3 = '#4A2C7C';
  const s = '#9333EA';
  
  const colors = Array(16).fill(null).map((_, y) =>
    Array(16).fill(null).map((_, x) => {
      const dist = Math.sqrt((x - 8) ** 2 + (y - 8) ** 2);
      if (dist > 7) return 'transparent';
      if (Math.random() > 0.9) return s;
      if ((x + y) % 4 === 0) return p3;
      if ((x + y) % 2 === 0) return p2;
      return p1;
    })
  );
  return <PixelGrid colors={colors} />;
}

function NetherStar() {
  const t = 'transparent';
  const w = '#FFFFFF';
  const y = '#FFFACD';
  const g = '#FFD700';
  
  const colors = [
    [t, t, t, t, t, t, t, w, w, t, t, t, t, t, t, t],
    [t, t, t, t, t, t, w, y, y, w, t, t, t, t, t, t],
    [t, t, t, t, t, w, y, y, y, y, w, t, t, t, t, t],
    [t, t, t, t, w, y, y, g, g, y, y, w, t, t, t, t],
    [t, t, t, w, y, y, g, g, g, g, y, y, w, t, t, t],
    [t, t, w, y, y, g, g, g, g, g, g, y, y, w, t, t],
    [t, w, y, y, g, g, g, g, g, g, g, g, y, y, w, t],
    [w, y, y, g, g, g, g, w, w, g, g, g, g, y, y, w],
    [w, y, y, g, g, g, g, w, w, g, g, g, g, y, y, w],
    [t, w, y, y, g, g, g, g, g, g, g, g, y, y, w, t],
    [t, t, w, y, y, g, g, g, g, g, g, y, y, w, t, t],
    [t, t, t, w, y, y, g, g, g, g, y, y, w, t, t, t],
    [t, t, t, t, w, y, y, g, g, y, y, w, t, t, t, t],
    [t, t, t, t, t, w, y, y, y, y, w, t, t, t, t, t],
    [t, t, t, t, t, t, w, y, y, w, t, t, t, t, t, t],
    [t, t, t, t, t, t, t, w, w, t, t, t, t, t, t, t],
  ];
  return <PixelGrid colors={colors} />;
}

// Swords
function WoodenSword() {
  const t = 'transparent';
  const w = '#8B4513';
  const h = '#A0522D';
  const b = '#4A3728';
  
  const colors = [
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, h, h],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, h, w, h],
    [t, t, t, t, t, t, t, t, t, t, t, t, h, w, h, t],
    [t, t, t, t, t, t, t, t, t, t, t, h, w, h, t, t],
    [t, t, t, t, t, t, t, t, t, t, h, w, h, t, t, t],
    [t, t, t, t, t, t, t, t, t, h, w, h, t, t, t, t],
    [t, t, t, t, t, t, t, t, h, w, h, t, t, t, t, t],
    [t, t, t, t, t, t, t, h, w, h, t, t, t, t, t, t],
    [t, t, t, t, t, t, h, w, h, t, t, t, t, t, t, t],
    [t, t, t, t, t, h, w, h, t, t, t, t, t, t, t, t],
    [t, t, t, t, b, b, h, t, t, t, t, t, t, t, t, t],
    [t, t, t, b, b, b, b, t, t, t, t, t, t, t, t, t],
    [t, t, t, t, b, b, t, t, t, t, t, t, t, t, t, t],
    [t, t, t, t, b, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, t, b, t, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, b, t, t, t, t, t, t, t, t, t, t, t, t, t],
  ];
  return <PixelGrid colors={colors} />;
}

function IronSword() {
  const t = 'transparent';
  const s = '#D4D4D4';
  const h = '#A8A8A8';
  const b = '#4A3728';
  
  const colors = [
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, s, s],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, s, h, s],
    [t, t, t, t, t, t, t, t, t, t, t, t, s, h, s, t],
    [t, t, t, t, t, t, t, t, t, t, t, s, h, s, t, t],
    [t, t, t, t, t, t, t, t, t, t, s, h, s, t, t, t],
    [t, t, t, t, t, t, t, t, t, s, h, s, t, t, t, t],
    [t, t, t, t, t, t, t, t, s, h, s, t, t, t, t, t],
    [t, t, t, t, t, t, t, s, h, s, t, t, t, t, t, t],
    [t, t, t, t, t, t, s, h, s, t, t, t, t, t, t, t],
    [t, t, t, t, t, s, h, s, t, t, t, t, t, t, t, t],
    [t, t, t, t, b, b, s, t, t, t, t, t, t, t, t, t],
    [t, t, t, b, b, b, b, t, t, t, t, t, t, t, t, t],
    [t, t, t, t, b, b, t, t, t, t, t, t, t, t, t, t],
    [t, t, t, t, b, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, t, b, t, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, b, t, t, t, t, t, t, t, t, t, t, t, t, t],
  ];
  return <PixelGrid colors={colors} />;
}

function DiamondSword() {
  const t = 'transparent';
  const d = '#4AEDD9';
  const h = '#2BC4B4';
  const b = '#4A3728';
  
  const colors = [
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, d, d],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, d, h, d],
    [t, t, t, t, t, t, t, t, t, t, t, t, d, h, d, t],
    [t, t, t, t, t, t, t, t, t, t, t, d, h, d, t, t],
    [t, t, t, t, t, t, t, t, t, t, d, h, d, t, t, t],
    [t, t, t, t, t, t, t, t, t, d, h, d, t, t, t, t],
    [t, t, t, t, t, t, t, t, d, h, d, t, t, t, t, t],
    [t, t, t, t, t, t, t, d, h, d, t, t, t, t, t, t],
    [t, t, t, t, t, t, d, h, d, t, t, t, t, t, t, t],
    [t, t, t, t, t, d, h, d, t, t, t, t, t, t, t, t],
    [t, t, t, t, b, b, d, t, t, t, t, t, t, t, t, t],
    [t, t, t, b, b, b, b, t, t, t, t, t, t, t, t, t],
    [t, t, t, t, b, b, t, t, t, t, t, t, t, t, t, t],
    [t, t, t, t, b, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, t, b, t, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, b, t, t, t, t, t, t, t, t, t, t, t, t, t],
  ];
  return <PixelGrid colors={colors} />;
}

function NetheriteSword() {
  const t = 'transparent';
  const n = '#3D3D3D';
  const h = '#2A2A2A';
  const p = '#4A1A4A';
  const b = '#4A3728';
  
  const colors = [
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, n, p],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, n, h, n],
    [t, t, t, t, t, t, t, t, t, t, t, t, n, h, n, t],
    [t, t, t, t, t, t, t, t, t, t, t, n, h, n, t, t],
    [t, t, t, t, t, t, t, t, t, t, n, h, n, t, t, t],
    [t, t, t, t, t, t, t, t, t, n, h, n, t, t, t, t],
    [t, t, t, t, t, t, t, t, n, h, n, t, t, t, t, t],
    [t, t, t, t, t, t, t, n, h, n, t, t, t, t, t, t],
    [t, t, t, t, t, t, n, h, n, t, t, t, t, t, t, t],
    [t, t, t, t, t, n, h, n, t, t, t, t, t, t, t, t],
    [t, t, t, t, b, b, n, t, t, t, t, t, t, t, t, t],
    [t, t, t, b, b, b, b, t, t, t, t, t, t, t, t, t],
    [t, t, t, t, b, b, t, t, t, t, t, t, t, t, t, t],
    [t, t, t, t, b, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, t, b, t, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, b, t, t, t, t, t, t, t, t, t, t, t, t, t],
  ];
  return <PixelGrid colors={colors} />;
}

// Pickaxes
function StonePickaxe() {
  const t = 'transparent';
  const s = '#7C7C7C';
  const h = '#5C5C5C';
  const w = '#8B4513';
  
  const colors = [
    [t, t, t, s, s, s, s, s, s, t, t, t, t, t, t, t],
    [t, t, s, h, h, h, h, h, h, s, t, t, t, t, t, t],
    [t, t, s, h, t, t, t, t, h, s, t, t, t, t, t, t],
    [t, t, t, s, t, t, t, t, s, w, t, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, w, t, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, w, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, w, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, w, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, w, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, w, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, w],
  ];
  return <PixelGrid colors={colors} />;
}

function IronPickaxe() {
  const t = 'transparent';
  const i = '#D4D4D4';
  const h = '#A8A8A8';
  const w = '#8B4513';
  
  const colors = [
    [t, t, t, i, i, i, i, i, i, t, t, t, t, t, t, t],
    [t, t, i, h, h, h, h, h, h, i, t, t, t, t, t, t],
    [t, t, i, h, t, t, t, t, h, i, t, t, t, t, t, t],
    [t, t, t, i, t, t, t, t, i, w, t, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, w, t, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, w, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, w, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, w, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, w, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, w, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, w],
  ];
  return <PixelGrid colors={colors} />;
}

function DiamondPickaxe() {
  const t = 'transparent';
  const d = '#4AEDD9';
  const h = '#2BC4B4';
  const w = '#8B4513';
  
  const colors = [
    [t, t, t, d, d, d, d, d, d, t, t, t, t, t, t, t],
    [t, t, d, h, h, h, h, h, h, d, t, t, t, t, t, t],
    [t, t, d, h, t, t, t, t, h, d, t, t, t, t, t, t],
    [t, t, t, d, t, t, t, t, d, w, t, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, w, t, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, w, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, w, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, w, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, w, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, w, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, w],
  ];
  return <PixelGrid colors={colors} />;
}

function NetheritePickaxe() {
  const t = 'transparent';
  const n = '#3D3D3D';
  const h = '#2A2A2A';
  const w = '#8B4513';
  
  const colors = [
    [t, t, t, n, n, n, n, n, n, t, t, t, t, t, t, t],
    [t, t, n, h, h, h, h, h, h, n, t, t, t, t, t, t],
    [t, t, n, h, t, t, t, t, h, n, t, t, t, t, t, t],
    [t, t, t, n, t, t, t, t, n, w, t, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, w, t, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, w, t, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, w, t, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, w, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, w, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, w, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, w],
  ];
  return <PixelGrid colors={colors} />;
}

// Armor
function LeatherHelmet() {
  const t = 'transparent';
  const l = '#8B4513';
  const h = '#A0522D';
  
  const colors = [
    [t, t, t, t, l, l, l, l, l, l, l, l, t, t, t, t],
    [t, t, t, l, h, h, h, h, h, h, h, h, l, t, t, t],
    [t, t, l, h, h, h, h, h, h, h, h, h, h, l, t, t],
    [t, l, h, h, h, h, h, h, h, h, h, h, h, h, l, t],
    [t, l, h, h, h, h, h, h, h, h, h, h, h, h, l, t],
    [t, l, l, l, l, l, l, l, l, l, l, l, l, l, l, t],
    [t, l, t, t, t, t, t, t, t, t, t, t, t, t, l, t],
    [t, l, t, t, t, t, t, t, t, t, t, t, t, t, l, t],
  ];
  return <PixelGrid colors={colors} />;
}

function IronHelmet() {
  const t = 'transparent';
  const i = '#D4D4D4';
  const h = '#A8A8A8';
  
  const colors = [
    [t, t, t, t, i, i, i, i, i, i, i, i, t, t, t, t],
    [t, t, t, i, h, h, h, h, h, h, h, h, i, t, t, t],
    [t, t, i, h, h, h, h, h, h, h, h, h, h, i, t, t],
    [t, i, h, h, h, h, h, h, h, h, h, h, h, h, i, t],
    [t, i, h, h, h, h, h, h, h, h, h, h, h, h, i, t],
    [t, i, i, i, i, i, i, i, i, i, i, i, i, i, i, t],
    [t, i, t, t, t, t, t, t, t, t, t, t, t, t, i, t],
    [t, i, t, t, t, t, t, t, t, t, t, t, t, t, i, t],
  ];
  return <PixelGrid colors={colors} />;
}

function DiamondHelmet() {
  const t = 'transparent';
  const d = '#4AEDD9';
  const h = '#2BC4B4';
  
  const colors = [
    [t, t, t, t, d, d, d, d, d, d, d, d, t, t, t, t],
    [t, t, t, d, h, h, h, h, h, h, h, h, d, t, t, t],
    [t, t, d, h, h, h, h, h, h, h, h, h, h, d, t, t],
    [t, d, h, h, h, h, h, h, h, h, h, h, h, h, d, t],
    [t, d, h, h, h, h, h, h, h, h, h, h, h, h, d, t],
    [t, d, d, d, d, d, d, d, d, d, d, d, d, d, d, t],
    [t, d, t, t, t, t, t, t, t, t, t, t, t, t, d, t],
    [t, d, t, t, t, t, t, t, t, t, t, t, t, t, d, t],
  ];
  return <PixelGrid colors={colors} />;
}

function DiamondChestplate() {
  const t = 'transparent';
  const d = '#4AEDD9';
  const h = '#2BC4B4';
  
  const colors = [
    [t, d, d, d, t, t, t, t, t, t, t, t, d, d, d, t],
    [d, h, h, h, d, t, t, t, t, t, t, d, h, h, h, d],
    [d, h, h, h, h, d, d, d, d, d, d, h, h, h, h, d],
    [d, h, h, h, h, h, h, h, h, h, h, h, h, h, h, d],
    [d, h, h, h, h, h, h, h, h, h, h, h, h, h, h, d],
    [d, h, h, h, h, h, h, h, h, h, h, h, h, h, h, d],
    [t, d, h, h, h, h, h, h, h, h, h, h, h, h, d, t],
    [t, t, d, h, h, h, h, h, h, h, h, h, h, d, t, t],
    [t, t, t, d, h, h, h, h, h, h, h, h, d, t, t, t],
    [t, t, t, t, d, d, d, d, d, d, d, d, t, t, t, t],
  ];
  return <PixelGrid colors={colors} />;
}

function EnchantedBook() {
  const t = 'transparent';
  const p = '#4A1A4A';
  const g = '#FFD700';
  const b = '#8B4513';
  
  const colors = [
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, t],
    [t, t, t, p, p, p, p, p, p, p, p, p, p, t, t, t],
    [t, t, p, p, g, g, p, p, p, g, g, p, p, p, t, t],
    [t, t, p, p, g, g, p, p, p, g, g, p, p, p, t, t],
    [t, t, p, p, p, p, p, p, p, p, p, p, p, p, t, t],
    [t, t, p, p, g, g, g, g, g, g, g, p, p, p, t, t],
    [t, t, p, p, p, p, p, p, p, p, p, p, p, p, t, t],
    [t, t, p, p, g, g, g, g, g, g, g, p, p, p, t, t],
    [t, t, p, p, p, p, p, p, p, p, p, p, p, p, t, t],
    [t, t, p, p, g, g, g, g, g, g, g, p, p, p, t, t],
    [t, t, p, p, p, p, p, p, p, p, p, p, p, p, t, t],
    [t, t, t, p, p, p, p, p, p, p, p, p, p, t, t, t],
    [t, t, t, t, t, t, t, t, t, t, t, t, t, t, t, t],
  ];
  return <PixelGrid colors={colors} />;
}

// Chests
function Chest() {
  const b = '#8B4513';
  const d = '#654321';
  const g = '#FFD700';
  
  const colors = Array(16).fill(null).map((_, y) =>
    Array(16).fill(null).map((_, x) => {
      if (y < 2 || y > 13 || x < 1 || x > 14) return d;
      if (y === 7 && x >= 6 && x <= 9) return g;
      if ((y === 6 || y === 8) && (x === 7 || x === 8)) return g;
      return b;
    })
  );
  return <PixelGrid colors={colors} />;
}

function EnderChest() {
  const b = '#1A1A2E';
  const d = '#0F0F1A';
  const g = '#00FF00';
  
  const colors = Array(16).fill(null).map((_, y) =>
    Array(16).fill(null).map((_, x) => {
      if (y < 2 || y > 13 || x < 1 || x > 14) return d;
      if (y === 7 && x >= 6 && x <= 9) return g;
      if ((y === 6 || y === 8) && (x === 7 || x === 8)) return g;
      return b;
    })
  );
  return <PixelGrid colors={colors} />;
}

function DiamondChest() {
  const b = '#2BC4B4';
  const d = '#1A9A8C';
  const g = '#FFD700';
  
  const colors = Array(16).fill(null).map((_, y) =>
    Array(16).fill(null).map((_, x) => {
      if (y < 2 || y > 13 || x < 1 || x > 14) return d;
      if (y === 7 && x >= 6 && x <= 9) return g;
      if ((y === 6 || y === 8) && (x === 7 || x === 8)) return g;
      return b;
    })
  );
  return <PixelGrid colors={colors} />;
}

function LegendaryChest() {
  const b = '#9333EA';
  const d = '#6B21A8';
  const g = '#FFD700';
  const s = '#FFFFFF';
  
  const colors = Array(16).fill(null).map((_, y) =>
    Array(16).fill(null).map((_, x) => {
      if (y < 2 || y > 13 || x < 1 || x > 14) return d;
      if (y === 7 && x >= 6 && x <= 9) return g;
      if ((y === 6 || y === 8) && (x === 7 || x === 8)) return g;
      if ((x + y) % 5 === 0) return s;
      return b;
    })
  );
  return <PixelGrid colors={colors} />;
}

export function getTexture(name: string): React.ReactNode {
  return textures[name] || <div className="w-full h-full bg-gray-500" />;
}
