import { forwardRef, useRef, useEffect, useState } from "react";

export type AspectRatio = "square" | "3:4" | "2:3" | "9:16" | "1:2" | "4:3" | "3:2" | "16:9" | "2:1";
export type QuoteFont = "playfair" | "cormorant" | "bebas" | "mono" | "heading";
export type QuoteTheme = "light" | "dark" | "cream" | "ink";
export type TextShadow = "none" | "soft" | "hard" | "glow" | "outline";
export type AuthorPosition = "below-quote" | "bottom-left" | "bottom-center" | "bottom-right";

interface QuotePreviewProps {
  quote: string;
  authorName: string;
  authorPhoto: string | null;
  socials: string;
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
  playfair: "font-playfair italic",
  cormorant: "font-cormorant",
  bebas: "font-bebas tracking-wider uppercase",
  mono: "font-mono",
  heading: "font-heading font-semibold",
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
};

const QuotePreview = forwardRef<HTMLDivElement, QuotePreviewProps>(
  ({ quote, authorName, authorPhoto, socials, aspectRatio, font, theme, backgroundImage, backgroundOpacity, fontSize, textAlign, letterSpacing, lineHeight, textColor, authorFontSize, authorColor, authorFont, textShadow, authorPosition }, ref) => {
    const t = themeStyles[theme];
    const displayQuote = quote;
    const isPlaceholder = !quote;

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) { setScale(1); return; }

      content.style.transform = "scale(1)";
      content.style.transformOrigin = "top left";

      const cW = container.clientWidth;
      const cH = container.clientHeight;
      const tW = content.scrollWidth;
      const tH = content.scrollHeight;

      if (tW > 0 && tH > 0) {
        const s = Math.min(cW / tW, cH / tH, 1);
        setScale(s);
      } else {
        setScale(1);
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
            <span className="text-xs" style={{ color: t.muted }}>
              {socials}
            </span>
          )}
        </div>
      </div>
    ) : null;

    return (
      <div
        ref={ref}
        className={`${aspectClasses[aspectRatio]} w-full max-w-lg relative overflow-hidden flex flex-col`}
        style={{ backgroundColor: t.bg, color: t.text, borderRadius: "2px" }}
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
          <div className="absolute inset-0" style={{ backgroundColor: t.bg, opacity: 1 - backgroundOpacity }} />
        )}
        {/* Quote content */}
        <div ref={containerRef} className="flex-1 flex items-center justify-center p-8 sm:p-12 relative z-10 overflow-hidden">
          <div ref={contentRef} style={{ textAlign, maxWidth: "85%", transform: `scale(${scale})`, transformOrigin: "center center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <p
              className={`${fontClasses[font]} ${isPlaceholder ? "opacity-40" : ""} whitespace-pre-wrap`}
              style={{
                fontSize: `${fontSize}rem`,
                letterSpacing: `${letterSpacing}em`,
                lineHeight,
                color: textColor || undefined,
                textShadow: shadowStyles[textShadow],
              }}
            >
              &ldquo;{displayQuote}&rdquo;
            </p>
            {!isDetached && authorBlock}
          </div>
        </div>
        {/* Detached author positions */}
        {isDetached && authorBlock && (
          <div className="px-8 pb-6 sm:px-12 sm:pb-8 relative z-10">
            {authorBlock}
          </div>
        )}
      </div>
    );
  }
);

QuotePreview.displayName = "QuotePreview";
export default QuotePreview;
