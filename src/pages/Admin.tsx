import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import QuotePreview, {
  type AspectRatio,
  type QuoteFont,
  type QuoteTheme,
  type TextShadow,
  type AuthorPosition,
  type SocialPlatform,
} from "@/components/QuotePreview";
import { Download, Trash2, LogOut, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const FONT_OPTIONS: { value: QuoteFont; label: string; preview: string }[] = [
  { value: "playfair", label: "Playfair", preview: "font-playfair" },
  { value: "cormorant", label: "Cormorant", preview: "font-cormorant" },
  { value: "lora", label: "Lora", preview: "font-lora" },
  { value: "merriweather", label: "Merriweather", preview: "font-merriweather" },
  { value: "crimson", label: "Crimson", preview: "font-crimson" },
  { value: "bebas", label: "Bebas", preview: "font-bebas" },
  { value: "oswald", label: "Oswald", preview: "font-oswald" },
  { value: "archivo", label: "Archivo", preview: "font-archivo" },
  { value: "heading", label: "Grotesk", preview: "font-heading" },
  { value: "inter", label: "Inter", preview: "font-inter" },
  { value: "raleway", label: "Raleway", preview: "font-raleway" },
  { value: "montserrat", label: "Montserrat", preview: "font-montserrat" },
  { value: "poppins", label: "Poppins", preview: "font-poppins" },
  { value: "dancing", label: "Dancing", preview: "font-dancing" },
  { value: "mono", label: "Mono", preview: "font-mono" },
];

const THEME_OPTIONS: { value: QuoteTheme; label: string; swatch: string }[] = [
  { value: "light", label: "Light", swatch: "#FFFFFF" },
  { value: "dark", label: "Dark", swatch: "#1a1a1a" },
  { value: "cream", label: "Cream", swatch: "#F5F0E8" },
  { value: "ink", label: "Ink", swatch: "#0d1117" },
];

const ASPECT_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: "square", label: "1:1" },
  { value: "3:4", label: "3:4" },
  { value: "9:16", label: "9:16" },
];

