import { forwardRef, useRef, useEffect, useState } from "react";
import { Instagram, Youtube, Linkedin, Facebook, type LucideProps } from "lucide-react";

export type SocialPlatform = "instagram" | "twitter" | "tiktok" | "youtube" | "linkedin" | "threads" | "bluesky" | "facebook";

const XIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

type IconComponent = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> | (({ size, className }: { size?: number; className?: string }) => JSX.Element);

const socialIcons: Partial<Record<SocialPlatform, IconComponent>> = {
  instagram: Instagram,
  twitter: XIcon,
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
};

export type AspectRatio = "square" | "3:4" | "2:3" | "9:16" | "1:2" | "4:3" | "3:2" | "16:9" | "2:1";
export type QuoteFont = "playfair" | "cormorant" | "bebas" | "mono" | "heading" | "lora" | "inter" | "oswald" | "merriweather" | "raleway" | "dancing" | "archivo" | "crimson" | "montserrat" | "poppins";
export type QuoteTheme = "light" | "dark" | "cream" | "ink";
export type TextShadow = "none" | "soft" | "hard" | "glow" | "outline" | "neon";
export type AuthorPosition = "below-quote" | "bottom-left" | "bottom-center" | "bottom-right";

export interface ColoredWord {
  text: string;
  color: string; // hex or "rainbow"
}

interface QuotePreviewProps {
  quote: string;
  authorName: string;
  authorPhoto: string | null;
  socials: string;
  socialPlatform?: SocialPlatform;
  aspectRatio: AspectRatio;
  font: QuoteFont;
  theme: QuoteTheme;
  backgroundImage: string | null;
  backgroundOpacity: number;
  fontSize: number;
  textAlign: "left" | "center" | "right";
  letterSpacing: number;
  lineHeight: number;
  textColor: string;
  authorFontSize: number;
  authorColor: string;
  authorFont: QuoteFont;
  textShadow: TextShadow;
  authorPosition: AuthorPosition;
  backgroundColor: string;
  isBold: boolean;
  isItalic: boolean;
  coloredWords?: ColoredWord[];
  showWatermark?: boolean;
  showQuotationMarks?: boolean;
}

const aspectClasses: Record<AspectRatio, string> = {
  "square": "aspect-square",
  "3:4": "aspect-[3/4]",
  "2:3": "aspect-[2/3]",
  "9:16": "aspect-[9/16]",
  "1:2": "aspect-[1/2]",
  "4:3": "aspect-[4/3]",
  "3:2": "aspect-[3/2]",
  "16:9": "aspect-[16/9]",
  "2:1": "aspect-[2/1]",
};

const fontClasses: Record<QuoteFont, string> = {
  playfair: "font-playfair",
  cormorant: "font-cormorant",
  bebas: "font-bebas tracking-wider uppercase",
  mono: "font-mono",
  heading: "font-heading",
  lora: "font-lora",
  inter: "font-inter",
  oswald: "font-oswald uppercase",
  merriweather: "font-merriweather",
  raleway: "font-raleway",
  dancing: "font-dancing",
  archivo: "font-archivo uppercase",
  crimson: "font-crimson",
  montserrat: "font-montserrat",
  poppins: "font-poppins",
};

const themeStyles: Record<QuoteTheme, { bg: string; text: string; muted: string; border: string }> = {
  light: { bg: "#FFFFFF", text: "#1a1a1a", muted: "#888888", border: "#e5e5e5" },
  dark: { bg: "#1a1a1a", text: "#f5f5f0", muted: "#888888", border: "#333333" },
  cream: { bg: "#F5F0E8", text: "#2d2a26", muted: "#8a8477", border: "#e0d9cc" },
  ink: { bg: "#0d1117", text: "#c9d1d9", muted: "#6e7681", border: "#21262d" },
};

