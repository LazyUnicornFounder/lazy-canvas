import { useState, useRef, useCallback, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Download, Shield, ChevronDown, Printer } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import type { UserQuote } from "@/hooks/useUserQuotes";
import AuthModal from "@/components/AuthModal";
import GalleryPromptDialog from "@/components/GalleryPromptDialog";
import { MainNav, LogoWithTagline } from "@/components/MainNav";
import { useAuth } from "@/hooks/useAuth";
import QuoteEditor, { type QuoteEditorState, DEFAULT_EDITOR_STATE, SOCIAL_PLATFORMS } from "@/components/QuoteEditor";
import QuotePreview, { type SocialPlatform } from "@/components/QuotePreview";
import html2canvas from "html2canvas";
import QuoteGallery from "@/components/QuoteGallery";
import { supabase } from "@/integrations/supabase/client";

const DRAFT_KEY = "lazy-quotes-draft";

const Index = () => {
  const { user, signOut, isPro, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editorState, setEditorState] = useState<QuoteEditorState>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        localStorage.removeItem(DRAFT_KEY);
        return { ...DEFAULT_EDITOR_STATE, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_EDITOR_STATE;
  });
  const [downloading, setDownloading] = useState(false);
  const [showGalleryPrompt, setShowGalleryPrompt] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [showProUpgradePrompt, setShowProUpgradePrompt] = useState(false);
  const [showProSignupPrompt, setShowProSignupPrompt] = useState(false);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const mobilePreviewRef = useRef<HTMLDivElement>(null);

  const handleSelectQuote = (quote: UserQuote) => {
    if (!isPro) {
      import("sonner").then(({ toast }) => toast.error("Re-editing saved quotes is a Pro feature."));
      return;
    }
    setActiveQuoteId(quote.id);
    setEditorState(quote.editor_state);
  };

  const handleNewQuote = () => {
    setActiveQuoteId(null);
    setEditorState(DEFAULT_EDITOR_STATE);
  };

  // Scroll to top on mount (e.g. when navigating from marketing pages)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Clear draft from localStorage once user is logged in and state is restored
  useEffect(() => {
    if (user) {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [user]);

  const usesProFeatures = useCallback((state: QuoteEditorState) => {
    return (
      (state.coloredWords && state.coloredWords.length > 0) ||
      !!state.backgroundImage ||
      (state.aspectRatio !== "square")
    );
  }, []);

  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [mobileDownloadMenuOpen, setMobileDownloadMenuOpen] = useState(false);

  const performDownloadOnly = useCallback(async (scale: number = 3) => {
    const target = previewRef.current || mobilePreviewRef.current;
    if (!target) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(target, {
        scale, useCORS: true, logging: false, backgroundColor: null,
      });
      const link = document.createElement("a");
      const suffix = scale > 3 ? "-print" : "";
      link.download = `quote${suffix}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch { console.error("Failed to export"); }
    finally {
      setDownloading(false);
      if (!user) {
        setShowSignupPrompt(true);
      }
    }
  }, [user]);

  const handleDownloadClick = useCallback((scale: number = 3) => {
    const hasPro = usesProFeatures(editorState);

    if (!user) {
      if (hasPro) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(editorState));
        setShowProSignupPrompt(true);
        return;
      }
      performDownloadOnly(scale);
    } else if (isPro) {
      performDownloadOnly(scale);
    } else if (hasPro) {
      const trialUsed = localStorage.getItem("lazy-quotes-pro-trial-used");
      if (trialUsed) {
        setShowProUpgradePrompt(true);
      } else {
        localStorage.setItem("lazy-quotes-pro-trial-used", "true");
        performDownloadOnly(scale);
      }
    } else {
      performDownloadOnly(scale);
    }
  }, [user, isPro, editorState, usesProFeatures, performDownloadOnly]);

  const performDownload = useCallback(async (shareToGallery: boolean) => {
    setShowGalleryPrompt(false);
    const target = previewRef.current || mobilePreviewRef.current;
    if (!target) return;
    setDownloading(true);
    try {
      if (shareToGallery && user) {
        await supabase.from("gallery_submissions").insert({
          user_id: user.id,
          editor_state: editorState as any,
        });
      }
      const canvas = await html2canvas(target, {
        scale: 3, useCORS: true, logging: false, backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `quote-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch { console.error("Failed to export"); }
    finally { setDownloading(false); }
  }, [user, editorState]);

  const handleSignupAccept = useCallback(() => {
    setShowSignupPrompt(false);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(editorState));
    setShowAuthModal(true);
  }, [editorState]);

  const handleSignupDecline = useCallback(() => {
    setShowSignupPrompt(false);
  }, []);

  const socials = [
    editorState.socialUsername
      ? `${SOCIAL_PLATFORMS.find((p) => p.value === editorState.socialPlatform)?.prefix || ""}${editorState.socialUsername}`
      : "",
    editorState.website,
  ].filter(Boolean).join(" · ");

  const isFreeUser = !isPro;

  const pageContent = (
    <div className={user ? "flex-1 flex flex-col min-w-0 bg-background" : "min-h-screen bg-background"}>
      <header className="border-b border-border">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-6">
            {user && <SidebarTrigger />}
            <LogoWithTagline />
            <MainNav />
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
                {isAdmin && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="p-2 hover:bg-accent rounded-md transition-colors"
                    title="Admin"
                  >
                    <Shield className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
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

      {/* Mobile sticky preview */}
      <div className="lg:hidden sticky top-0 z-20 bg-background border-b border-border px-4 py-3">
        <div className="max-w-[280px] mx-auto">
          <QuotePreview
            ref={mobilePreviewRef}
            quote={editorState.quote}
            authorName={editorState.authorName}
            authorPhoto={editorState.authorPhoto}
            photoShape={editorState.photoShape}
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
            shadowOpacity={editorState.shadowOpacity}
            authorPosition={editorState.authorPosition}
            backgroundColor={editorState.backgroundColor}
            isBold={editorState.isBold}
            isItalic={editorState.isItalic}
            coloredWords={editorState.coloredWords}
            showWatermark={isFreeUser}
            showQuotationMarks={editorState.showQuotationMarks}
          />
        </div>
        <div className="relative w-full mt-2">
          <div className="flex w-full">
            <button
              onClick={() => handleDownloadClick(3)}
              disabled={downloading}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground font-heading text-xs font-medium rounded-l-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {downloading ? "Exporting…" : "Download"}
            </button>
            <button
              onClick={() => setMobileDownloadMenuOpen(!mobileDownloadMenuOpen)}
              disabled={downloading}
              className="px-2 bg-primary text-primary-foreground rounded-r-md border-l border-primary-foreground/20 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          {mobileDownloadMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-30 overflow-hidden">
              <button
                onClick={() => { setMobileDownloadMenuOpen(false); handleDownloadClick(3); }}
                className="w-full px-3 py-2 text-xs text-left hover:bg-accent flex items-center gap-2"
              >
                <Download className="w-3 h-3" /> Web (Standard)
              </button>
              <button
                onClick={() => { setMobileDownloadMenuOpen(false); handleDownloadClick(6); }}
                className="w-full px-3 py-2 text-xs text-left hover:bg-accent flex items-center gap-2"
              >
                <Printer className="w-3 h-3" /> Print-Ready (High-Res)
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="min-h-[calc(100vh-4rem)] flex px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto w-full flex gap-8 lg:gap-12 py-4">
          {/* Left — editor */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex-1 min-h-0">
              <QuoteEditor state={editorState} onChange={setEditorState} isPro={isPro} />
            </div>
          </div>
          {/* Preview — right */}
          <div className="hidden lg:flex flex-shrink-0 flex-col gap-3 sticky top-6 self-start" style={{ width: "clamp(260px, 25vw, 320px)" }}>
            <div className="w-full overflow-hidden">
                <QuotePreview
                  ref={previewRef}
                  quote={editorState.quote}
                  authorName={editorState.authorName}
                  authorPhoto={editorState.authorPhoto}
                  photoShape={editorState.photoShape}
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
                  shadowOpacity={editorState.shadowOpacity}
                  authorPosition={editorState.authorPosition}
                  backgroundColor={editorState.backgroundColor}
                  isBold={editorState.isBold}
                  isItalic={editorState.isItalic}
                  coloredWords={editorState.coloredWords}
                  showWatermark={isFreeUser}
                  showQuotationMarks={editorState.showQuotationMarks}
                />
            </div>
            <div className="relative w-full">
              <div className="flex w-full">
                <button
                  onClick={() => handleDownloadClick(3)}
                  disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground font-heading text-sm font-medium rounded-l-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {downloading ? "Exporting…" : "Download"}
                </button>
                <button
                  onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                  disabled={downloading}
                  className="px-2.5 bg-primary text-primary-foreground rounded-r-md border-l border-primary-foreground/20 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              {downloadMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-30 overflow-hidden">
                  <button
                    onClick={() => { setDownloadMenuOpen(false); handleDownloadClick(3); }}
                    className="w-full px-3 py-2.5 text-sm text-left hover:bg-accent flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" /> Web (Standard)
                  </button>
                  <button
                    onClick={() => { setDownloadMenuOpen(false); handleDownloadClick(6); }}
                    className="w-full px-3 py-2.5 text-sm text-left hover:bg-accent flex items-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print-Ready (High-Res)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      

      {/* About */}
      <section className="border-t border-border px-4 sm:px-6 py-8">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-xs text-muted-foreground">
            Lazy Faceless is part of{" "}
            <a
              href="https://lazyfactoryventures.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Lazy Factory Ventures
            </a>
            .
          </p>
        </div>
      </section>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => navigate("/create")}
      />

      {/* Signup prompt after download for non-logged-in users */}
      <AlertDialog open={showSignupPrompt} onOpenChange={(o) => !o && setShowSignupPrompt(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Sign up free to save this quote and create more free quotes.</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Create a free account to save your quotes, edit them anytime, and create unlimited new ones from your personal dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSignupPrompt(false)}>
              Continue without signing up
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSignupAccept}>
              Sign up free
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pro upgrade prompt for free users who already used their trial */}
      <AlertDialog open={showProUpgradePrompt} onOpenChange={(o) => !o && setShowProUpgradePrompt(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">You've selected Pro features</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Your quote uses Pro features like word colors, custom backgrounds, or custom formats. Upgrade to Pro to keep using these features on all your quotes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowProUpgradePrompt(false)}>
              Maybe later
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => { setShowProUpgradePrompt(false); navigate("/pricing"); }}>
              Upgrade to Pro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pro signup prompt for guests using pro features */}
      <AlertDialog open={showProSignupPrompt} onOpenChange={(o) => !o && setShowProSignupPrompt(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Nice design! 🎨</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              You created a design with PRO features, but the first one is on us. Sign up for free to download it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowProSignupPrompt(false)}>
              Maybe later
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => { setShowProSignupPrompt(false); setShowAuthModal(true); }}>
              Sign up free
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
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
          {pageContent}
        </div>
      </SidebarProvider>
    );
  }

  return pageContent;
};

export default Index;
