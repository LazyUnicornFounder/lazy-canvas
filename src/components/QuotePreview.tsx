import { forwardRef } from "react";

export type AspectRatio = "vertical" | "square" | "landscape";
export type QuoteFont = "playfair" | "cormorant" | "bebas" | "mono" | "heading";
export type QuoteTheme = "light" | "dark" | "cream" | "ink";

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
}

const aspectClasses: Record<AspectRatio, string> = {
  vertical: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
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

const QuotePreview = forwardRef<HTMLDivElement, QuotePreviewProps>(
  ({ quote, authorName, authorPhoto, socials, aspectRatio, font, theme, backgroundImage, backgroundOpacity, fontSize, textAlign, letterSpacing, lineHeight, textColor }, ref) => {
    const t = themeStyles[theme];
    const displayQuote = quote;
    const isPlaceholder = !quote;

    return (
      <div
        ref={ref}
        className={`${aspectClasses[aspectRatio]} w-full max-w-lg relative overflow-hidden flex flex-col justify-between`}
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
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative z-10">
          <div style={{ textAlign, maxWidth: "85%" }}>
            <p
              className={`${fontClasses[font]} ${isPlaceholder ? "opacity-40" : ""}`}
              style={{
                fontSize: `${fontSize}rem`,
                letterSpacing: `${letterSpacing}em`,
                lineHeight,
                color: textColor || undefined,
              }}
            >
              &ldquo;{displayQuote}&rdquo;
            </p>
          </div>
        </div>

        {/* Author section */}
        <div
          className="flex items-center gap-3 px-8 pb-6 sm:px-12 sm:pb-8 relative z-10"
          style={{ paddingTop: "1.25rem" }}
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
              <span className="font-heading text-sm font-medium tracking-wide">
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
      </div>
    );
  }
);

QuotePreview.displayName = "QuotePreview";
export default QuotePreview;
