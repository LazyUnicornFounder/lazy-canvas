import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, X, Upload, Smile, Plus, Palette, Rainbow, LayoutGrid, Eraser, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EMOJI_CATEGORIES } from "@/data/emojis";
import TemplateLibrary from "@/components/TemplateLibrary";
import type {
  AspectRatio,
  QuoteFont,
  QuoteTheme,
  TextShadow,
  AuthorPosition,
  SocialPlatform,
} from "@/components/QuotePreview";
import type { ColoredWord } from "@/components/QuotePreview";

const DIGITAL_FORMAT_GROUPS: { label: string; options: { value: AspectRatio; label: string }[] }[] = [
  {
    label: "Instagram",
    options: [
      { value: "square", label: "Post" },
      { value: "9:16", label: "Story/Reel" },
      { value: "1.91:1", label: "Landscape" },
    ],
  },
  {
    label: "X (Twitter)",
    options: [
      { value: "16:9", label: "Post" },
      { value: "3:1", label: "Header" },
    ],
  },
  {
    label: "LinkedIn",
    options: [
      { value: "square", label: "Post" },
      { value: "1.91:1", label: "Landscape" },
      { value: "4:1", label: "Banner" },
    ],
  },
  {
    label: "Facebook",
    options: [
      { value: "1.91:1", label: "Post" },
      { value: "9:16", label: "Story" },
      { value: "820:312", label: "Cover" },
    ],
  },
  {
    label: "YouTube",
    options: [
      { value: "16:9", label: "Thumbnail" },
    ],
  },
  {
    label: "TikTok",
    options: [
      { value: "9:16", label: "Video" },
    ],
  },
  {
    label: "Pinterest",
    options: [
      { value: "2:3", label: "Pin" },
    ],
  },
  {
    label: "General",
    options: [
      { value: "square", label: "1:1" },
      { value: "3:4", label: "3:4" },
      { value: "2:3", label: "2:3" },
      { value: "9:16", label: "9:16" },
      { value: "1:2", label: "1:2" },
      { value: "4:3", label: "4:3" },
      { value: "3:2", label: "3:2" },
      { value: "16:9", label: "16:9" },
      { value: "2:1", label: "2:1" },
    ],
  },
  {
    label: "App Store",
    options: [
      { value: "ios-screenshot", label: "iPhone" },
      { value: "ios-ipad", label: "iPad" },
      { value: "android-phone", label: "Android" },
      { value: "android-tablet", label: "Tablet" },
      { value: "mac-screenshot", label: "Mac" },
      { value: "app-icon", label: "Icon" },
    ],
  },
  {
    label: "Phone Backgrounds",
    options: [
      { value: "iphone-wallpaper", label: "iPhone" },
      { value: "android-wallpaper", label: "Android" },
      { value: "lock-screen", label: "Lock Screen" },
    ],
  },
];

const PHYSICAL_FORMAT_GROUPS: { label: string; options: { value: AspectRatio; label: string }[] }[] = [
  {
    label: "A-Series",
    options: [
      { value: "a0", label: "A0" },
      { value: "a1", label: "A1" },
      { value: "a2", label: "A2" },
      { value: "a3", label: "A3" },
      { value: "a4", label: "A4" },
    ],
  },
  {
    label: "Print",
    options: [
      { value: "letter", label: "Letter" },
      { value: "legal", label: "Legal" },
      { value: "tabloid", label: "Tabloid" },
    ],
  },
  {
    label: "Poster",
    options: [
      { value: "poster-18x24", label: "18×24" },
      { value: "poster-24x36", label: "24×36" },
      { value: "banner-2x5", label: "Banner" },
    ],
  },
];

const SERIF_FONTS: { value: QuoteFont; label: string; preview: string }[] = [
  { value: "playfair", label: "Playfair", preview: "font-playfair" },
  { value: "cormorant", label: "Cormorant", preview: "font-cormorant" },
  { value: "lora", label: "Lora", preview: "font-lora" },
  { value: "merriweather", label: "Merriweather", preview: "font-merriweather" },
  { value: "crimson", label: "Crimson", preview: "font-crimson" },
];

const SANS_FONTS: { value: QuoteFont; label: string; preview: string }[] = [
  { value: "heading", label: "Grotesk", preview: "font-heading" },
  { value: "inter", label: "Inter", preview: "font-inter" },
  { value: "raleway", label: "Raleway", preview: "font-raleway" },
  { value: "montserrat", label: "Montserrat", preview: "font-montserrat" },
  { value: "poppins", label: "Poppins", preview: "font-poppins" },
  { value: "oswald", label: "Oswald", preview: "font-oswald" },
  { value: "bebas", label: "Bebas", preview: "font-bebas" },
  { value: "archivo", label: "Archivo", preview: "font-archivo" },
  { value: "mono", label: "Mono", preview: "font-mono" },
];

