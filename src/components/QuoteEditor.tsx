import { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, X, Upload, Smile, Plus, Palette, Rainbow } from "lucide-react";
import { EMOJI_CATEGORIES } from "@/data/emojis";
import type {
  AspectRatio,
  QuoteFont,
  QuoteTheme,
  TextShadow,
  AuthorPosition,
  SocialPlatform,
} from "@/components/QuotePreview";
import type { ColoredWord } from "@/components/QuotePreview";

const ASPECT_OPTIONS: { value: AspectRatio; label: string; row: number }[] = [
  { value: "square", label: "1:1", row: 0 },
  { value: "3:4", label: "3:4", row: 0 },
  { value: "2:3", label: "2:3", row: 0 },
  { value: "9:16", label: "9:16", row: 0 },
  { value: "1:2", label: "1:2", row: 0 },
  { value: "4:3", label: "4:3", row: 1 },
  { value: "3:2", label: "3:2", row: 1 },
  { value: "16:9", label: "16:9", row: 1 },
  { value: "2:1", label: "2:1", row: 1 },
];

const SERIF_FONTS: { value: QuoteFont; label: string; preview: string }[] = [
  { value: "playfair", label: "Playfair", preview: "font-playfair" },
  { value: "cormorant", label: "Cormorant", preview: "font-cormorant" },
  { value: "lora", label: "Lora", preview: "font-lora" },
  { value: "merriweather", label: "Merriweather", preview: "font-merriweather" },
  { value: "crimson", label: "Crimson", preview: "font-crimson" },
  { value: "dancing", label: "Dancing", preview: "font-dancing" },
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

const FONT_OPTIONS = [...SERIF_FONTS, ...SANS_FONTS];

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
  aspectRatio: AspectRatio;
  font: QuoteFont;
  theme: QuoteTheme;
  backgroundImage: string | null;
  backgroundOpacity: number;
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
  authorPosition: AuthorPosition;
  isBold: boolean;
  isItalic: boolean;
  coloredWords: ColoredWord[];
}


export const DEFAULT_EDITOR_STATE: QuoteEditorState = {
  quote: "",
  authorName: "",
  socialPlatform: "instagram",
  socialUsername: "",
  website: "",
  authorPhoto: null,
  aspectRatio: "square",
  font: "playfair",
  theme: "light",
  backgroundImage: null,
  backgroundOpacity: 0.4,
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
  authorPosition: "below-quote",
  isBold: false,
  isItalic: false,
  coloredWords: [],
};

interface QuoteEditorProps {
  state: QuoteEditorState;
  onChange: (state: QuoteEditorState) => void;
}

const QuoteEditor = ({ state, onChange }: QuoteEditorProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState(0);
  const quoteTextareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

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
      {/* Quote */}
      <div className="md:col-span-2">
        <ControlSection label="Quote">
          <div className="relative">
            <textarea
              ref={quoteTextareaRef}
              value={state.quote}
              onChange={(e) => set("quote", e.target.value)}
              placeholder="Start typing..."
              rows={3}
              className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none font-body"
            />
            <div className="absolute bottom-2 right-2">
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

      {/* Word Colors */}
      <div className="md:col-span-2">
        <ControlSection label="Word Colors">
          <p className="text-[10px] text-muted-foreground mb-2">
            Color specific words or phrases in your quote.
          </p>
          <div className="space-y-2">
            {state.coloredWords.map((cw, i) => (
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
        <div className="flex gap-3">
          <div className="flex-1 space-y-3">
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
          <div className="flex-shrink-0">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            {state.authorPhoto ? (
              <div className="relative group">
                <img src={state.authorPhoto} alt="Author" className="w-[4.5rem] h-[4.5rem] rounded-full object-cover border border-border" />
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
                className="w-[4.5rem] h-[4.5rem] rounded-full border-2 border-dashed border-muted-foreground/40 flex flex-col items-center justify-center hover:border-foreground/50 transition-colors gap-0.5"
              >
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-[8px] font-heading text-muted-foreground uppercase tracking-wider">Photo</span>
              </button>
            )}
          </div>
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

      {/* Format */}
      <ControlSection label="Format">
        <div className="grid grid-cols-5 gap-1.5">
          {ASPECT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => set("aspectRatio", opt.value)}
              className={`px-2 py-2 text-xs font-heading font-medium rounded-md border transition-all ${
                state.aspectRatio === opt.value
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              } ${opt.value === "square" ? "col-span-1 row-span-2" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </ControlSection>

      {/* Theme */}
      <ControlSection label="Theme">
        <div className="flex gap-3">
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

      {/* Background */}
      <ControlSection label="Background">
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
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Opacity</span>
              <input type="range" min={0.1} max={1} step={0.05} value={state.backgroundOpacity} onChange={(e) => set("backgroundOpacity", parseFloat(e.target.value))} className="flex-1 accent-foreground h-1" />
            </div>
          )}
        </div>
      </ControlSection>
    </div>
  );
};

const ControlSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="border border-border rounded-lg p-4 space-y-2.5 bg-card">
    <label className="text-sm font-heading font-semibold uppercase tracking-widest text-foreground">{label}</label>
    {children}
  </div>
);

export default QuoteEditor;
