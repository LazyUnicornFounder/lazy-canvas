import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import HeroSlideshow from "@/components/HeroSlideshow";
import QuotePreview, {
  type SocialPlatform,
} from "@/components/QuotePreview";
import QuoteEditor, {
  type QuoteEditorState,
  DEFAULT_EDITOR_STATE,
  SOCIAL_PLATFORMS,
} from "@/components/QuoteEditor";

const Index = () => {
  const [editorState, setEditorState] = useState<QuoteEditorState>(DEFAULT_EDITOR_STATE);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

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

  const socials = [
    editorState.socialUsername
      ? `${SOCIAL_PLATFORMS.find((p) => p.value === editorState.socialPlatform)?.prefix || ""}${editorState.socialUsername}`
      : "",
    editorState.website,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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

      {/* Hero Section */}
      <section className="border-b border-border bg-card/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-6">
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Create awesome quotes for your socials.
              </h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Design beautiful, shareable quote images in seconds. Pick fonts, colors, layouts — download and post.
              </p>
            </div>
            <div className="flex-shrink-0 w-full max-w-md">
              <HeroSlideshow />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex gap-6 items-start">
          {/* Controls */}
          <div className="flex-1 min-w-0">
            <QuoteEditor state={editorState} onChange={setEditorState} />
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
                    const ratio = ratioMap[editorState.aspectRatio] || 1;
                    if (ratio <= 1) return `min(32rem, calc((100vh - 4rem) * ${ratio}))`;
                    return "32rem";
                  })(),
                }}
              >
                <QuotePreview
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
      </main>
    </div>
  );
};

export default Index;