const CURSIVE_FONTS: { value: QuoteFont; label: string; preview: string }[] = [
  { value: "dancing", label: "Dancing", preview: "font-dancing" },
  { value: "pacifico", label: "Pacifico", preview: "font-pacifico" },
  { value: "great-vibes", label: "Great Vibes", preview: "font-great-vibes" },
  { value: "satisfy", label: "Satisfy", preview: "font-satisfy" },
  { value: "caveat", label: "Caveat", preview: "font-caveat" },
  { value: "permanent-marker", label: "Marker", preview: "font-permanent-marker" },
  { value: "shadows-into-light", label: "Shadows", preview: "font-shadows-into-light" },
];

const FUTURISTIC_FONTS: { value: QuoteFont; label: string; preview: string }[] = [
  { value: "orbitron", label: "Orbitron", preview: "font-orbitron" },
  { value: "rajdhani", label: "Rajdhani", preview: "font-rajdhani" },
  { value: "audiowide", label: "Audiowide", preview: "font-audiowide" },
];

const FONT_OPTIONS = [...SERIF_FONTS, ...SANS_FONTS, ...CURSIVE_FONTS, ...FUTURISTIC_FONTS];

const THEME_OPTIONS: { value: QuoteTheme; label: string; swatch: string }[] = [
  { value: "light", label: "Light", swatch: "#FFFFFF" },
  { value: "dark", label: "Dark", swatch: "#1a1a1a" },
  { value: "cream", label: "Cream", swatch: "#F5F0E8" },
  { value: "ink", label: "Ink", swatch: "#0d1117" },
];

const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram", prefix: "@" },
  { value: "twitter", label: "X", prefix: "@" },
  { value: "tiktok", label: "TikTok", prefix: "@" },
  { value: "youtube", label: "YouTube", prefix: "@" },
  { value: "linkedin", label: "LinkedIn", prefix: "" },
  { value: "threads", label: "Threads", prefix: "@" },
  { value: "bluesky", label: "Bluesky", prefix: "@" },
  { value: "facebook", label: "Facebook", prefix: "" },
  { value: "pinterest", label: "Pinterest", prefix: "@" },
  { value: "snapchat", label: "Snapchat", prefix: "@" },
];

export { SOCIAL_PLATFORMS };

export interface QuoteEditorState {
  quote: string;
  authorName: string;
  socialPlatform: string;
  socialUsername: string;
  website: string;
  authorPhoto: string | null;
  photoShape: "circle" | "square" | "rectangle" | "rounded-square" | "oval" | "hexagon";
  aspectRatio: AspectRatio;
  font: QuoteFont;
  theme: QuoteTheme;
  backgroundImage: string | null;
  backgroundOpacity: number;
  backgroundBlur: number;
  backgroundFilter: string;
  backgroundColor: string;
  fontSize: number;
  textAlign: "left" | "center" | "right";
  letterSpacing: number;
  lineHeight: number;
  textColor: string;
  authorFontSize: number;
  authorColor: string;
  authorFont: QuoteFont;
  textShadow: TextShadow;
  shadowOpacity: number;
  authorPosition: AuthorPosition;
  isBold: boolean;
  isItalic: boolean;
  coloredWords: ColoredWord[];
  showQuotationMarks: boolean;
  customWidth: number;
  customHeight: number;
}

export const BG_FILTERS: { value: string; label: string; css: string }[] = [
  { value: "none", label: "None", css: "" },
  { value: "vintage", label: "Vintage", css: "sepia(0.4) contrast(1.1) brightness(0.95) saturate(0.8)" },
  { value: "film", label: "Film", css: "contrast(1.15) brightness(0.9) saturate(0.85) sepia(0.15)" },
  { value: "noir", label: "Noir", css: "grayscale(1) contrast(1.2) brightness(0.9)" },
  { value: "warm", label: "Warm", css: "sepia(0.25) saturate(1.3) brightness(1.05)" },
  { value: "cool", label: "Cool", css: "saturate(0.8) brightness(1.05) hue-rotate(15deg)" },
  { value: "faded", label: "Faded", css: "contrast(0.85) brightness(1.1) saturate(0.6)" },
  { value: "vivid", label: "Vivid", css: "saturate(1.6) contrast(1.1)" },
  { value: "dramatic", label: "Dramatic", css: "contrast(1.4) brightness(0.85) saturate(1.2)" },
];


