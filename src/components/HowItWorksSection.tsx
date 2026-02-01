import { motion } from "framer-motion";
import { MinecraftBlock } from "./MinecraftBlock";

const steps = [
  {
    number: "01",
    title: "CONNECT WALLET",
    description: "Link your crypto wallet to your Minecraft account in seconds.",
    blockType: "diamond" as const,
  },
  {
    number: "02",
    title: "JOIN SERVER",
    description: "Enter our custom Minecraft server with play-to-earn mechanics.",
    blockType: "emerald" as const,
  },
  {
    number: "03",
    title: "MINE & PLAY",
    description: "Mine blocks, complete quests, defeat mobs - every action earns tokens.",
    blockType: "gold" as const,
  },
  {
    number: "04",
    title: "WITHDRAW",
    description: "Convert your tokens to crypto and withdraw to your wallet.",
    blockType: "grass" as const,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      
      <div className="container px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-pixel mb-4">
            <span className="text-gradient-diamond">HOW IT WORKS</span>
          </h2>
          <p className="text-lg font-minecraft text-muted-foreground max-w-xl mx-auto">
            Start earning in just 4 simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-border z-0">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rotate-45" />
                </div>
              )}
              
              <div className="pixel-border bg-card p-6 relative z-10 h-full">
                {/* Step number */}
                <div className="text-5xl font-pixel text-muted-foreground/30 mb-4">
                  {step.number}
                </div>
                
                {/* Block icon */}
                <div className="mb-4">
                  <MinecraftBlock type={step.blockType} size={50} delay={index * 0.3} />
                </div>
                
                <h3 className="text-lg font-pixel mb-3 text-foreground">{step.title}</h3>
                <p className="font-minecraft text-muted-foreground text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
