import { forwardRef, useRef, useEffect, useState } from "react";
import { Instagram, Youtube, Linkedin, Facebook, type LucideProps } from "lucide-react";
import { BG_FILTERS } from "@/components/QuoteEditor";

export type SocialPlatform = "instagram" | "twitter" | "tiktok" | "youtube" | "linkedin" | "threads" | "bluesky" | "facebook" | "pinterest" | "snapchat";

type CustomIconProps = { size?: number; className?: string };

const XIcon = ({ size = 24, className }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ size = 24, className }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
  </svg>
);

const ThreadsIcon = ({ size = 24, className }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.33-3.02.88-.726 2.07-1.128 3.446-1.165.977-.026 1.898.092 2.754.353.012-.553-.003-1.088-.046-1.597-.132-1.567-.554-2.04-1.1-2.243-.387-.145-.862-.2-1.402-.165-1.725.113-2.676 1.024-2.77 1.11l-1.37-1.49c.139-.129 1.418-1.27 3.912-1.43.722-.047 1.39.002 1.987.145 1.09.26 1.9.88 2.349 1.795.34.694.543 1.59.603 2.675.058 1.04.037 2.239-.128 3.228.493.184.95.408 1.365.674 1.198.77 2.07 1.865 2.525 3.166.755 2.164.357 4.738-1.594 6.673-1.903 1.888-4.194 2.705-7.438 2.726z" />
  </svg>
);

const BlueskyIcon = ({ size = 24, className }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.6 3.476 6.153 3.226-4.466.75-8.18 2.576-4.498 8.257 3.995 5.653 7.456.347 9.72-4.08 2.265 4.427 4.668 9.18 9.721 4.08 3.554-5.4-.04-7.507-4.498-8.257 2.553.25 5.368-.6 6.153-3.226.246-.828.624-5.788.624-6.479 0-.688-.139-1.86-.902-2.203-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
  </svg>
);

