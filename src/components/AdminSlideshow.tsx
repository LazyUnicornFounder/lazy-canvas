import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DesignPreview, {
  type AspectRatio,
  type DesignFont,
  type DesignTheme,
  type TextShadow,
  type AuthorPosition,
  type SocialPlatform,
} from "@/components/DesignPreview";
import DesignEditor, {
  type DesignEditorState,
  DEFAULT_EDITOR_STATE,
  SOCIAL_PLATFORMS,
} from "@/components/DesignEditor";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface SlideshowDesign {
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
  social_platform: string | null;
  website: string | null;
  author_photo_url: string | null;
  display_order: number | null;
  colored_words: any | null;
}

const AdminSlideshow = () => {
  const [editorState, setEditorState] = useState<DesignEditorState>(DEFAULT_EDITOR_STATE);
  const [savedDesigns, setSavedQuotes] = useState<SlideshowDesign[]>([]);
  const [saving, setSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    const { data } = await supabase
      .from("slideshow_quotes")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setSavedQuotes(data);
  };

  const handleSave = async () => {
    if (!editorState.quote.trim()) {
      toast.error("Please enter a design");
      return;
    }
    setSaving(true);

    const socials = [
      editorState.socialUsername
        ? `${SOCIAL_PLATFORMS.find((p) => p.value === editorState.socialPlatform)?.prefix || ""}${editorState.socialUsername}`
        : "",
      editorState.website,
    ].filter(Boolean).join(" · ");

    const { error } = await supabase.from("slideshow_quotes").insert({
      quote: editorState.quote,
      author_name: editorState.authorName,
      font: editorState.font,
      theme: editorState.theme,
      font_size: editorState.fontSize,
      text_align: editorState.textAlign,
      text_color: editorState.textColor,
      background_color: editorState.backgroundColor,
      text_shadow: editorState.textShadow,
      is_bold: editorState.isBold,
      is_italic: editorState.isItalic,
      letter_spacing: editorState.letterSpacing,
      line_height: editorState.lineHeight,
      author_font_size: editorState.authorFontSize,
      author_color: editorState.authorColor,
      author_font: editorState.authorFont,
      author_position: editorState.authorPosition,
      aspect_ratio: editorState.aspectRatio,
      background_opacity: editorState.backgroundOpacity,
      socials,
      social_platform: editorState.socialPlatform,
      website: editorState.website,
      display_order: savedDesigns.length,
      colored_words: editorState.coloredWords.length ? JSON.parse(JSON.stringify(editorState.coloredWords)) : [],
    });
    setSaving(false);
    if (error) {
      toast.error("Failed to save design");
      console.error(error);
    } else {
      toast.success("Design saved to slideshow!");
      setEditorState(DEFAULT_EDITOR_STATE);
      loadDesigns();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("slideshow_quotes").delete().eq("id", id);
    if (!error) {
      toast.success("Design deleted");
      loadDesigns();
    }
  };

  const socials = [
    editorState.socialUsername
      ? `${SOCIAL_PLATFORMS.find((p) => p.value === editorState.socialPlatform)?.prefix || ""}${editorState.socialUsername}`
      : "",
    editorState.website,
  ].filter(Boolean).join(" · ");

  return (
    <div className="flex gap-6 items-start">
      <div className="flex-1 min-w-0 space-y-4">
        <DesignEditor state={editorState} onChange={setEditorState} />

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-heading text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {saving ? "Saving..." : "Add to Slideshow"}
        </button>

        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-heading font-semibold uppercase tracking-widest text-foreground">
            Slideshow Designs ({savedDesigns.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {savedDesigns.map((sq) => (
              <div key={sq.id} className="relative group">
                <div className="w-full">
                  <DesignPreview
                    quote={sq.quote}
                    authorName={sq.author_name || ""}
                    authorPhoto={sq.author_photo_url || null}
                    socials={sq.socials || ""}
                    aspectRatio={(sq.aspect_ratio as AspectRatio) || "square"}
                    font={(sq.font as DesignFont) || "playfair"}
                    theme={(sq.theme as DesignTheme) || "dark"}
                    backgroundImage={sq.background_image_url || null}
                    backgroundOpacity={sq.background_opacity || 0.4}
                    fontSize={sq.font_size || 1.4}
                    textAlign={(sq.text_align as "left" | "center" | "right") || "center"}
                    letterSpacing={sq.letter_spacing || 0}
                    lineHeight={sq.line_height || 1.6}
                    textColor={sq.text_color || ""}
                    authorFontSize={sq.author_font_size || 0.875}
                    authorColor={sq.author_color || ""}
                    authorFont={(sq.author_font as DesignFont) || "playfair"}
                    textShadow={(sq.text_shadow as TextShadow) || "none"}
                    authorPosition={(sq.author_position as AuthorPosition) || "below-quote"}
                    backgroundColor={sq.background_color || ""}
                    isBold={sq.is_bold || false}
                    isItalic={sq.is_italic || false}
                    coloredWords={Array.isArray(sq.colored_words) ? sq.colored_words as any : []}
                  />
                </div>
                <button
                  onClick={() => handleDelete(sq.id)}
                  className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="hidden lg:block sticky top-4 flex-shrink-0" style={{ width: "clamp(280px, 28vw, 400px)" }}>
        <div className="flex justify-center items-start">
          <div className="shadow-xl w-full">
            <DesignPreview
              ref={previewRef}
              quote={editorState.quote}
              authorName={editorState.authorName}
              authorPhoto={editorState.authorPhoto}
              socialPlatform={editorState.socialUsername ? editorState.socialPlatform as SocialPlatform : undefined}
              socials={socials}
              aspectRatio={editorState.aspectRatio}
              font={editorState.font}
              theme={editorState.theme}
              backgroundImage={editorState.backgroundImage}
              backgroundOpacity={editorState.backgroundOpacity}
              backgroundBlur={editorState.backgroundBlur}
              backgroundFilter={editorState.backgroundFilter}
              fontSize={editorState.fontSize}
              textAlign={editorState.textAlign}
              letterSpacing={editorState.letterSpacing}
              lineHeight={editorState.lineHeight}
              textColor={editorState.textColor}
              authorFontSize={editorState.authorFontSize}
              authorColor={editorState.authorColor}
              authorFont={editorState.authorFont}
              textShadow={editorState.textShadow}
              authorPosition={editorState.authorPosition}
              backgroundColor={editorState.backgroundColor}
              isBold={editorState.isBold}
              isItalic={editorState.isItalic}
              coloredWords={editorState.coloredWords}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSlideshow;
