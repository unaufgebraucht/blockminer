import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { MinecraftBlock } from "./MinecraftBlock";
import { Gamepad2, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{ background: "var(--gradient-dirt)" }}
      />
      
      {/* Floating blocks */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <MinecraftBlock type="diamond" size={40} className="absolute top-10 left-[5%]" delay={0} />
        <MinecraftBlock type="gold" size={35} className="absolute bottom-20 right-[10%]" delay={0.5} />
        <MinecraftBlock type="emerald" size={30} className="absolute top-1/2 right-[5%]" delay={1} />
      </div>

      <div className="container px-4 relative z-10">
        <motion.div
          className="pixel-border bg-card p-8 md:p-12 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex p-4 pixel-border bg-primary/20 mb-6 glow-emerald"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Gamepad2 className="h-12 w-12 text-emerald" />
          </motion.div>

          <h2 className="text-2xl md:text-4xl font-pixel mb-4">
            <span className="text-foreground">READY TO</span>{" "}
            <span className="text-gradient-gold">MINE?</span>
          </h2>
          
          <p className="text-lg font-minecraft text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Join over 12,000 miners already earning crypto while playing their favorite game.
            No special equipment needed - just your love for Minecraft!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="minecraft-btn bg-emerald hover:bg-emerald/90 text-emerald-foreground px-8 py-6 text-xl font-minecraft"
              >
                START EARNING NOW
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          <p className="text-sm font-minecraft text-muted-foreground mt-6">
            ⚡ Free to join • 🔒 Secure • 💎 Instant rewards
          </p>
        </motion.div>
      </div>
    </section>
  );
}
