import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Instagram", href: "/instagram" },
  { label: "YouTube", href: "/youtube" },
  { label: "TikTok", href: "/tiktok" },
  { label: "Facebook", href: "/facebook" },
  { label: "Pinterest", href: "/pinterest" },
  { label: "LinkedIn", href: "/linkedin" },
  { label: "X", href: "/twitter" },
  { label: "Banners", href: "/banners" },
  { label: "Posts", href: "/posts" },
  { label: "Posters", href: "/posters" },
  { label: "Print", href: "/print" },
];

export function MainNav() {
  const navigate = useNavigate();

  return (
    <nav className="hidden md:flex items-center gap-4">
      {NAV_LINKS.map((link) => (
        <button
          key={link.href}
          onClick={() => navigate(link.href)}
          className="text-xs font-heading font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
}

export function LogoWithTagline({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col cursor-pointer"
      onClick={onClick || (() => navigate("/"))}
    >
      <span className="font-orbitron text-sm sm:text-lg font-bold text-foreground select-none uppercase tracking-widest leading-tight">
        Lazy Faceless
      </span>
      <span className="text-[10px] text-muted-foreground font-heading tracking-wide">
        Create content for anything.
      </span>
    </div>
  );
}