const PinterestIcon = ({ size = 24, className }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

const SnapchatIcon = ({ size = 24, className }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.979-.27.159-.074.346-.112.53-.112.425 0 .823.236.988.555.165.346.107.718-.096.987-.349.46-1.312.575-1.755.636-.165.03-.365.06-.495.09-.06.03-.164.12-.164.27 0 .045.012.075.015.09.06.3.12.565.255.795.315.555.88 1.065 1.726 1.56.749.435 1.395.66 1.741.749.22.06.465.21.57.39.105.18.09.39.06.57-.06.314-.44.644-1.017.855-.33.12-.735.36-1.676.585-.045.012-.06.105-.075.195-.015.12-.045.3-.089.449-.03.119-.15.254-.345.254-.12 0-.255-.03-.449-.075-.255-.06-.585-.135-.99-.135-.195 0-.39.015-.585.045-.585.12-1.065.585-1.635 1.125-.57.54-1.215 1.155-2.235 1.305h-.015c-.015 0-.03 0-.045.002h-.21c-1.02-.15-1.665-.765-2.235-1.305-.57-.54-1.05-1.005-1.635-1.125-.195-.03-.39-.045-.585-.045-.405 0-.735.075-.99.135-.195.045-.329.075-.449.075-.225 0-.345-.174-.36-.299-.03-.135-.06-.3-.075-.42-.015-.089-.03-.179-.075-.194-.944-.226-1.35-.466-1.68-.586-.577-.21-.956-.54-1.016-.855-.03-.18-.045-.39.06-.57.105-.18.345-.33.57-.39.345-.09.99-.314 1.74-.749.846-.494 1.41-1.004 1.726-1.559.134-.23.194-.494.254-.794.003-.015.015-.045.015-.09 0-.15-.105-.24-.165-.27-.13-.03-.33-.06-.495-.09-.449-.061-1.41-.176-1.755-.636-.21-.27-.261-.645-.096-.987.165-.319.563-.555.988-.555.185 0 .371.038.53.112.33.15.675.27.974.27.2 0 .33-.045.406-.09-.007-.165-.018-.33-.03-.51l-.003-.06c-.105-1.628-.23-3.654.3-4.847C7.86 1.069 11.216.793 12.206.793z" />
  </svg>
);

type IconComponent = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> | (({ size, className }: CustomIconProps) => JSX.Element);

const socialIcons: Record<SocialPlatform, IconComponent> = {
  instagram: Instagram,
  twitter: XIcon,
  tiktok: TikTokIcon,
  youtube: Youtube,
  linkedin: Linkedin,
  threads: ThreadsIcon,
  bluesky: BlueskyIcon,
  facebook: Facebook,
  pinterest: PinterestIcon,
  snapchat: SnapchatIcon,
};

export type AspectRatio = "square" | "3:4" | "2:3" | "9:16" | "1:2" | "4:3" | "3:2" | "16:9" | "2:1" | "1.91:1" | "3:1" | "4:1" | "820:312" | "a0" | "a1" | "a2" | "a3" | "a4" | "letter" | "legal" | "tabloid" | "poster-18x24" | "poster-24x36" | "banner-2x5" | "ios-screenshot" | "ios-ipad" | "android-phone" | "android-tablet" | "mac-screenshot" | "app-icon" | "iphone-wallpaper" | "android-wallpaper" | "lock-screen" | "business-card" | "custom";
export type QuoteFont = "playfair" | "cormorant" | "bebas" | "mono" | "heading" | "lora" | "inter" | "oswald" | "merriweather" | "raleway" | "dancing" | "archivo" | "crimson" | "montserrat" | "poppins" | "pacifico" | "great-vibes" | "satisfy" | "caveat" | "permanent-marker" | "shadows-into-light" | "orbitron" | "rajdhani" | "audiowide";
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
  photoShape?: "circle" | "square" | "rectangle" | "rounded-square" | "oval" | "hexagon";
  socials: string;
  socialPlatform?: SocialPlatform;
  aspectRatio: AspectRatio;
  font: QuoteFont;
  theme: QuoteTheme;
  backgroundImage: string | null;
  backgroundOpacity: number;
  backgroundBlur?: number;
  backgroundFilter?: string;
  fontSize: number;
  textAlign: "left" | "center" | "right";
  letterSpacing: number;
  lineHeight: number;
  textColor: string;
  authorFontSize: number;
  authorColor: string;
  authorFont: QuoteFont;
  textShadow: TextShadow;
  shadowOpacity?: number;
  authorPosition: AuthorPosition;
  backgroundColor: string;
  isBold: boolean;
  isItalic: boolean;
  coloredWords?: ColoredWord[];
  showWatermark?: boolean;
  showQuotationMarks?: boolean;
  customWidth?: number;
  customHeight?: number;
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
  "1.91:1": "aspect-[1.91/1]",
  "3:1": "aspect-[3/1]",
  "4:1": "aspect-[4/1]",
  "820:312": "aspect-[820/312]",
  "a0": "aspect-[841/1189]",
  "a1": "aspect-[594/841]",
  "a2": "aspect-[420/594]",
  "a3": "aspect-[297/420]",
  "a4": "aspect-[210/297]",
  "letter": "aspect-[8.5/11]",
  "legal": "aspect-[8.5/14]",
  "tabloid": "aspect-[11/17]",
  "poster-18x24": "aspect-[18/24]",
  "poster-24x36": "aspect-[24/36]",
  "banner-2x5": "aspect-[2/5]",
  "ios-screenshot": "aspect-[1290/2796]",
  "ios-ipad": "aspect-[2048/2732]",
  "android-phone": "aspect-[1080/1920]",
  "android-tablet": "aspect-[1920/1200]",
  "mac-screenshot": "aspect-[2880/1800]",
  "app-icon": "aspect-[1/1]",
  "iphone-wallpaper": "aspect-[1179/2556]",
  "android-wallpaper": "aspect-[1080/2400]",
  "lock-screen": "aspect-[1170/2532]",
  "business-card": "aspect-[3.5/2]",
  "custom": "",
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
  pacifico: "font-pacifico",
  "great-vibes": "font-great-vibes",
  satisfy: "font-satisfy",
  caveat: "font-caveat",
  "permanent-marker": "font-permanent-marker",
  "shadows-into-light": "font-shadows-into-light",
  orbitron: "font-orbitron uppercase tracking-wider",
  rajdhani: "font-rajdhani",
  audiowide: "font-audiowide uppercase tracking-wider",
};

const themeStyles: Record<QuoteTheme, { bg: string; text: string; muted: string; border: string }> = {
  light: { bg: "#FFFFFF", text: "#1a1a1a", muted: "#888888", border: "#e5e5e5" },
  dark: { bg: "#1a1a1a", text: "#f5f5f0", muted: "#888888", border: "#333333" },
  cream: { bg: "#F5F0E8", text: "#2d2a26", muted: "#8a8477", border: "#e0d9cc" },
  ink: { bg: "#0d1117", text: "#c9d1d9", muted: "#6e7681", border: "#21262d" },
};

const shadowStylesBase: Record<TextShadow, string> = {
  none: "none",
  soft: "0 2px 8px rgba(0,0,0,{o0.3})",
  hard: "2px 2px 0px rgba(0,0,0,{o0.5})",
  glow: "0 0 12px rgba(255,255,255,{o0.6}), 0 0 24px rgba(255,255,255,{o0.3})",
  outline: "-1px -1px 0 rgba(0,0,0,{o0.4}), 1px -1px 0 rgba(0,0,0,{o0.4}), -1px 1px 0 rgba(0,0,0,{o0.4}), 1px 1px 0 rgba(0,0,0,{o0.4})",
  neon: "0 0 7px rgba(255,255,255,{o1}), 0 0 10px rgba(255,255,255,{o1}), 0 0 21px rgba(255,255,255,{o1}), 0 0 42px rgba(0,255,170,{o1}), 0 0 82px rgba(0,255,170,{o1}), 0 0 92px rgba(0,255,170,{o1})",
};