export const DEFAULT_EDITOR_STATE: QuoteEditorState = {
  quote: "",
  authorName: "",
  socialPlatform: "instagram",
  socialUsername: "",
  website: "",
  authorPhoto: null,
  photoShape: "circle",
  aspectRatio: "square",
  font: "playfair",
  theme: "light",
  backgroundImage: null,
  backgroundOpacity: 0.4,
  backgroundBlur: 0,
  backgroundFilter: "none",
  backgroundColor: "",
  fontSize: 1.4,
  textAlign: "center",
  letterSpacing: 0,
  lineHeight: 1.6,
  textColor: "",
  authorFontSize: 0.875,
  authorColor: "",
  authorFont: "playfair",
  textShadow: "none",
  shadowOpacity: 1,
  authorPosition: "below-quote",
  isBold: false,
  isItalic: false,
  coloredWords: [],
  showQuotationMarks: false,
  customWidth: 1080,
  customHeight: 1080,
};

interface QuoteEditorProps {
  state: QuoteEditorState;
  onChange: (state: QuoteEditorState) => void;
  isPro?: boolean;
}

const QuoteEditor = ({ state: rawState, onChange, isPro = false }: QuoteEditorProps) => {
  // Normalize state to handle old saved states missing new fields
  const state: QuoteEditorState = { ...DEFAULT_EDITOR_STATE, ...rawState, coloredWords: rawState.coloredWords || [], photoShape: rawState.photoShape || "circle" };
  const navigate = useNavigate();
  const goToPricing = () => navigate("/pricing");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState(0);
  const quoteTextareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const [removingBg, setRemovingBg] = useState(false);

  const handleRemoveBg = async () => {
    if (!state.authorPhoto) return;
    setRemovingBg(true);
    try {
      const { data, error } = await supabase.functions.invoke("remove-background", {
        body: { imageBase64: state.authorPhoto },
      });
      if (error) throw error;
      if (data?.imageUrl) {
        set("authorPhoto", data.imageUrl);
      } else {
        throw new Error("No image returned");
      }
    } catch (err) {
      console.error("Remove bg error:", err);
      import("sonner").then(({ toast }) => toast.error("Failed to remove background. Try again."));
    } finally {
      setRemovingBg(false);
    }
  };

  const set = <K extends keyof QuoteEditorState>(key: K, value: QuoteEditorState[K]) => {
    onChange({ ...state, [key]: value });
  };

  const insertEmoji = (emoji: string) => {
    const textarea = quoteTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = state.quote.slice(0, start) + emoji + state.quote.slice(end);
      set("quote", newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      set("quote", state.quote + emoji);
    }
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("backgroundImage", ev.target?.result as string);
    reader.readAsDataURL(file);
  };


  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("authorPhoto", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Templates */}
      <div className="md:col-span-2">
        <ControlSection label="Templates" pro={!isPro} onProClick={goToPricing}>
          <TemplateLibrary
            onApply={(partial) => {
              onChange({
                ...state,
                ...partial,
                socialPlatform: state.socialPlatform,
                socialUsername: state.socialUsername,
                website: state.website,
                authorPhoto: state.authorPhoto,
              });
            }}
            backgroundOpacity={state.backgroundOpacity}
            onOpacityChange={(v) => set("backgroundOpacity", v)}
          />
        </ControlSection>
      </div>

      {/* Background — PRO */}
      <div>
      <ControlSection label="Background" pro={!isPro} onProClick={goToPricing}>
        <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Color</span>
            <input type="color" value={state.backgroundColor || "#ffffff"} onChange={(e) => set("backgroundColor", e.target.value)} className="w-8 h-8 rounded-md border border-border cursor-pointer bg-transparent" />
            {state.backgroundColor && (
              <button onClick={() => set("backgroundColor", "")} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Reset</button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => bgInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-heading font-medium rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              {state.backgroundImage ? "Change image" : "Upload image"}
            </button>
            {state.backgroundImage && (
              <button onClick={() => set("backgroundImage", null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Remove</button>
            )}
          </div>
          {state.backgroundImage && (
            <>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Opacity</span>
                <input type="range" min={0.1} max={1} step={0.05} value={state.backgroundOpacity} onChange={(e) => set("backgroundOpacity", parseFloat(e.target.value))} className="flex-1 accent-foreground h-1" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Blur</span>
                <input type="range" min={0} max={20} step={1} value={state.backgroundBlur} onChange={(e) => set("backgroundBlur", parseFloat(e.target.value))} className="flex-1 accent-foreground h-1" />
              </div>
              <div>
                <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest mb-1.5 block">Filter</span>
                <div className="flex flex-wrap gap-1.5">
                  {BG_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => set("backgroundFilter", f.value)}
                      className={`px-2.5 py-1 text-[10px] font-heading font-medium rounded-md border transition-all ${
                        state.backgroundFilter === f.value
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ControlSection>
      </div>

      {/* Theme */}
      <ControlSection label="Theme">
        <div className="flex flex-wrap gap-3">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => set("theme", opt.value)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  state.theme === opt.value
                    ? "border-foreground scale-110"
                    : "border-border group-hover:border-foreground/30"
                }`}
                style={{ backgroundColor: opt.swatch }}
              />
              <span className="text-[10px] font-heading text-muted-foreground">{opt.label}</span>
            </button>
          ))}
        </div>
      </ControlSection>
      {/* Quote */}
      <div className="md:col-span-2">
        <ControlSection label="Text">
          <div className="relative">
            <textarea
              ref={quoteTextareaRef}
              value={state.quote}
              onChange={(e) => set("quote", e.target.value)}
              placeholder="Start typing..."
              rows={3}
              className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none font-body"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-0.5">
              <button
                onClick={() => set("showQuotationMarks", !state.showQuotationMarks)}
                className={`p-1.5 rounded-md transition-colors text-xs font-bold select-none ${state.showQuotationMarks ? "bg-accent text-foreground" : "hover:bg-accent text-muted-foreground"}`}
                type="button"
                title={state.showQuotationMarks ? "Remove quotation marks" : "Add quotation marks"}
              >
                &ldquo;&rdquo;
              </button>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 rounded-md hover:bg-accent transition-colors"
                type="button"
              >
                <Smile className="w-4 h-4 text-muted-foreground" />
              </button>
              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-8 right-0 bg-card border border-border rounded-lg shadow-xl z-50 w-72">
                  <div className="flex gap-1 px-2 pt-2 pb-1 border-b border-border overflow-x-auto">
                    {EMOJI_CATEGORIES.map((cat, i) => (
                      <button
                        key={i}
                        onClick={() => setEmojiCategory(i)}
                        className={`text-base p-1 rounded transition-colors flex-shrink-0 ${emojiCategory === i ? "bg-accent" : "hover:bg-accent/50"}`}
                        type="button"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-8 gap-1 p-2 max-h-52 overflow-y-auto">
                    {EMOJI_CATEGORIES[emojiCategory].emojis.map((emoji, i) => (
                      <button
                        key={`${emoji}-${i}`}
                        onClick={() => insertEmoji(emoji)}
                        className="w-7 h-7 flex items-center justify-center text-base hover:bg-accent rounded transition-colors"
                        type="button"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ControlSection>
      </div>

      {/* Font */}
      <div className="md:col-span-2">
        <ControlSection label="Font">
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">Serif</p>
            <div className="flex flex-wrap gap-2">
              {SERIF_FONTS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("font", opt.value)}
                  className={`px-4 py-2 text-sm rounded-md border transition-all ${opt.preview} ${
                    state.font === opt.value
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider pt-1">Sans-serif</p>
            <div className="flex flex-wrap gap-2">
              {SANS_FONTS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("font", opt.value)}
                  className={`px-4 py-2 text-sm rounded-md border transition-all ${opt.preview} ${
                    state.font === opt.value
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider pt-1">Cursive</p>
            <div className="flex flex-wrap gap-2">
              {CURSIVE_FONTS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("font", opt.value)}
                  className={`px-4 py-2 text-sm rounded-md border transition-all ${opt.preview} ${
                    state.font === opt.value
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider pt-1">Futuristic</p>
            <div className="flex flex-wrap gap-2">
              {FUTURISTIC_FONTS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("font", opt.value)}
                  className={`px-4 py-2 text-sm rounded-md border transition-all ${opt.preview} ${
                    state.font === opt.value
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => set("isBold", !state.isBold)}
              className={`px-3 py-1.5 text-sm rounded-md border font-bold transition-all ${
                state.isBold
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              B
            </button>
            <button
              onClick={() => set("isItalic", !state.isItalic)}
              className={`px-3 py-1.5 text-sm rounded-md border italic transition-all ${
                state.isItalic
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              I
            </button>
            <button
              onClick={() => set("showQuotationMarks", !state.showQuotationMarks)}
              className={`px-3 py-1.5 text-sm rounded-md border font-playfair transition-all ${
                state.showQuotationMarks
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
              title="Quotation marks"
            >
              &ldquo;&rdquo;
            </button>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-10">Size</span>
            <input type="range" min={0.8} max={6} step={0.05} value={state.fontSize} onChange={(e) => set("fontSize", parseFloat(e.target.value))} className="flex-1 accent-foreground h-1" />
            <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{state.fontSize.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Spacing</span>
            <input type="range" min={-0.05} max={0.3} step={0.005} value={state.letterSpacing} onChange={(e) => set("letterSpacing", parseFloat(e.target.value))} className="flex-1 accent-foreground h-1" />
            <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{state.letterSpacing.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Leading</span>
            <input type="range" min={1} max={3} step={0.05} value={state.lineHeight} onChange={(e) => set("lineHeight", parseFloat(e.target.value))} className="flex-1 accent-foreground h-1" />
            <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{state.lineHeight.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Color</span>
            <input type="color" value={state.textColor || "#1a1a1a"} onChange={(e) => set("textColor", e.target.value)} className="w-8 h-8 rounded-md border border-border cursor-pointer bg-transparent" />
            {state.textColor && (
              <button onClick={() => set("textColor", "")} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Reset</button>
            )}
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Shadow</span>
            <div className="flex gap-1.5">
              {(["none", "soft", "hard", "glow", "outline"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => set("textShadow", s)}
                  className={`px-3 py-1.5 text-[10px] font-heading font-medium rounded-md border transition-all capitalize ${
                    state.textShadow === s
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {state.textShadow !== "none" && (
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Opacity</span>
              <input type="range" min={0.1} max={1} step={0.05} value={state.shadowOpacity} onChange={(e) => set("shadowOpacity", parseFloat(e.target.value))} className="flex-1 accent-foreground h-1" />
              <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{(state.shadowOpacity * 100).toFixed(0)}%</span>
            </div>
          )}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Align</span>
            <div className="flex gap-1.5">
              {(["left", "center", "right"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => set("textAlign", a)}
                  className={`px-3 py-1.5 text-[10px] font-heading font-medium rounded-md border transition-all capitalize ${
                    state.textAlign === a
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </ControlSection>
      </div>

      {/* Word Colors — PRO */}
      <div className="md:col-span-2">
        <ControlSection label="Word Colors" pro={!isPro} onProClick={goToPricing}>
          <p className="text-[10px] text-muted-foreground mb-2">
            Color specific words or phrases in your quote.
          </p>
          <div className="space-y-2">
            {(state.coloredWords || []).map((cw, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={cw.text}
                  onChange={(e) => {
                    const updated = [...state.coloredWords];
                    updated[i] = { ...updated[i], text: e.target.value };
                    set("coloredWords", updated);
                  }}
                  placeholder="Word or phrase"
                  className="flex-1 bg-transparent border border-border rounded-md px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 font-body"
                />
                {cw.color === "rainbow" ? (
                  <div
                    className="w-8 h-8 rounded-md border border-border cursor-pointer flex items-center justify-center"
                    style={{ background: "linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00cc00, #0088ff, #8800ff)" }}
                    onClick={() => {
                      const updated = [...state.coloredWords];
                      updated[i] = { ...updated[i], color: "#ff0000" };
                      set("coloredWords", updated);
                    }}
                    title="Switch to solid color"
                  />
                ) : (
                  <input
                    type="color"
                    value={cw.color}
                    onChange={(e) => {
                      const updated = [...state.coloredWords];
                      updated[i] = { ...updated[i], color: e.target.value };
                      set("coloredWords", updated);
                    }}
                    className="w-8 h-8 rounded-md border border-border cursor-pointer bg-transparent"
                  />
                )}
                <button
                  onClick={() => {
                    const updated = [...state.coloredWords];
                    updated[i] = { ...updated[i], color: cw.color === "rainbow" ? "#ff0000" : "rainbow" };
                    set("coloredWords", updated);
                  }}
                  className={`p-1.5 rounded-md border text-[10px] transition-all ${
                    cw.color === "rainbow"
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                  title="Rainbow / multicolor"
                >
                  <Rainbow className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const updated = state.coloredWords.filter((_, j) => j !== i);
                    set("coloredWords", updated);
                  }}
                  className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => set("coloredWords", [...state.coloredWords, { text: "", color: "#ff0000" }])}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-medium rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
              type="button"
            >
              <Plus className="w-3 h-3" />
              Add colored word
            </button>
          </div>
        </ControlSection>
      </div>

      {/* Author */}
      <ControlSection label="Author">
        <div className="space-y-3">
          <input
            value={state.authorName}
            onChange={(e) => set("authorName", e.target.value)}
            placeholder="Your name"
            className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 font-body"
          />
          <div className="flex gap-2">
            <select
              value={state.socialPlatform}
              onChange={(e) => set("socialPlatform", e.target.value)}
              className="bg-transparent border border-border rounded-md px-2 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 font-body"
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p.value} value={p.value} className="bg-card">{p.label}</option>
              ))}
            </select>
            <input
              value={state.socialUsername}
              onChange={(e) => set("socialUsername", e.target.value)}
              placeholder="username"
              className="flex-1 bg-transparent border border-border rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 font-body"
            />
          </div>
          <input
            value={state.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="website.com"
            className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 font-body"
          />
        </div>
        <div className="space-y-2 mt-3">
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">Serif</p>
          <div className="flex flex-wrap gap-2">
            {SERIF_FONTS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => set("authorFont", opt.value)}
                className={`px-3 py-1.5 text-xs rounded-md border transition-all ${opt.preview} ${
                  state.authorFont === opt.value
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider pt-1">Sans-serif</p>
          <div className="flex flex-wrap gap-2">
            {SANS_FONTS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => set("authorFont", opt.value)}
                className={`px-3 py-1.5 text-xs rounded-md border transition-all ${opt.preview} ${
                  state.authorFont === opt.value
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider pt-1">Cursive</p>
          <div className="flex flex-wrap gap-2">
            {CURSIVE_FONTS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => set("authorFont", opt.value)}
                className={`px-3 py-1.5 text-xs rounded-md border transition-all ${opt.preview} ${
                  state.authorFont === opt.value
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider pt-1">Futuristic</p>
          <div className="flex flex-wrap gap-2">
            {FUTURISTIC_FONTS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => set("authorFont", opt.value)}
                className={`px-3 py-1.5 text-xs rounded-md border transition-all ${opt.preview} ${
                  state.authorFont === opt.value
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-10">Size</span>
          <input type="range" min={0.5} max={3} step={0.05} value={state.authorFontSize} onChange={(e) => set("authorFontSize", parseFloat(e.target.value))} className="flex-1 accent-foreground h-1" />
          <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{state.authorFontSize.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Color</span>
          <input type="color" value={state.authorColor || "#1a1a1a"} onChange={(e) => set("authorColor", e.target.value)} className="w-8 h-8 rounded-md border border-border cursor-pointer bg-transparent" />
          {state.authorColor && (
            <button onClick={() => set("authorColor", "")} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">Reset</button>
          )}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Position</span>
          <div className="flex flex-wrap gap-1.5">
            {([
              { value: "below-quote" as const, label: "Below Quote" },
              { value: "bottom-left" as const, label: "Bottom Left" },
              { value: "bottom-center" as const, label: "Bottom Center" },
              { value: "bottom-right" as const, label: "Bottom Right" },
            ]).map((pos) => (
              <button
                key={pos.value}
                onClick={() => set("authorPosition", pos.value)}
                className={`px-3 py-1.5 text-[10px] font-heading font-medium rounded-md border transition-all ${
                  state.authorPosition === pos.value
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>
      </ControlSection>

      {/* Photo */}
      <ControlSection label="Photo">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {state.authorPhoto ? (
              <div className="relative group">
                <img
                  src={state.authorPhoto}
                  alt="Author"
                  className={`w-16 h-16 object-cover border border-border ${
                    state.photoShape === "circle" ? "rounded-full" :
                    state.photoShape === "square" ? "rounded-none" :
                    state.photoShape === "rounded-square" ? "rounded-lg" :
                    state.photoShape === "oval" ? "rounded-full" :
                    state.photoShape === "hexagon" ? "rounded-lg" :
                    "rounded-md"
                  }`}
                  style={{
                    ...(state.photoShape === "rectangle" ? { width: "5rem", height: "3.5rem" } : {}),
                    ...(state.photoShape === "oval" ? { width: "4.5rem", height: "3.5rem" } : {}),
                    ...(state.photoShape === "hexagon" ? { clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" } : {}),
                  }}
                />
                <button
                  onClick={() => set("authorPhoto", null)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/40 flex flex-col items-center justify-center hover:border-foreground/50 transition-colors gap-0.5"
              >
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-[8px] font-heading text-muted-foreground uppercase tracking-wider">Upload</span>
              </button>
            )}
            {state.authorPhoto && (
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-heading text-muted-foreground hover:text-foreground transition-colors"
                >
                  Change
                </button>
                <button
                  onClick={handleRemoveBg}
                  disabled={removingBg}
                  className="flex items-center gap-1 text-xs font-heading text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {removingBg ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eraser className="w-3 h-3" />}
                  {removingBg ? "Removing…" : "Remove BG"}
                </button>
              </div>
            )}
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mb-1.5">Shape</p>
            <div className="flex flex-wrap gap-2">
              {([
                { value: "circle" as const, label: "Circle", preview: "rounded-full", w: 32, h: 32 },
                { value: "square" as const, label: "Square", preview: "rounded-none", w: 32, h: 32 },
                { value: "rounded-square" as const, label: "Rounded", preview: "rounded-lg", w: 32, h: 32 },
                { value: "rectangle" as const, label: "Rectangle", preview: "rounded-md", w: 40, h: 28 },
                { value: "oval" as const, label: "Oval", preview: "rounded-full", w: 36, h: 28 },
                { value: "hexagon" as const, label: "Hexagon", preview: "rounded-none", w: 32, h: 32 },
              ]).map((shape) => (
                <button
                  key={shape.value}
                  onClick={() => set("photoShape", shape.value)}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-md border transition-all ${
                    state.photoShape === shape.value
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                  title={shape.label}
                >
                  <div
                    className={`border bg-muted-foreground/20 ${
                      state.photoShape === shape.value ? "border-foreground" : "border-muted-foreground/40"
                    } ${shape.value === "circle" || shape.value === "oval" ? "rounded-full" :
                        shape.value === "rounded-square" ? "rounded-lg" :
                        shape.value === "hexagon" ? "rounded-none" : "rounded-none"}`}
                    style={{
                      width: shape.w,
                      height: shape.h,
                      ...(shape.value === "hexagon" ? { clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" } : {}),
                    }}
                  />
                  <span className={`text-[9px] font-heading ${state.photoShape === shape.value ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                    {shape.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ControlSection>

      <div className="space-y-4 md:col-span-2">
        <ControlSection label="Format" pro={!isPro} onProClick={goToPricing}>
          {[
            { heading: "Digital", groups: DIGITAL_FORMAT_GROUPS },
            { heading: "Physical", groups: PHYSICAL_FORMAT_GROUPS },
          ].map(({ heading, groups }, sectionIdx) => (
            <div key={heading}>
              {sectionIdx > 0 && <hr className="my-3 border-border" />}
              <p className="text-[11px] font-heading font-semibold text-foreground uppercase tracking-wider mb-2">{heading}</p>
              <div className="space-y-3">
                {groups.map((group) => (
                  <div key={group.label}>
                    <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mb-1.5">{group.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((opt) => {
                        const ratioMap: Record<string, [number, number]> = {
                          square: [1, 1],
                          "1.91:1": [1.91, 1], "3:1": [3, 1], "4:1": [4, 1], "820:312": [820, 312],
                          a4: [210, 297], a3: [297, 420], a2: [420, 594], a1: [594, 841], a0: [841, 1189],
                          letter: [8.5, 11], legal: [8.5, 14], tabloid: [11, 17],
                          "poster-18x24": [18, 24], "poster-24x36": [24, 36], "banner-2x5": [2, 5],
                          "ios-screenshot": [1290, 2796], "ios-ipad": [2048, 2732], "android-phone": [1080, 1920],
                          "android-tablet": [1920, 1200], "mac-screenshot": [2880, 1800], "app-icon": [1, 1],
                          "iphone-wallpaper": [1179, 2556], "android-wallpaper": [1080, 2400], "lock-screen": [1170, 2532],
                        };
                        const sizeMap: Record<string, string> = {
                          square: "1080 × 1080 px",
                          "9:16": "1080 × 1920 px",
                          "1.91:1": "1200 × 628 px",
                          "16:9": "1920 × 1080 px",
                          "3:1": "1500 × 500 px",
                          "4:1": "1584 × 396 px",
                          "820:312": "820 × 312 px",
                          "2:3": "1000 × 1500 px",
                          "3:4": "1080 × 1440 px",
                          "4:3": "1440 × 1080 px",
                          "3:2": "1500 × 1000 px",
                          "1:2": "1080 × 2160 px",
                          "2:1": "2160 × 1080 px",
                          a4: "21 × 29.7 cm",
                          a3: "29.7 × 42 cm",
                          a2: "42 × 59.4 cm",
                          a1: "59.4 × 84.1 cm",
                          a0: "84.1 × 118.9 cm",
                          letter: "8.5 × 11 in",
                          legal: "8.5 × 14 in",
                          tabloid: "11 × 17 in",
                          "poster-18x24": "5400 × 7200 px",
                          "poster-24x36": "7200 × 10800 px",
                          "banner-2x5": "3600 × 9000 px",
                          "ios-screenshot": "1290 × 2796 px",
                          "ios-ipad": "2048 × 2732 px",
                          "android-phone": "1080 × 1920 px",
                          "android-tablet": "1920 × 1200 px",
                          "mac-screenshot": "2880 × 1800 px",
                          "app-icon": "1024 × 1024 px",
                          "iphone-wallpaper": "1179 × 2556 px",
                          "android-wallpaper": "1080 × 2400 px",
                          "lock-screen": "1170 × 2532 px",
                        };
                        const [w, h] = ratioMap[opt.value] || opt.value.split(":").map(Number);
                        // For A-series, vary the icon size to reflect physical size differences
                        const physicalScaleMap: Record<string, number> = {
                          a0: 1, a1: 0.85, a2: 0.7, a3: 0.58, a4: 0.48,
                          tabloid: 0.85, legal: 0.7, letter: 0.6,
                          "poster-24x36": 1, "poster-18x24": 0.8, "banner-2x5": 1,
                        };
                        const physicalScale = physicalScaleMap[opt.value] || 1;
                        const maxDim = 36;
                        const scale = (maxDim / Math.max(w, h)) * physicalScale;
                        const boxW = Math.max(8, Math.round(w * scale));
                        const boxH = Math.max(8, Math.round(h * scale));
                        const isActive = state.aspectRatio === opt.value;
                        const sizeLabel = sizeMap[opt.value] || opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => set("aspectRatio", opt.value)}
                            className={`flex flex-col items-center gap-1 p-1.5 rounded-md border transition-all ${
                              isActive
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/30"
                            }`}
                            title={`${opt.label} — ${sizeLabel}`}
                          >
                            <div
                              className={`border ${isActive ? "border-foreground bg-foreground/10" : "border-muted-foreground/40"}`}
                              style={{ width: boxW, height: boxH }}
                            />
                            <span className={`text-[9px] font-heading ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Custom Size */}
          <hr className="my-3 border-border" />
          <p className="text-[11px] font-heading font-semibold text-foreground uppercase tracking-wider mb-2">Custom</p>
          <div className="flex items-end gap-2">
            <button
              onClick={() => set("aspectRatio", "custom")}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-md border transition-all ${
                state.aspectRatio === "custom"
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/30"
              }`}
              title={`Custom — ${state.customWidth} × ${state.customHeight} px`}
            >
              <div
                className={`border ${state.aspectRatio === "custom" ? "border-foreground bg-foreground/10" : "border-muted-foreground/40"}`}
                style={{
                  width: Math.round((state.customWidth / Math.max(state.customWidth, state.customHeight)) * 36),
                  height: Math.round((state.customHeight / Math.max(state.customWidth, state.customHeight)) * 36),
                }}
              />
              <span className={`text-[9px] font-heading ${state.aspectRatio === "custom" ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                Custom
              </span>
            </button>
            <div className="flex-1 flex gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">W (px)</label>
                <input
                  type="number"
                  min={1}
                  value={state.customWidth}
                  onChange={(e) => { set("customWidth", Math.max(1, parseInt(e.target.value) || 1)); set("aspectRatio", "custom"); }}
                  className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">H (px)</label>
                <input
                  type="number"
                  min={1}
                  value={state.customHeight}
                  onChange={(e) => { set("customHeight", Math.max(1, parseInt(e.target.value) || 1)); set("aspectRatio", "custom"); }}
                  className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
            </div>
          </div>
        </ControlSection>
      </div>

      {/* Unit Calculator */}
      <div className="md:col-span-2">
        <ControlSection label="Calculator">
          <UnitCalculator />
        </ControlSection>
      </div>


    </div>
  );
};

const UNIT_OPTIONS = [
  { value: "px", label: "Pixels" },
  { value: "cm", label: "Centimeters" },
  { value: "in", label: "Inches" },
  { value: "mm", label: "Millimeters" },
] as const;

type Unit = typeof UNIT_OPTIONS[number]["value"];

const convertUnit = (value: number, from: Unit, to: Unit, dpi: number): number => {
  // Convert to pixels first
  let px = value;
  if (from === "cm") px = value * dpi / 2.54;
  else if (from === "in") px = value * dpi;
  else if (from === "mm") px = value * dpi / 25.4;

  // Convert from pixels to target
  if (to === "px") return Math.round(px * 100) / 100;
  if (to === "cm") return Math.round(px * 2.54 / dpi * 100) / 100;
  if (to === "in") return Math.round(px / dpi * 100) / 100;
  if (to === "mm") return Math.round(px * 25.4 / dpi * 100) / 100;
  return value;
};

const UnitCalculator = () => {
  const [inputValue, setInputValue] = useState("1080");
  const [fromUnit, setFromUnit] = useState<Unit>("px");
  const [toUnit, setToUnit] = useState<Unit>("cm");
  const [dpi, setDpi] = useState("300");

  const numValue = parseFloat(inputValue) || 0;
  const numDpi = parseInt(dpi) || 300;
  const result = convertUnit(numValue, fromUnit, toUnit, numDpi);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Value</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">From</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as Unit)}
            className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20"
          >
            {UNIT_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>
        <span className="text-muted-foreground text-sm pb-1.5">→</span>
        <div className="flex-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">To</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value as Unit)}
            className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20"
          >
            {UNIT_OPTIONS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2 items-end">
        <div className="w-24">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">DPI</label>
          <input
            type="number"
            value={dpi}
            onChange={(e) => setDpi(e.target.value)}
            className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>
        <div className="flex-1 px-3 py-1.5 bg-foreground/5 border border-border rounded-md">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Result</span>
          <p className="text-sm font-heading font-semibold text-foreground">{result} {toUnit}</p>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground">Convert between pixels, centimeters, inches, and millimeters. DPI affects physical size conversions.</p>
    </div>
  );
};

const ControlSection = ({ label, children, pro = false }: { label: string; children: React.ReactNode; pro?: boolean; onProClick?: () => void }) => (
  <div className="border border-border rounded-lg p-4 space-y-2.5 bg-card">
    <div className="flex items-center gap-2">
      <label className="text-sm font-heading font-semibold uppercase tracking-widest text-foreground">{label}</label>
      {pro && (
        <span className="px-1.5 py-0.5 text-[9px] font-heading font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded">
          Pro
        </span>
      )}
    </div>
    {children}
  </div>
);

export default QuoteEditor;
