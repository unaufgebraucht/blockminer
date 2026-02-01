import { Pickaxe } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#" },
    { label: "How It Works", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  community: [
    { label: "Discord", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "Telegram", href: "#" },
    { label: "Reddit", href: "#" },
  ],
  legal: [
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="py-16 border-t border-border">
      <div className="container px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="p-1 pixel-border bg-primary">
                <Pickaxe className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-lg font-pixel text-foreground">
                MINE<span className="text-accent">CRAFT</span>
              </span>
            </a>
            <p className="font-minecraft text-muted-foreground text-lg leading-relaxed">
              The ultimate play-to-earn Minecraft experience. Mine blocks, earn crypto.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-pixel text-sm mb-4 text-foreground">PRODUCT</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="font-minecraft text-muted-foreground hover:text-foreground transition-colors text-lg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-pixel text-sm mb-4 text-foreground">COMMUNITY</h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="font-minecraft text-muted-foreground hover:text-foreground transition-colors text-lg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-pixel text-sm mb-4 text-foreground">LEGAL</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="font-minecraft text-muted-foreground hover:text-foreground transition-colors text-lg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pixel-border bg-card p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-minecraft text-muted-foreground text-center md:text-left">
            © 2024 MineCraft Rewards. Not affiliated with Mojang or Microsoft.
          </p>
          <div className="flex items-center gap-4 font-minecraft text-muted-foreground">
            <span>🌐 EN</span>
            <span>💎 1 MC = $0.0042</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
