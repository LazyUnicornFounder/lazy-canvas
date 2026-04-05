import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { Download, LogOut, User } from "lucide-react";
import HeroSlideshow from "@/components/HeroSlideshow";
import PhoneMockup from "@/components/PhoneMockup";
import QuotePreview, {
  type SocialPlatform,
} from "@/components/QuotePreview";
import QuoteEditor, {
  type QuoteEditorState,
  DEFAULT_EDITOR_STATE,
  SOCIAL_PLATFORMS,
} from "@/components/QuoteEditor";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import type { UserQuote } from "@/hooks/useUserQuotes";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState<QuoteEditorState>(DEFAULT_EDITOR_STATE);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const isFreeUser = true; // TODO: check paid status

  const handleDownload = useCallback(async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
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
  }, [user]);

  const handleSelectQuote = (quote: UserQuote) => {
    setActiveQuoteId(quote.id);
    setEditorState(quote.editor_state);
  };

  const handleNewQuote = () => {
    setActiveQuoteId(null);
    setEditorState(DEFAULT_EDITOR_STATE);
  };

  const socials = [
    editorState.socialUsername
      ? `${SOCIAL_PLATFORMS.find((p) => p.value === editorState.socialPlatform)?.prefix || ""}${editorState.socialUsername}`
      : "",
    editorState.website,
  ]
    .filter(Boolean)
    .join(" · ");

  const mainContent = (
    <>
      {/* Header */}
      <header className="border-b border-border">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user && <SidebarTrigger />}
            <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Lazy Quotes
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate("/pricing")}
              className="text-xs font-heading font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </button>
            {user ? (
              <>
                <span className="text-xs text-muted-foreground hidden sm:block">{user.email}</span>
                <button
                  onClick={signOut}
                  className="p-2 hover:bg-accent rounded-md transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-heading text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
              >
                <User className="w-3.5 h-3.5" />
                Sign up free
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - only for non-logged-in users */}
      {!user && (
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
      )}

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex gap-6 items-start">
          {/* Controls */}
          <div className="flex-1 min-w-0">
            <QuoteEditor state={editorState} onChange={setEditorState} />
          </div>

          {/* Preview */}
          <div className="hidden lg:block sticky top-4 flex-shrink-0" style={{ width: "clamp(300px, 30vw, 360px)" }}>
            <div className="flex flex-col gap-3">
              <PhoneMockup authorName={editorState.authorName || "lazyquotes"}>
                <QuotePreview
                  ref={previewRef}
                  quote={editorState.quote}
                  authorName={editorState.authorName}
                  authorPhoto={editorState.authorPhoto}
                  socialPlatform={editorState.socialUsername ? editorState.socialPlatform as SocialPlatform : undefined}
                  socials={socials}
                  aspectRatio="square"
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
                  showWatermark={isFreeUser}
                />
              </PhoneMockup>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground font-heading text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {downloading ? "Exporting…" : user ? "Download PNG" : "Sign up to download"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleDownload}
      />
    </>
  );

  // When logged in, wrap in sidebar layout
  if (user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar
            activeQuoteId={activeQuoteId}
            onSelectQuote={handleSelectQuote}
            onNewQuote={handleNewQuote}
            currentEditorState={editorState}
          />
          <div className="flex-1 flex flex-col min-w-0 bg-background">
            {mainContent}
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {mainContent}
    </div>
  );
};

export default Index;
