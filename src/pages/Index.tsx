import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Image as ImageIcon, X, Upload } from "lucide-react";
import QuotePreview, {
  type AspectRatio,
  type QuoteFont,
  type QuoteTheme,
} from "@/components/QuotePreview";

const ASPECT_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: "vertical", label: "3:4" },
  { value: "square", label: "1:1" },
  { value: "landscape", label: "4:3" },
];

const FONT_OPTIONS: { value: QuoteFont; label: string; preview: string }[] = [
  { value: "playfair", label: "Playfair", preview: "font-playfair italic" },
  { value: "cormorant", label: "Cormorant", preview: "font-cormorant" },
  { value: "bebas", label: "Bebas", preview: "font-bebas" },
  { value: "mono", label: "Mono", preview: "font-mono" },
  { value: "heading", label: "Grotesk", preview: "font-heading font-semibold" },
];

const THEME_OPTIONS: { value: QuoteTheme; label: string; swatch: string }[] = [
  { value: "light", label: "Light", swatch: "#FFFFFF" },
  { value: "dark", label: "Dark", swatch: "#1a1a1a" },
  { value: "cream", label: "Cream", swatch: "#F5F0E8" },
  { value: "ink", label: "Ink", swatch: "#0d1117" },
];

const Index = () => {
  const [quote, setQuote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [socials, setSocials] = useState("");
  const [authorPhoto, setAuthorPhoto] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("square");
  const [font, setFont] = useState<QuoteFont>("playfair");
  const [theme, setTheme] = useState<QuoteTheme>("light");
  const [downloading, setDownloading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.4);
  const [fontSize, setFontSize] = useState(1.4);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [textColor, setTextColor] = useState("");

  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

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
      const scale = 3;
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: scale,
        cacheBust: true,
      });
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
            quotecraft
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Controls */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Quote */}
            <ControlSection label="Quote">
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="The only way to do great work is to love what you do."
                rows={4}
                className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none font-body"
              />
            </ControlSection>

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
                  <input
                    value={socials}
                    onChange={(e) => setSocials(e.target.value)}
                    placeholder="@handle or website"
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
                      className="w-[4.5rem] h-[4.5rem] rounded-full border border-dashed border-border flex items-center justify-center hover:border-foreground/30 transition-colors"
                    >
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            </ControlSection>

            {/* Format */}
            <ControlSection label="Format">
              <div className="flex gap-2">
                {ASPECT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAspectRatio(opt.value)}
                    className={`px-4 py-2 text-xs font-heading font-medium rounded-md border transition-all ${
                      aspectRatio === opt.value
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </ControlSection>

            {/* Font */}
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
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] font-heading text-muted-foreground uppercase tracking-widest w-10">Size</span>
                <input
                  type="range"
                  min={0.8}
                  max={3}
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
          <div className="order-1 lg:order-2 lg:sticky lg:top-8">
            <div className="flex justify-center">
              <div className="w-full max-w-lg shadow-xl">
                <QuotePreview
                  ref={previewRef}
                  quote={quote}
                  authorName={authorName}
                  authorPhoto={authorPhoto}
                  socials={socials}
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
  <div className="space-y-2.5">
    <label className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground">
      {label}
    </label>
    {children}
  </div>
);

export default Index;