const SHADOW_OPTIONS: { value: TextShadow; label: string }[] = [
  { value: "none", label: "None" },
  { value: "soft", label: "Soft" },
  { value: "hard", label: "Hard" },
  { value: "glow", label: "Glow" },
  { value: "outline", label: "Outline" },
  { value: "neon", label: "Neon" },
];

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
  social_platform: string | null;
  website: string | null;
  author_photo_url: string | null;
  display_order: number | null;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Quote editor state
  const [quote, setQuote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [font, setFont] = useState<QuoteFont>("playfair");
  const [theme, setTheme] = useState<QuoteTheme>("dark");
  const [fontSize, setFontSize] = useState(1.4);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [textColor, setTextColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [textShadow, setTextShadow] = useState<TextShadow>("none");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [authorFontSize, setAuthorFontSize] = useState(0.875);
  const [authorColor, setAuthorColor] = useState("");
  const [authorFont, setAuthorFont] = useState<QuoteFont>("playfair");
  const [authorPosition, setAuthorPosition] = useState<AuthorPosition>("below-quote");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("square");
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.4);

  // Saved quotes
  const [savedQuotes, setSavedQuotes] = useState<SlideshowQuote[]>([]);
  const [saving, setSaving] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Load saved quotes
  useEffect(() => {
    if (isAdmin) {
      loadQuotes();
    }
  }, [isAdmin]);

  const loadQuotes = async () => {
    const { data } = await supabase
      .from("slideshow_quotes")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setSavedQuotes(data);
  };

  const handleSave = async () => {
    if (!quote.trim()) {
      toast.error("Please enter a quote");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("slideshow_quotes").insert({
      quote,
      author_name: authorName,
      font,
      theme,
      font_size: fontSize,
      text_align: textAlign,
      text_color: textColor,
      background_color: backgroundColor,
      text_shadow: textShadow,
      is_bold: isBold,
      is_italic: isItalic,
      letter_spacing: letterSpacing,
      line_height: lineHeight,
      author_font_size: authorFontSize,
      author_color: authorColor,
      author_font: authorFont,
      author_position: authorPosition,
      aspect_ratio: aspectRatio,
      background_opacity: backgroundOpacity,
      display_order: savedQuotes.length,
    });
    setSaving(false);
    if (error) {
      toast.error("Failed to save quote");
      console.error(error);
    } else {
      toast.success("Quote saved to slideshow!");
      setQuote("");
      setAuthorName("");
      loadQuotes();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("slideshow_quotes").delete().eq("id", id);
    if (!error) {
      toast.success("Quote deleted");
      loadQuotes();
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
      extraParams: { prompt: "select_account" },
    });
    if (result.error) {
      toast.error("Sign in failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-heading font-semibold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground text-sm">Sign in with Google to access admin panel</p>
          <button
            onClick={handleGoogleSignIn}
            className="px-6 py-3 bg-foreground text-background rounded-md font-heading text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign in with Google
          </button>
          <div className="pt-4">
            <button onClick={() => navigate("/")} className="text-xs text-muted-foreground hover:text-foreground">
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-heading font-semibold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground text-sm">You don't have admin privileges.</p>
          <button onClick={signOut} className="text-xs text-muted-foreground hover:text-foreground">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Admin — Slideshow Quotes
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{user.email}</span>
            <button onClick={signOut} className="p-2 hover:bg-accent rounded-md transition-colors">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 items-start">
          {/* Editor */}
          <div className="flex-1 min-w-0 space-y-4">
            <ControlSection label="Quote">
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Enter your quote..."
                rows={3}
                className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none font-body"
              />
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author name"
                className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 font-body"
              />
            </ControlSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ControlSection label="Font">
                <div className="flex flex-wrap gap-1.5">
                  {FONT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFont(opt.value)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-all ${opt.preview} ${
                        font === opt.value
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => setIsBold(!isBold)}
                    className={`px-2.5 py-1 text-xs rounded-md border font-bold ${
                      isBold ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"
                    }`}
                  >B</button>
                  <button
                    onClick={() => setIsItalic(!isItalic)}
                    className={`px-2.5 py-1 text-xs rounded-md border italic ${
                      isItalic ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"
                    }`}
                  >I</button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-8">Size</span>
                  <input type="range" min={0.8} max={6} step={0.05} value={fontSize} onChange={(e) => setFontSize(parseFloat(e.target.value))} className="flex-1 accent-foreground h-1" />
                  <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{fontSize.toFixed(1)}</span>
                </div>
              </ControlSection>

              <ControlSection label="Style">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {THEME_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setTheme(opt.value)}
                        className={`flex flex-col items-center gap-1 ${theme === opt.value ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                      >
                        <div className="w-8 h-8 rounded-full border border-border" style={{ backgroundColor: opt.swatch }} />
                        <span className="text-[9px] text-muted-foreground">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest">Shadow</span>
                    <div className="flex gap-1">
                      {SHADOW_OPTIONS.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => setTextShadow(s.value)}
                          className={`px-2 py-1 text-[10px] rounded border ${
                            textShadow === s.value ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest">Color</span>
                    <input type="color" value={textColor || "#000000"} onChange={(e) => setTextColor(e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer" />
                    <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setBackgroundColor(e.target.value)} className="w-6 h-6 rounded border border-border cursor-pointer" />
                    <span className="text-[9px] text-muted-foreground">text / bg</span>
                  </div>
                  <div className="flex gap-2">
                    {ASPECT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAspectRatio(opt.value)}
                        className={`px-2.5 py-1 text-xs rounded border ${
                          aspectRatio === opt.value ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </ControlSection>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-heading text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {saving ? "Saving..." : "Add to Slideshow"}
            </button>

            {/* Saved quotes list */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-heading font-semibold uppercase tracking-widest text-foreground">
                Slideshow Quotes ({savedQuotes.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {savedQuotes.map((sq) => (
                  <div key={sq.id} className="relative group">
                    <div className="w-full">
                      <QuotePreview
                        quote={sq.quote}
                        authorName={sq.author_name || ""}
                        authorPhoto={sq.author_photo_url || null}
                        socials={sq.socials || ""}
                        aspectRatio={(sq.aspect_ratio as AspectRatio) || "square"}
                        font={(sq.font as QuoteFont) || "playfair"}
                        theme={(sq.theme as QuoteTheme) || "dark"}
                        backgroundImage={sq.background_image_url || null}
                        backgroundOpacity={sq.background_opacity || 0.4}
                        fontSize={sq.font_size || 1.4}
                        textAlign={(sq.text_align as "left" | "center" | "right") || "center"}
                        letterSpacing={sq.letter_spacing || 0}
                        lineHeight={sq.line_height || 1.6}
                        textColor={sq.text_color || ""}
                        authorFontSize={sq.author_font_size || 0.875}
                        authorColor={sq.author_color || ""}
                        authorFont={(sq.author_font as QuoteFont) || "playfair"}
                        textShadow={(sq.text_shadow as TextShadow) || "none"}
                        authorPosition={(sq.author_position as AuthorPosition) || "below-quote"}
                        backgroundColor={sq.background_color || ""}
                        isBold={sq.is_bold || false}
                        isItalic={sq.is_italic || false}
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
                <QuotePreview
                  ref={previewRef}
                  quote={quote}
                  authorName={authorName}
                  authorPhoto={null}
                  socials=""
                  aspectRatio={aspectRatio}
                  font={font}
                  theme={theme}
                  backgroundImage={null}
                  backgroundOpacity={backgroundOpacity}
                  fontSize={fontSize}
                  textAlign={textAlign}
                  letterSpacing={letterSpacing}
                  lineHeight={lineHeight}
                  textColor={textColor}
                  authorFontSize={authorFontSize}
                  authorColor={authorColor}
                  authorFont={authorFont}
                  textShadow={textShadow}
                  authorPosition={authorPosition}
                  backgroundColor={backgroundColor}
                  isBold={isBold}
                  isItalic={isItalic}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ControlSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="border border-border rounded-lg p-4 space-y-2.5 bg-card">
    <label className="text-sm font-heading font-semibold uppercase tracking-widest text-foreground">{label}</label>
    {children}
  </div>
);

export default Admin;
