import { motion } from "framer-motion";
import { MinecraftBlock } from "./MinecraftBlock";
import { Button } from "./ui/button";
import { Pickaxe, Sword, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{ background: "var(--gradient-sky)" }}
      />
      
      {/* Floating blocks */}
      <div className="absolute inset-0 pointer-events-none">
        <MinecraftBlock type="diamond" size={50} className="absolute top-20 left-[10%]" delay={0} />
        <MinecraftBlock type="gold" size={40} className="absolute top-40 right-[15%]" delay={0.5} />
        <MinecraftBlock type="emerald" size={45} className="absolute bottom-32 left-[20%]" delay={1} />
        <MinecraftBlock type="grass" size={55} className="absolute top-1/3 right-[10%]" delay={1.5} />
        <MinecraftBlock type="stone" size={35} className="absolute bottom-40 right-[25%]" delay={2} />
        <MinecraftBlock type="dirt" size={42} className="absolute top-1/2 left-[8%]" delay={2.5} />
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 pixel-border bg-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-accent text-lg font-minecraft">⛏️ MINE • EARN • CRAFT</span>
          </motion.div>

          {/* Main heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-pixel leading-relaxed mb-6">
            <span className="text-foreground">EARN CRYPTO</span>
            <br />
            <span className="text-gradient-diamond">PLAYING MINECRAFT</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl font-minecraft text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of miners earning rewards. Mine blocks, complete quests, 
            and trade your loot for real crypto rewards.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="minecraft-btn bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-xl font-minecraft"
              >
                <Pickaxe className="mr-2 h-5 w-5" />
                START MINING
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline"
                className="minecraft-btn border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-6 text-xl font-minecraft"
              >
                <Sword className="mr-2 h-5 w-5" />
                JOIN SERVER
              </Button>
            </motion.div>
          </div>

          {/* Stats preview */}
          <motion.div
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="pixel-border bg-card p-4">
              <div className="text-2xl md:text-3xl font-pixel text-gold">12.5K</div>
              <div className="text-sm font-minecraft text-muted-foreground">MINERS</div>
            </div>
            <div className="pixel-border bg-card p-4">
              <div className="text-2xl md:text-3xl font-pixel text-emerald">$2.4M</div>
              <div className="text-sm font-minecraft text-muted-foreground">EARNED</div>
            </div>
            <div className="pixel-border bg-card p-4">
              <div className="text-2xl md:text-3xl font-pixel text-accent">847K</div>
              <div className="text-sm font-minecraft text-muted-foreground">BLOCKS</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
