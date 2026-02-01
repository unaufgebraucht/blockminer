import { motion } from "framer-motion";

type BlockType = "grass" | "diamond" | "gold" | "emerald" | "stone" | "dirt";

interface MinecraftBlockProps {
  type: BlockType;
  size?: number;
  className?: string;
  delay?: number;
}

const blockStyles: Record<BlockType, { bg: string; border: string; glow?: string }> = {
  grass: { 
    bg: "bg-primary", 
    border: "border-primary",
  },
  diamond: { 
    bg: "bg-accent", 
    border: "border-accent",
    glow: "glow-diamond"
  },
  gold: { 
    bg: "bg-gold", 
    border: "border-gold",
    glow: "glow-gold"
  },
  emerald: { 
    bg: "bg-emerald", 
    border: "border-emerald",
    glow: "glow-emerald"
  },
  stone: { 
    bg: "bg-muted", 
    border: "border-muted-foreground",
  },
  dirt: { 
    bg: "bg-secondary", 
    border: "border-secondary",
  },
};

export function MinecraftBlock({ type, size = 60, className = "", delay = 0 }: MinecraftBlockProps) {
  const style = blockStyles[type];
  
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ y: 0, rotate: 0 }}
      animate={{ 
        y: [-10, 10, -10],
        rotate: [-3, 3, -3]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <div
        className={`${style.bg} ${style.glow || ""} pixel-border`}
        style={{ 
          width: size, 
          height: size,
          imageRendering: "pixelated"
        }}
      >
        {/* Inner texture */}
        <div className="absolute inset-2 opacity-30">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-px">
            {Array.from({ length: 9 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-black/20"
                style={{ opacity: Math.random() * 0.5 + 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
