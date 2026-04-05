import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import QuotePreview, {
  type AspectRatio,
  type QuoteFont,
  type QuoteTheme,
  type TextShadow,
  type AuthorPosition,
} from "@/components/QuotePreview";

interface SlideshowQuote {
  id: string;
  quote: string;
  author_name: string | null;
  font: string | null;
  theme: string | null;
  aspect_ratio: string | null;
  text_color: string | null;
  background_color: string | null;
  font_size: number | null;
  text_align: string | null;
  letter_spacing: number | null;
  line_height: number | null;
  author_font_size: number | null;
  author_color: string | null;
  author_font: string | null;
  text_shadow: string | null;
  author_position: string | null;
  is_bold: boolean | null;
  is_italic: boolean | null;
  background_opacity: number | null;
  background_image_url: string | null;
  socials: string | null;
  author_photo_url: string | null;
  colored_words: any | null;
}

const HeroSlideshow = () => {
  const [quotes, setQuotes] = useState<SlideshowQuote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    supabase
      .from("slideshow_quotes")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setQuotes(data);
      });
  }, []);

  useEffect(() => {
    if (quotes.length <= 1) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % quotes.length);
        setFade(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  if (quotes.length === 0) {
    return (
      <div className="aspect-square w-full max-w-md bg-card border border-border rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground text-sm italic">Quotes coming soon...</p>
      </div>
    );
  }

  const q = quotes[currentIndex];

  return (
    <div
      className="w-full max-w-md transition-opacity duration-400"
      style={{ opacity: fade ? 1 : 0 }}
    >
      <div className="shadow-2xl rounded-lg overflow-hidden">
        <QuotePreview
          quote={q.quote}
          authorName={q.author_name || ""}
          authorPhoto={q.author_photo_url || null}
          socials={q.socials || ""}
          aspectRatio={(q.aspect_ratio as AspectRatio) || "square"}
          font={(q.font as QuoteFont) || "playfair"}
          theme={(q.theme as QuoteTheme) || "dark"}
          backgroundImage={q.background_image_url || null}
          backgroundOpacity={q.background_opacity || 0.4}
          fontSize={q.font_size || 1.4}
          textAlign={(q.text_align as "left" | "center" | "right") || "center"}
          letterSpacing={q.letter_spacing || 0}
          lineHeight={q.line_height || 1.6}
          textColor={q.text_color || ""}
          authorFontSize={q.author_font_size || 0.875}
          authorColor={q.author_color || ""}
          authorFont={(q.author_font as QuoteFont) || "playfair"}
          textShadow={(q.text_shadow as TextShadow) || "none"}
          authorPosition={(q.author_position as AuthorPosition) || "below-quote"}
          backgroundColor={q.background_color || ""}
          isBold={q.is_bold || false}
          isItalic={q.is_italic || false}
          coloredWords={Array.isArray(q.colored_words) ? q.colored_words as any : []}
        />
      </div>
    </div>
  );
};

export default HeroSlideshow;