const shadowStyles: Record<TextShadow, string> = {
  none: "none",
  soft: "0 2px 8px rgba(0,0,0,0.3)",
  hard: "2px 2px 0px rgba(0,0,0,0.5)",
  glow: "0 0 12px rgba(255,255,255,0.6), 0 0 24px rgba(255,255,255,0.3)",
  outline: "-1px -1px 0 rgba(0,0,0,0.4), 1px -1px 0 rgba(0,0,0,0.4), -1px 1px 0 rgba(0,0,0,0.4), 1px 1px 0 rgba(0,0,0,0.4)",
  neon: "0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa, 0 0 82px #0fa, 0 0 92px #0fa",
};

// Render quote text with colored words
const renderColoredQuote = (text: string, coloredWords: ColoredWord[] = [], showQuotes = false) => {
  const activeColoredWords = coloredWords
    .map((word) => ({ ...word, text: word.text.trim() }))
    .filter((word) => word.text.length > 0);

  if (!activeColoredWords.length) return <>{showQuotes && <>&ldquo;</>}{text}{showQuotes && <>&rdquo;</>}</>;

  const segments: { text: string; color?: string }[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliestIdx = Infinity;
    let matchedWord: ColoredWord | null = null;

    for (let i = 0; i < activeColoredWords.length; i++) {
      const currentWord = activeColoredWords[i];
      const idx = remaining.toLowerCase().indexOf(currentWord.text.toLowerCase());
      if (idx !== -1 && idx < earliestIdx) {
        earliestIdx = idx;
        matchedWord = currentWord;
      }
    }

    if (matchedWord && earliestIdx !== Infinity) {
      if (earliestIdx > 0) {
        segments.push({ text: remaining.slice(0, earliestIdx) });
      }

      if (matchedWord.text.length === 0) {
        segments.push({ text: remaining });
        break;
      }

      segments.push({
        text: remaining.slice(earliestIdx, earliestIdx + matchedWord.text.length),
        color: matchedWord.color,
      });
      remaining = remaining.slice(earliestIdx + matchedWord.text.length);
    } else {
      segments.push({ text: remaining });
      break;
    }
  }

  return (
    <>
      {showQuotes && <>&ldquo;</>}
      {segments.map((seg, i) => {
        if (!seg.color) return <span key={i}>{seg.text}</span>;
        if (seg.color === "rainbow") {
          return (
            <span
              key={i}
              style={{
                backgroundImage: "linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00cc00, #0088ff, #8800ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {seg.text}
            </span>
          );
        }
        return <span key={i} style={{ color: seg.color }}>{seg.text}</span>;
      })}
      {showQuotes && <>&rdquo;</>}
    </>
  );
};

const QuotePreview = forwardRef<HTMLDivElement, QuotePreviewProps>(
  ({ quote, authorName, authorPhoto, socials, socialPlatform, aspectRatio, font, theme, backgroundImage, backgroundOpacity, fontSize, textAlign, letterSpacing, lineHeight, textColor, authorFontSize, authorColor, authorFont, textShadow, authorPosition, backgroundColor, isBold, isItalic, coloredWords, showWatermark, showQuotationMarks = false }, ref) => {
    const t = themeStyles[theme];
    const isPlaceholder = !quote;

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) { setScale(1); setIsOverflowing(false); return; }

      content.style.transform = "scale(1)";
      content.style.transformOrigin = "top left";

      const cW = container.clientWidth;
      const cH = container.clientHeight;
      const tW = content.scrollWidth;
      const tH = content.scrollHeight;

      if (tW > 0 && tH > 0) {
        const s = Math.min(cW / tW, cH / tH, 1);
        setScale(s);
        setIsOverflowing(s < 0.95);
      } else {
        setScale(1);
        setIsOverflowing(false);
      }
    }, [quote, fontSize, letterSpacing, lineHeight, font, aspectRatio, textAlign, authorFontSize, authorFont, authorName, authorPosition, socials, authorPhoto]);

    const hasAuthor = authorName || authorPhoto || socials;
    const isDetached = authorPosition !== "below-quote";

    const authorBlock = hasAuthor ? (
      <div
        className="flex items-center gap-3"
        style={{
          justifyContent:
            !isDetached
              ? textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : "flex-start"
              : authorPosition === "bottom-center" ? "center" : authorPosition === "bottom-right" ? "flex-end" : "flex-start",
          width: "100%",
          ...(!isDetached ? { marginTop: "1.5rem" } : {}),
        }}
      >
        {authorPhoto && (
          <img
            src={authorPhoto}
            alt={authorName}
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: `1px solid ${t.border}` }}
          />
        )}
        <div className="flex flex-col">
          {authorName && (
            <span
              className={`${fontClasses[authorFont]} font-medium`}
              style={{
                fontSize: `${authorFontSize}rem`,
                color: authorColor || textColor || undefined,
                textShadow: shadowStyles[textShadow],
              }}
            >
              {authorName}
            </span>
          )}
          {socials && (
            <span className="text-xs flex items-center gap-1" style={{ color: t.muted }}>
              {socialPlatform && socialIcons[socialPlatform] && (() => { const Icon = socialIcons[socialPlatform]!; return <Icon size={12} />; })()}
              {socials}
            </span>
          )}
        </div>
      </div>
    ) : null;

    return (
      <div
        ref={ref}
        className={`${aspectClasses[aspectRatio]} w-full max-w-lg max-h-full relative overflow-hidden`}
        style={{ backgroundColor: backgroundColor || t.bg, color: t.text, borderRadius: "2px" }}
      >
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              opacity: backgroundOpacity,
            }}
          />
        )}
        {backgroundImage && (
          <div className="absolute inset-0" style={{ backgroundColor: backgroundColor || t.bg, opacity: 1 - backgroundOpacity }} />
        )}
        {/* Inner padding — nothing goes beyond this */}
        <div className="absolute inset-0 flex flex-col" style={{ padding: "clamp(12px, 4%, 32px)" }}>
          {/* Quote content */}
          <div ref={containerRef} className="flex-1 flex items-center justify-center relative z-10 overflow-hidden">
            <div ref={contentRef} style={{ textAlign, maxWidth: "90%", width: "90%", transform: `scale(${scale})`, transformOrigin: "center center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <p
                className={`${fontClasses[font]} ${isPlaceholder ? "opacity-40" : ""} whitespace-pre-wrap break-words`}
                style={{
                  fontSize: `${fontSize}rem`,
                  letterSpacing: `${letterSpacing}em`,
                  lineHeight,
                  color: textColor || undefined,
                  textShadow: shadowStyles[textShadow],
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  fontWeight: isBold ? 700 : undefined,
                  fontStyle: isItalic ? "italic" : undefined,
                }}
              >
                {renderColoredQuote(quote, coloredWords, showQuotationMarks)}
              </p>
              {!isDetached && authorBlock}
            </div>
          </div>
          {/* Detached author positions */}
          {isDetached && authorBlock && (
            <div className="relative z-10 pt-2">
              {authorBlock}
            </div>
          )}
          {/* Overflow nudge */}
          {isOverflowing && (
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-fade-in"
              style={{
                backgroundColor: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(8px)",
                animation: "fade-in 0.3s ease-out, nudge-bounce 1.5s ease-in-out 0.3s",
              }}
            >
              <span style={{ fontSize: "clamp(8px, 2%, 12px)", color: "#fbbf24", fontWeight: 600, whiteSpace: "nowrap" }}>
                ⚠ Text too large — reduce font size
              </span>
            </div>
          )}
          {/* Watermark */}
          {showWatermark && (
            <div
              className="absolute bottom-0 right-0 z-20 font-heading"
              style={{
                padding: "clamp(4px, 1.5%, 10px) clamp(6px, 2%, 14px)",
                fontSize: "clamp(6px, 1.8%, 11px)",
                color: t.muted,
                opacity: 0.6,
                letterSpacing: "0.02em",
              }}
            >
              <span>Made with </span>
              <span style={{ fontWeight: 600, color: t.text, opacity: 0.5 }}>Lazy Quotes</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

QuotePreview.displayName = "QuotePreview";
export default QuotePreview;
