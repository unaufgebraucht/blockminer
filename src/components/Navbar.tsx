import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Menu, X, Pickaxe } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "FEATURES", href: "#features" },
  { label: "HOW IT WORKS", href: "#how-it-works" },
  { label: "LEADERBOARD", href: "#leaderboard" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 pixel-border border-t-0 border-x-0 bg-background/95 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="p-1 pixel-border bg-primary">
              <Pickaxe className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-pixel text-foreground hidden sm:block">
              MINE<span className="text-accent">CRAFT</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-minecraft text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="font-minecraft text-muted-foreground hover:text-foreground"
            >
              CONNECT
            </Button>
            <Button className="minecraft-btn bg-accent text-accent-foreground hover:bg-accent/90 font-minecraft">
              PLAY NOW
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 pixel-border bg-card"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <motion.div
            className="md:hidden pixel-border border-t-0 bg-card p-4 space-y-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-sm font-minecraft text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 space-y-2">
              <Button 
                variant="ghost" 
                className="w-full font-minecraft text-muted-foreground hover:text-foreground"
              >
                CONNECT
              </Button>
              <Button className="w-full minecraft-btn bg-accent text-accent-foreground hover:bg-accent/90 font-minecraft">
                PLAY NOW
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
