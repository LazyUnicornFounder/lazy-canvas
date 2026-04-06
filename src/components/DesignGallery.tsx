import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DesignPreview, {
  type AspectRatio,
  type DesignFont,
  type DesignTheme,
  type TextShadow,
  type AuthorPosition,
  type ColoredWord,
} from "@/components/DesignPreview";

interface GalleryDesign {
  id: string;
  quote: string;
  author_name: string;
  font: string;
  theme: string;
  aspect_ratio: string;
  text_color: string;
  background_color: string;
  font_size: number;
  text_align: string;
  letter_spacing: number;
  line_height: number;
  author_font_size: number;
  author_color: string;
  author_font: string;
  text_shadow: string;
  author_position: string;
  is_bold: boolean;
  is_italic: boolean;
  background_opacity: number;
  background_image_url: string | null;
  socials: string;
  author_photo_url: string | null;
  colored_words: ColoredWord[];
  show_quotation_marks: boolean;
}

function editorStateToGalleryDesign(id: string, state: any): GalleryDesign {
  return {
    id,
    quote: state.quote || "",
    author_name: state.authorName || "",
    font: state.font || "playfair",
    theme: state.theme || "dark",
    aspect_ratio: state.aspectRatio || "square",
    text_color: state.textColor || "",
    background_color: state.backgroundColor || "",
    font_size: state.fontSize || 1.4,
    text_align: state.textAlign || "center",
    letter_spacing: state.letterSpacing || 0,
    line_height: state.lineHeight || 1.6,
    author_font_size: state.authorFontSize || 0.875,
    author_color: state.authorColor || "",
    author_font: state.authorFont || "playfair",
    text_shadow: state.textShadow || "none",
    author_position: state.authorPosition || "below-quote",
    is_bold: state.isBold || false,
    is_italic: state.isItalic || false,
    background_opacity: state.backgroundOpacity || 0.4,
    background_image_url: state.backgroundImage || null,
    socials: "",
    author_photo_url: state.authorPhoto || null,
    colored_words: Array.isArray(state.coloredWords) ? state.coloredWords : [],
    show_quotation_marks: state.showQuotationMarks || false,
  };
}

const DesignGallery = ({ hideWrapper = false }: { hideWrapper?: boolean }) => {
  const [quotes, setQuotes] = useState<GalleryDesign[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [slideshowRes, submissionsRes] = await Promise.all([
        supabase.from("slideshow_quotes").select("*").order("display_order", { ascending: true }),
        supabase.from("gallery_submissions").select("*").eq("status", "approved").order("created_at", { ascending: false }),
      ]);

      const slideshowDesigns: GalleryDesign[] = (slideshowRes.data || []).map((q: any) => ({
        id: q.id,
        quote: q.quote,
        author_name: q.author_name || "",
        font: q.font || "playfair",
        theme: q.theme || "dark",
        aspect_ratio: q.aspect_ratio || "square",
        text_color: q.text_color || "",
        background_color: q.background_color || "",
        font_size: q.font_size || 1.4,
        text_align: q.text_align || "center",
        letter_spacing: q.letter_spacing || 0,
        line_height: q.line_height || 1.6,
        author_font_size: q.author_font_size || 0.875,
        author_color: q.author_color || "",
        author_font: q.author_font || "playfair",
        text_shadow: q.text_shadow || "none",
        author_position: q.author_position || "below-quote",
        is_bold: q.is_bold || false,
        is_italic: q.is_italic || false,
        background_opacity: q.background_opacity || 0.4,
        background_image_url: q.background_image_url || null,
        socials: q.socials || "",
        author_photo_url: q.author_photo_url || null,
        colored_words: Array.isArray(q.colored_words) ? q.colored_words : [],
        show_quotation_marks: false,
      }));

      const communityDesigns: GalleryDesign[] = (submissionsRes.data || []).map((s: any) =>
        editorStateToGalleryDesign(s.id, s.editor_state || {})
      );

      setQuotes([...slideshowDesigns, ...communityDesigns]);
    };

    fetchAll();
  }, []);

  if (quotes.length === 0) {
    const empty = (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground text-sm">Coming soon — be the first to share a design!</p>
      </div>
    );
    if (hideWrapper) return empty;
    return (
      <section className="border-t border-border px-4 sm:px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground mb-8">Gallery</h2>
          {empty}
        </div>
      </section>
    );
  }

  const grid = (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {quotes.map((q) => (
        <div key={q.id} className="rounded-lg overflow-hidden border border-border">
          <DesignPreview
            quote={q.quote}
            authorName={q.author_name}
            authorPhoto={q.author_photo_url}
            socials={q.socials}
            aspectRatio="square"
            font={(q.font as DesignFont) || "playfair"}
            theme={(q.theme as DesignTheme) || "dark"}
            backgroundImage={q.background_image_url}
            backgroundOpacity={q.background_opacity}
            fontSize={q.font_size}
            textAlign={(q.text_align as "left" | "center" | "right") || "center"}
            letterSpacing={q.letter_spacing}
            lineHeight={q.line_height}
            textColor={q.text_color}
            authorFontSize={q.author_font_size}
            authorColor={q.author_color}
            authorFont={(q.author_font as DesignFont) || "playfair"}
            textShadow={(q.text_shadow as TextShadow) || "none"}
            authorPosition={(q.author_position as AuthorPosition) || "below-quote"}
            backgroundColor={q.background_color}
            isBold={q.is_bold}
            isItalic={q.is_italic}
            coloredWords={q.colored_words}
            showQuotationMarks={q.show_quotation_marks}
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

export default DesignGallery;
