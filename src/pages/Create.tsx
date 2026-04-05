import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { Download, LogOut, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
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

const DRAFT_KEY = "lazy-quotes-draft";

const Create = () => {
  const { user, signOut, isPro } = useAuth();
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState<QuoteEditorState>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        localStorage.removeItem(DRAFT_KEY);
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_EDITOR_STATE;
  });
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const isFreeUser = !isPro;

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
  }, [user]);

  const handleSelectQuote = (quote: UserQuote) => {
    if (!isPro) {
      toast.error("Re-editing saved quotes is a Pro feature. Upgrade to Pro to unlock!");
      return;
    }
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
      <header className="border-b border-border">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user && <SidebarTrigger />}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-shadows-into-light text-xl font-bold tracking-tight text-foreground">Lazy Quotes</span>
            </button>
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
                className="px-4 py-2 bg-foreground text-background font-heading text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
              >
                Sign up free
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0">
            <QuoteEditor state={editorState} onChange={setEditorState} isPro={isPro} />
          </div>

          <div className="hidden lg:flex sticky top-4 flex-shrink-0 flex-col gap-3" style={{ width: "clamp(260px, 25vw, 320px)" }}>
              {/* Phone outline matching homepage style */}
              <div className="relative border border-foreground/20 rounded-[2.8rem] py-12 px-1 flex items-center" style={{ aspectRatio: "71.5 / 149.6" }}>
                <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none rounded-t-[2.8rem]" />
                <div className="w-full">
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
                    showQuotationMarks={editorState.showQuotationMarks}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none rounded-b-[2.8rem]" />
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground font-heading text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {downloading ? "Exporting…" : "Download PNG"}
              </button>
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

export default Create;
