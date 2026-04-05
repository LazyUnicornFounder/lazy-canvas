import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import QuotePreview, {
  type QuoteFont,
  type QuoteTheme,
  type TextShadow,
  type AuthorPosition,
} from "@/components/QuotePreview";

interface GalleryQuote {
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

const QuoteGallery = ({ hideWrapper = false }: { hideWrapper?: boolean }) => {
  const [quotes, setQuotes] = useState<GalleryQuote[]>([]);

  useEffect(() => {
    supabase
      .from("slideshow_quotes")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data) setQuotes(data);
      });
  }, []);

  if (quotes.length === 0) return null;

  const grid = (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {quotes.map((q) => (
        <div key={q.id} className="rounded-lg overflow-hidden border border-border">
          <QuotePreview
            quote={q.quote}
            authorName={q.author_name || ""}
            authorPhoto={q.author_photo_url || null}
            socials={q.socials || ""}
            aspectRatio="square"
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
            coloredWords={Array.isArray(q.colored_words) ? q.colored_words : []}
          />
        </div>
      ))}
    </div>
  );

  if (hideWrapper) return grid;

  return (
    <section className="border-t border-border px-4 sm:px-6 py-12">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground mb-8">
          Gallery
        </h2>
        {grid}
      </div>
    </section>
  );
};

export default QuoteGallery;
