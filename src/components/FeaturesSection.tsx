import { motion } from "framer-motion";
import { Pickaxe, Coins, Users, Shield, Zap, Trophy } from "lucide-react";

const features = [
  {
    icon: Pickaxe,
    title: "MINE BLOCKS",
    description: "Every block you mine earns you tokens. Rare ores give bonus rewards.",
    color: "text-primary",
    glow: "shadow-[0_0_20px_hsl(100_45%_35%/0.5)]"
  },
  {
    icon: Coins,
    title: "EARN CRYPTO",
    description: "Convert your in-game tokens to real cryptocurrency. Withdraw anytime.",
    color: "text-gold",
    glow: "shadow-[0_0_20px_hsl(45_100%_50%/0.5)]"
  },
  {
    icon: Users,
    title: "GUILD WARS",
    description: "Join a guild and compete in weekly raids for massive bonus rewards.",
    color: "text-accent",
    glow: "shadow-[0_0_20px_hsl(175_70%_50%/0.5)]"
  },
  {
    icon: Shield,
    title: "SECURE",
    description: "Blockchain-verified rewards. Your earnings are safe and transparent.",
    color: "text-emerald",
    glow: "shadow-[0_0_20px_hsl(145_60%_45%/0.5)]"
  },
  {
    icon: Zap,
    title: "INSTANT",
    description: "No waiting. Earn rewards as you play with real-time token updates.",
    color: "text-gold",
    glow: "shadow-[0_0_20px_hsl(45_100%_50%/0.5)]"
  },
  {
    icon: Trophy,
    title: "LEADERBOARDS",
    description: "Climb the ranks and earn exclusive NFT rewards for top miners.",
    color: "text-accent",
    glow: "shadow-[0_0_20px_hsl(175_70%_50%/0.5)]"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-pixel mb-4">
            <span className="text-gradient-gold">GAME FEATURES</span>
          </h2>
          <p className="text-lg font-minecraft text-muted-foreground max-w-xl mx-auto">
            Everything you need to start earning while having fun
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group"
            >
              <div className="pixel-border bg-card p-6 h-full transition-all duration-300 hover:translate-y-[-4px] group-hover:bg-card/80">
                <div className={`inline-flex p-3 pixel-border bg-muted mb-4 ${feature.glow}`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-pixel mb-3 text-foreground">{feature.title}</h3>
                <p className="font-minecraft text-muted-foreground text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
