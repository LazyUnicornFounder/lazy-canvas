import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const DIGITAL_LINKS = [
  { label: "Instagram", href: "/instagram" },
  { label: "YouTube", href: "/youtube" },
  { label: "TikTok", href: "/tiktok" },
  { label: "Facebook", href: "/facebook" },
  { label: "Pinterest", href: "/pinterest" },
  { label: "LinkedIn", href: "/linkedin" },
  { label: "X", href: "/twitter" },
  { label: "App Store", href: "/app-store" },
  { label: "Google Play", href: "/google-play" },
  { label: "Phone Backgrounds", href: "/phone-backgrounds" },
  { label: "Banners", href: "/banners" },
  { label: "Posts", href: "/posts" },
];

const PHYSICAL_LINKS = [
  { label: "Posters", href: "/posters" },
  { label: "Flyers", href: "/flyers" },
  { label: "Business Cards", href: "/business-cards" },
  { label: "Stickers", href: "/stickers" },
  { label: "Print", href: "/print" },
];

function NavDropdown({ label, links }: { label: string; links: { label: string; href: string }[] }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs font-heading font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 min-w-[140px] bg-popover border border-border rounded-md shadow-lg z-50 py-1">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => { setOpen(false); navigate(link.href); }}
              className="w-full px-3 py-2 text-xs text-left font-heading text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MainNav() {
  return (
    <nav className="hidden md:flex items-center gap-4">
    </nav>
  );
}

export function LogoWithTagline({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={onClick || (() => navigate("/"))}
    >
      <span className="font-orbitron text-sm sm:text-lg font-bold text-foreground select-none uppercase tracking-widest leading-tight whitespace-nowrap">
        Lazy Canvas
      </span>
      <span className="px-1.5 py-0.5 text-[9px] font-heading font-bold uppercase tracking-wider bg-red-500 text-white rounded-sm leading-none">
        Beta
      </span>
    </div>
  );
}
