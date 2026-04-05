import { useState, useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import { Download, Image as ImageIcon, X, Upload, Smile } from "lucide-react";
import QuotePreview, {
  type AspectRatio,
  type QuoteFont,
  type QuoteTheme,
  type TextShadow,
  type AuthorPosition,
  type SocialPlatform,
} from "@/components/QuotePreview";

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
import { EMOJI_CATEGORIES } from "@/data/emojis";

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

const Index = () => {
  const [quote, setQuote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [socialPlatform, setSocialPlatform] = useState<string>("instagram");
  const [socialUsername, setSocialUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [authorPhoto, setAuthorPhoto] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("square");
  const [font, setFont] = useState<QuoteFont>("playfair");
  const [theme, setTheme] = useState<QuoteTheme>("light");
  const [downloading, setDownloading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.4);
  const [backgroundColor, setBackgroundColor] = useState("");
  const [fontSize, setFontSize] = useState(1.4);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [textColor, setTextColor] = useState("");
  const [authorFontSize, setAuthorFontSize] = useState(0.875);
  const [authorColor, setAuthorColor] = useState("");
  const [authorFont, setAuthorFont] = useState<QuoteFont>("playfair");
  const [textShadow, setTextShadow] = useState<TextShadow>("none");
  const [authorPosition, setAuthorPosition] = useState<AuthorPosition>("below-quote");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState(0);

  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const quoteTextareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const insertEmoji = (emoji: string) => {
    const textarea = quoteTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = quote.slice(0, start) + emoji + quote.slice(end);
      setQuote(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setQuote(quote + emoji);
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
    reader.onload = (ev) => setBackgroundImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAuthorPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `quote-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      console.error("Failed to export");
    } finally {
      setDownloading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Lazy Quotes
          </h1>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-heading text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Exporting…" : "Download"}
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex gap-6 items-start">
          {/* Controls - two columns */}
          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quote */}
            <div className="md:col-span-2">
            <ControlSection label="Quote">
              <div className="relative">
                <textarea
                  ref={quoteTextareaRef}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="The only way to do great work is to love what you do."
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
              <div className="flex flex-wrap gap-2">
                {FONT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFont(opt.value)}
                    className={`px-4 py-2 text-sm rounded-md border transition-all ${opt.preview} ${
                      font === opt.value
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setIsBold(!isBold)}
                  className={`px-3 py-1.5 text-sm rounded-md border font-bold transition-all ${
                    isBold
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  B
                </button>
                <button
                  onClick={() => setIsItalic(!isItalic)}
                  className={`px-3 py-1.5 text-sm rounded-md border italic transition-all ${
                    isItalic
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  I
                </button>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-10">Size</span>
                <input
                  type="range"
                  min={0.8}
                  max={6}
                  step={0.05}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseFloat(e.target.value))}
                  className="flex-1 accent-foreground h-1"
                />
                <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{fontSize.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Spacing</span>
                <input
                  type="range"
                  min={-0.05}
                  max={0.3}
                  step={0.005}
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                  className="flex-1 accent-foreground h-1"
                />
                <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{letterSpacing.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Leading</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={lineHeight}
                  onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                  className="flex-1 accent-foreground h-1"
                />
                <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{lineHeight.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Color</span>
                <input
                  type="color"
                  value={textColor || "#1a1a1a"}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded-md border border-border cursor-pointer bg-transparent"
                />
                {textColor && (
                  <button
                    onClick={() => setTextColor("")}
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Shadow</span>
                <div className="flex gap-1.5">
                  {(["none", "soft", "hard", "glow", "outline"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setTextShadow(s)}
                      className={`px-3 py-1.5 text-[10px] font-heading font-medium rounded-md border transition-all capitalize ${
                        textShadow === s
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
                      onClick={() => setTextAlign(a)}
                      className={`px-3 py-1.5 text-[10px] font-heading font-medium rounded-md border transition-all capitalize ${
                        textAlign === a
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

            {/* Author */}
            <ControlSection label="Author">
              <div className="flex gap-3">
                <div className="flex-1 space-y-3">
                  <input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 font-body"
                  />
                  <div className="flex gap-2">
                    <select
                      value={socialPlatform}
                      onChange={(e) => setSocialPlatform(e.target.value)}
                      className="bg-transparent border border-border rounded-md px-2 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 font-body"
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value} className="bg-card">
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <input
                      value={socialUsername}
                      onChange={(e) => setSocialUsername(e.target.value)}
                      placeholder="username"
                      className="flex-1 bg-transparent border border-border rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 font-body"
                    />
                  </div>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="website.com"
                    className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 font-body"
                  />
                </div>
                {/* Photo upload */}
                <div className="flex-shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {authorPhoto ? (
                    <div className="relative group">
                      <img
                        src={authorPhoto}
                        alt="Author"
                        className="w-[4.5rem] h-[4.5rem] rounded-full object-cover border border-border"
                      />
                      <button
                        onClick={() => setAuthorPhoto(null)}
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
              {/* Author font controls */}
              <div className="flex flex-wrap gap-2 mt-3">
                {FONT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAuthorFont(opt.value)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-all ${opt.preview} ${
                      authorFont === opt.value
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-10">Size</span>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.05}
                  value={authorFontSize}
                  onChange={(e) => setAuthorFontSize(parseFloat(e.target.value))}
                  className="flex-1 accent-foreground h-1"
                />
                <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{authorFontSize.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Color</span>
                <input
                  type="color"
                  value={authorColor || "#1a1a1a"}
                  onChange={(e) => setAuthorColor(e.target.value)}
                  className="w-8 h-8 rounded-md border border-border cursor-pointer bg-transparent"
                />
                {authorColor && (
                  <button
                    onClick={() => setAuthorColor("")}
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Reset
                  </button>
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
                      onClick={() => setAuthorPosition(pos.value)}
                      className={`px-3 py-1.5 text-[10px] font-heading font-medium rounded-md border transition-all ${
                        authorPosition === pos.value
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
                    onClick={() => setAspectRatio(opt.value)}
                    className={`px-2 py-2 text-xs font-heading font-medium rounded-md border transition-all ${
                      aspectRatio === opt.value
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
                    onClick={() => setTheme(opt.value)}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        theme === opt.value
                          ? "border-foreground scale-110"
                          : "border-border group-hover:border-foreground/30"
                      }`}
                      style={{ backgroundColor: opt.swatch }}
                    />
                    <span className="text-[10px] font-heading text-muted-foreground">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </ControlSection>

            {/* Background */}
            <ControlSection label="Background">
              <input
                ref={bgInputRef}
                type="file"
                accept="image/*"
                onChange={handleBgUpload}
                className="hidden"
              />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Color</span>
                  <input
                    type="color"
                    value={backgroundColor || "#ffffff"}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-8 h-8 rounded-md border border-border cursor-pointer bg-transparent"
                  />
                  {backgroundColor && (
                    <button
                      onClick={() => setBackgroundColor("")}
                      className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => bgInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-heading font-medium rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {backgroundImage ? "Change image" : "Upload image"}
                  </button>
                  {backgroundImage && (
                    <button
                      onClick={() => setBackgroundImage(null)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {backgroundImage && (
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-14">Opacity</span>
                    <input
                      type="range"
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={backgroundOpacity}
                      onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))}
                      className="flex-1 accent-foreground h-1"
                    />
                  </div>
                )}
              </div>
            </ControlSection>
          </div>

          {/* Preview */}
          <div className="hidden lg:block sticky top-4 flex-shrink-0" style={{ width: "clamp(280px, 28vw, 400px)" }}>
            <div className="flex justify-center items-start" style={{ maxHeight: "calc(100vh - 4rem)" }}>
              <div
                className="shadow-xl"
                style={{
                  width: "100%",
                  maxWidth: (() => {
                    const ratioMap: Record<string, number> = {
                      "square": 1, "3:4": 3/4, "2:3": 2/3, "9:16": 9/16, "1:2": 1/2,
                      "4:3": 4/3, "3:2": 3/2, "16:9": 16/9, "2:1": 2/1,
                    };
                    const ratio = ratioMap[aspectRatio] || 1;
                    if (ratio <= 1) {
                      return `min(32rem, calc((100vh - 4rem) * ${ratio}))`;
                    }
                    return "32rem";
                  })(),
                }}
              >
                <QuotePreview
                  ref={previewRef}
                  quote={quote}
                  authorName={authorName}
                  authorPhoto={authorPhoto}
                  socialPlatform={socialUsername ? socialPlatform as SocialPlatform : undefined}
                  socials={[
                    socialUsername ? `${SOCIAL_PLATFORMS.find(p => p.value === socialPlatform)?.prefix || ""}${socialUsername}` : "",
                    website,
                  ].filter(Boolean).join(" · ")}
                  aspectRatio={aspectRatio}
                  font={font}
                  theme={theme}
                  backgroundImage={backgroundImage}
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

const ControlSection = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="border border-border rounded-lg p-4 space-y-2.5 bg-card">
    <label className="text-sm font-heading font-semibold uppercase tracking-widest text-foreground">
      {label}
    </label>
    {children}
  </div>
);

export default Index;