const getShadowStyle = (shadow: TextShadow, opacity: number): string => {
  if (shadow === "none") return "none";
  return shadowStylesBase[shadow].replace(/\{o([\d.]+)\}/g, (_, base) =>
    String(parseFloat(base) * opacity)
  );
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
  ({ quote, authorName, authorPhoto, photoShape = "circle", socials, socialPlatform, aspectRatio, font, theme, backgroundImage, backgroundOpacity, backgroundBlur = 0, backgroundFilter = "none", fontSize, textAlign, letterSpacing, lineHeight, textColor, authorFontSize, authorColor, authorFont, textShadow, shadowOpacity = 1, authorPosition, backgroundColor, isBold, isItalic, coloredWords, showWatermark, showQuotationMarks = false, customWidth, customHeight }, ref) => {
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
            className={`object-cover ${
              photoShape === "circle" ? "w-10 h-10 rounded-full" :
              photoShape === "square" ? "w-10 h-10 rounded-none" :
              photoShape === "rounded-square" ? "w-10 h-10 rounded-lg" :
              photoShape === "rectangle" ? "w-14 h-10 rounded-md" :
              photoShape === "oval" ? "w-12 h-10 rounded-full" :
              "w-10 h-10 rounded-full"
            }`}
            style={{
              border: `1px solid ${t.border}`,
              ...(photoShape === "hexagon" ? { clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", width: "2.5rem", height: "2.5rem", borderRadius: 0 } : {}),
            }}
          />
        )}
        <div className="flex flex-col">
          {authorName && (
            <span
              className={`${fontClasses[authorFont]} font-medium`}
              style={{
                fontSize: `${authorFontSize}rem`,
                color: authorColor || textColor || undefined,
                textShadow: getShadowStyle(textShadow, shadowOpacity),
              }}
            >
              {authorName}
            </span>
          )}
          {socials && (
            <span className="text-xs flex items-center gap-1" style={{ color: authorColor || textColor || t.text, whiteSpace: "nowrap" }}>
              {socialPlatform && (() => { const Icon = socialIcons[socialPlatform]; return <Icon size={12} />; })()}
              {socials}
            </span>
          )}
        </div>
      </div>
    ) : null;

    return (
      <div
        ref={ref}
        className={`${aspectRatio !== "custom" ? aspectClasses[aspectRatio] : ""} w-full max-w-lg max-h-full relative overflow-hidden`}
        style={{
          backgroundColor: backgroundColor || t.bg,
          color: t.text,
          ...(aspectRatio === "custom" && customWidth && customHeight ? { aspectRatio: `${customWidth} / ${customHeight}` } : {}),
        }}
      >
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              opacity: backgroundOpacity,
              filter: [
                backgroundBlur > 0 ? `blur(${backgroundBlur}px)` : "",
                BG_FILTERS.find(f => f.value === backgroundFilter)?.css || "",
              ].filter(Boolean).join(" ") || undefined,
              transform: backgroundBlur > 0 ? "scale(1.05)" : undefined,
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
                  textShadow: getShadowStyle(textShadow, shadowOpacity),
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
              className="absolute top-0 left-0 right-0 z-30 px-3 py-2 flex items-center justify-center gap-1.5 animate-fade-in"
              style={{
                backgroundColor: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span style={{ fontSize: "clamp(9px, 2.5%, 13px)", color: "#fbbf24", fontWeight: 600, whiteSpace: "nowrap" }}>
                ⚠ Text too large or too much text.
              </span>
            </div>
          )}
          {/* Watermark */}
          {showWatermark && (
            <div
              className="absolute bottom-0 right-0 z-20 font-heading"
              style={{
                margin: "clamp(8px, 3%, 16px)",
                padding: "clamp(2px, 0.8%, 5px) clamp(4px, 1.2%, 8px)",
                fontSize: "clamp(6px, 1.8%, 11px)",
                backgroundColor: "rgba(0,0,0,0.55)",
                color: "rgba(255,255,255,0.85)",
                borderRadius: "clamp(2px, 0.5%, 4px)",
                letterSpacing: "0.02em",
                lineHeight: 1.4,
              }}
            >
              <span>Made with </span>
              <span style={{ fontWeight: 600 }}>Lazy Faceless</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

QuotePreview.displayName = "QuotePreview";
export default QuotePreview;
