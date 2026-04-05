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
import { LogOut, User, Download, Shield } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import GalleryPromptDialog from "@/components/GalleryPromptDialog";
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
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_EDITOR_STATE;
  });
  const [downloading, setDownloading] = useState(false);
  const [showGalleryPrompt, setShowGalleryPrompt] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [showProUpgradePrompt, setShowProUpgradePrompt] = useState(false);
  const [showProSignupPrompt, setShowProSignupPrompt] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const mobilePreviewRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadClick = useCallback(() => {
    const hasPro = usesProFeatures(editorState);

    if (!user) {
      if (hasPro) {
        // Not logged in + pro features → show pro signup prompt
        localStorage.setItem(DRAFT_KEY, JSON.stringify(editorState));
        setShowProSignupPrompt(true);
        return;
      }
      // No pro features, not logged in → download then prompt signup
      performDownloadOnly();
    } else if (isPro) {
      // Pro users: just download
      performDownloadOnly();
    } else if (hasPro) {
      // Free logged-in user with pro features
      const trialUsed = localStorage.getItem("lazy-quotes-pro-trial-used");
      if (trialUsed) {
        // Already used free pro trial → prompt to pay
        setShowProUpgradePrompt(true);
      } else {
        // First time → allow download, mark trial used
        localStorage.setItem("lazy-quotes-pro-trial-used", "true");
        performDownloadOnly();
      }
    } else {
      // Free logged-in user, no pro features → just download
      performDownloadOnly();
    }
  }, [user, isPro, editorState, usesProFeatures]);

  const performDownloadOnly = useCallback(async () => {
    const target = previewRef.current || mobilePreviewRef.current;
    if (!target) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(target, {
        scale: 3, useCORS: true, logging: false, backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `quote-${Date.now()}.png`;
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-6">
            <h1 className="font-shadows-into-light text-3xl sm:text-4xl font-bold text-foreground select-none" style={{ letterSpacing: "0.02em" }}>
              Lazy Quotes
            </h1>
            <div className="hidden md:block">
              <p className="font-playfair text-sm font-normal tracking-tight text-foreground leading-tight">
                Create awesome quotes for your socials.
              </p>
              <p className="text-muted-foreground text-xs">
                Design beautiful, shareable quote images in seconds. Pick fonts, colors, layouts — download and post.
              </p>
            </div>
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
            socialPlatform={editorState.socialUsername ? editorState.socialPlatform as SocialPlatform : undefined}
            socials={socials}
            aspectRatio={editorState.aspectRatio}
            font={editorState.font}
            theme={editorState.theme}
            backgroundImage={editorState.backgroundImage}
            backgroundOpacity={editorState.backgroundOpacity}
            backgroundBlur={editorState.backgroundBlur}
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
        <button
          onClick={handleDownloadClick}
          disabled={downloading}
          className="flex items-center justify-center gap-2 w-full mt-2 py-2 bg-primary text-primary-foreground font-heading text-xs font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
{downloading ? "Exporting…" : "Download"}
        </button>
      </div>

      <section className="min-h-[calc(100vh-4rem)] flex px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto w-full flex gap-8 lg:gap-12 py-4">
          {/* Left — editor */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex-1 min-h-0">
              <QuoteEditor state={editorState} onChange={setEditorState} isPro={isPro} />
            </div>
          </div>
          {/* Phone — right */}
          <div className="hidden lg:flex flex-shrink-0 flex-col gap-3 sticky top-6 self-start" style={{ width: "clamp(260px, 25vw, 320px)" }}>
            <div className="relative border border-foreground/20 rounded-[2.8rem] py-12 px-1 flex items-center" style={{ aspectRatio: "71.5 / 149.6" }}>
              <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none rounded-t-[2.8rem]" />
              <div className="w-full flex items-center justify-center">
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
                  backgroundBlur={editorState.backgroundBlur}
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
              <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none rounded-b-[2.8rem]" />
            </div>
            <button
              onClick={handleDownloadClick}
              disabled={downloading}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground font-heading text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Exporting…" : "Download"}
            </button>
          </div>
        </div>
      </section>

      

      {/* About */}
      <section className="border-t border-border px-4 sm:px-6 py-8">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-xs text-muted-foreground">
            Lazy Quotes is part of{" "}
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
            <AlertDialogCancel onClick={() => { setShowSignupPrompt(false); performDownloadOnly(); }}>
              Download without signing up
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
};

export default Index;
