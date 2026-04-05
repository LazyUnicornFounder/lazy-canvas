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
import { toBlob as toImageBlob } from "html-to-image";
import QuoteGallery from "@/components/QuoteGallery";
import { supabase } from "@/integrations/supabase/client";

const DRAFT_KEY = "lazy-quotes-draft";

const ASPECT_RATIOS: Record<string, number> = {
  square: 1, "3:4": 3/4, "2:3": 2/3, "9:16": 9/16, "1:2": 1/2,
  "4:3": 4/3, "3:2": 3/2, "16:9": 16/9, "2:1": 2, "1.91:1": 1.91,
  "3:1": 3, "4:1": 4, "820:312": 820/312,
  a0: 841/1189, a1: 594/841, a2: 420/594, a3: 297/420, a4: 210/297,
  letter: 8.5/11, legal: 8.5/14, tabloid: 11/17,
  "poster-18x24": 18/24, "poster-24x36": 24/36, "banner-2x5": 2/5,
  "ios-screenshot": 1290/2796, "ios-ipad": 2048/2732, "android-phone": 1080/1920,
  "android-tablet": 1920/1200, "mac-screenshot": 2880/1800, "app-icon": 1,
  "iphone-wallpaper": 1179/2556, "android-wallpaper": 1080/2400, "lock-screen": 1170/2532,
};

const getPreviewContainerWidth = (aspectRatio: string, customW?: number, customH?: number): string => {
  let ratio = ASPECT_RATIOS[aspectRatio];
  if (aspectRatio === "custom" && customW && customH) ratio = customW / customH;
  if (!ratio) ratio = 1;
  // Height-first: fill viewport height, compute width from ratio
  const offsetPx = 100;
  return `clamp(180px, calc((100vh - ${offsetPx}px) * ${ratio.toFixed(4)}), 500px)`;
};

const sanitizeExportStyles = (root: ParentNode) => {
  root.querySelectorAll<HTMLElement>("*").forEach((node) => {
    if (node.style.borderRadius.includes("clamp(")) {
      node.style.borderRadius = "4px";
    }

    if (
      node.style.getPropertyValue("backdrop-filter") ||
      node.style.getPropertyValue("-webkit-backdrop-filter")
    ) {
      node.style.setProperty("backdrop-filter", "none");
      node.style.setProperty("-webkit-backdrop-filter", "none");
    }
  });
};

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

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.rel = "noopener";
    document.body.appendChild(link);

    requestAnimationFrame(() => {
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }, []);

  const renderPreviewBlob = useCallback(async (target: HTMLElement, scale: number) => {
    try {
      const blob = await toImageBlob(target, {
        cacheBust: true,
        pixelRatio: scale,
      });

      if (blob) {
        return blob;
      }
    } catch (error) {
      console.warn("Primary export failed, falling back to canvas export", error);
    }

    const canvas = await html2canvas(target, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: null,
      onclone: (clonedDocument) => {
        sanitizeExportStyles(clonedDocument.body);
      },
    });

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Failed to create PNG"));
      }, "image/png");
    });
  }, []);

  const performDownloadOnly = useCallback(async (scale: number = 3, showGuestPrompt = true) => {
    const target = previewRef.current || mobilePreviewRef.current;
    if (!target) return;

    setDownloading(true);
    try {
      const blob = await renderPreviewBlob(target, scale);
      const suffix = scale > 3 ? "-print" : "";
      downloadBlob(blob, `quote${suffix}-${Date.now()}.png`);

      if (!user && showGuestPrompt) {
        window.setTimeout(() => setShowSignupPrompt(true), 300);
      }
    } catch (err) {
      console.error("Failed to export", err);
    } finally {
      setDownloading(false);
    }
  }, [downloadBlob, renderPreviewBlob, user]);

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

      const blob = await renderPreviewBlob(target, 3);
      downloadBlob(blob, `quote-${Date.now()}.png`);
    } catch (err) {
      console.error("Failed to export", err);
    } finally {
      setDownloading(false);
    }
  }, [downloadBlob, renderPreviewBlob, user, editorState]);

  const handleSignupAccept = useCallback(() => {
    setShowSignupPrompt(false);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(editorState));
    setShowAuthModal(true);
  }, [editorState]);

  const handleSignupDownload = useCallback(() => {
    setShowSignupPrompt(false);
    performDownloadOnly(3, false);
  }, [performDownloadOnly]);

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
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-6">
            {user && <SidebarTrigger />}
            <LogoWithTagline />
            <MainNav />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
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
            customWidth={editorState.customWidth}
            customHeight={editorState.customHeight}
          />
        </div>
        <div className="relative w-full mt-2 max-w-[280px] mx-auto">
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
          <div className="hidden lg:flex flex-shrink-0 flex-col gap-3 sticky top-6 self-start transition-all duration-300" style={{ width: getPreviewContainerWidth(editorState.aspectRatio, editorState.customWidth, editorState.customHeight) }}>
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
                  customWidth={editorState.customWidth}
                  customHeight={editorState.customHeight}
                />
            </div>
            <div className="relative w-fit">
              <div className="flex w-fit">
                <button
                  onClick={() => handleDownloadClick(3)}
                  disabled={downloading}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-heading text-sm font-medium rounded-l-md hover:opacity-90 transition-opacity disabled:opacity-50"
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
            <AlertDialogCancel onClick={handleSignupDownload}>
              Download
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
            <AlertDialogCancel onClick={() => { setShowProUpgradePrompt(false); performDownloadOnly(3); }}>
              Download
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
            <AlertDialogCancel onClick={() => { setShowProSignupPrompt(false); performDownloadOnly(3); }}>
              Download
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
