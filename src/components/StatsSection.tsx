import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { 
    label: "TOTAL MINED", 
    value: 2847532, 
    suffix: "",
    prefix: "",
    color: "text-primary" 
  },
  { 
    label: "PLAYERS ONLINE", 
    value: 1247, 
    suffix: "",
    prefix: "",
    color: "text-emerald" 
  },
  { 
    label: "REWARDS PAID", 
    value: 2400000, 
    suffix: "",
    prefix: "$",
    color: "text-gold" 
  },
  { 
    label: "GUILDS", 
    value: 342, 
    suffix: "",
    prefix: "",
    color: "text-accent" 
  },
];

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 relative">
      <div className="container px-4">
        <motion.div
          className="pixel-border bg-card p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`text-3xl md:text-4xl font-pixel mb-2 ${stat.color}`}>
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-minecraft text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
