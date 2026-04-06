import { useState, useRef, useCallback, useEffect, useMemo } from "react";
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
import { LogOut, User, Download, Shield, ChevronDown, Printer, Save } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useUserQuotes, type UserQuote } from "@/hooks/useUserQuotes";
import AuthModal from "@/components/AuthModal";
import GalleryPromptDialog from "@/components/GalleryPromptDialog";
import { MainNav, LogoWithTagline } from "@/components/MainNav";
import { SiteFooter } from "@/components/SiteFooter";
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
  const { saveQuote } = useUserQuotes();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("signup");
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
  const [showDownloadWatermark, setShowDownloadWatermark] = useState(false);
  const [freeEditorStateForSnapshot, setFreeEditorStateForSnapshot] = useState<QuoteEditorState | null>(null);
  const [showGalleryPrompt, setShowGalleryPrompt] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [showProUpgradePrompt, setShowProUpgradePrompt] = useState(false);
  const [proUpgradeSnapshot, setProUpgradeSnapshot] = useState<string | null>(null);
  const [proWatermarkSnapshot, setProWatermarkSnapshot] = useState<string | null>(null);
  const [showProSignupPrompt, setShowProSignupPrompt] = useState(false);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const mobilePreviewRef = useRef<HTMLDivElement>(null);

  const handleSelectQuote = (quote: UserQuote) => {
    if (!isPro) {
      import("sonner").then(({ toast }) => toast.error("Re-editing saved designs is a Pro feature."));
      return;
    }
    setActiveQuoteId(quote.id);
    setEditorState(quote.editor_state);
  };

  const handleNewQuote = () => {
    setActiveQuoteId(null);
    setEditorState(DEFAULT_EDITOR_STATE);
  };

  const handleSaveQuote = useCallback(async () => {
    if (!user) return;
    const title = editorState.quote
      ? editorState.quote.slice(0, 40) + (editorState.quote.length > 40 ? "…" : "")
      : "Untitled";
    const result = await saveQuote(activeQuoteId, title, editorState);
    if (result && !activeQuoteId) {
      setActiveQuoteId(result.id);
    }
    const { toast } = await import("sonner");
    toast.success(activeQuoteId ? "Changes saved!" : "Design saved!");
  }, [user, editorState, activeQuoteId, saveQuote]);

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
      (state.backgroundFilter && state.backgroundFilter !== "none") ||
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
        filter: (node: HTMLElement) => !node?.hasAttribute?.("data-export-exclude"),
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
        clonedDocument.querySelectorAll("[data-export-exclude]").forEach((el) => el.remove());
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
      // Show watermark for free users during capture
      if (!isPro) {
        setShowDownloadWatermark(true);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      }

      const blob = await renderPreviewBlob(target, scale);
      const suffix = scale > 3 ? "-print" : "";
      downloadBlob(blob, `design${suffix}-${Date.now()}.png`);

      if (!user && showGuestPrompt && !localStorage.getItem("lazy-quotes-signup-dismissed")) {
        window.setTimeout(() => setShowSignupPrompt(true), 300);
      }
    } catch (err) {
      console.error("Failed to export", err);
    } finally {
      setShowDownloadWatermark(false);
      setDownloading(false);
    }
  }, [downloadBlob, renderPreviewBlob, user, isPro]);

  

  const handleDownloadFreeVersion = useCallback(() => {
    setShowProUpgradePrompt(false);
    setProUpgradeSnapshot(null);
    setProWatermarkSnapshot(null);
    setEditorState((prev) => ({
      ...prev,
      coloredWords: [],
      backgroundImage: null,
      backgroundFilter: "none",
      aspectRatio: "square" as const,
    }));
  }, []);

  const handleDownloadClick = useCallback(async (scale: number = 3) => {
    const hasPro = usesProFeatures(editorState);

    if (isPro) {
      performDownloadOnly(scale);
    } else if (hasPro) {
      const target = previewRef.current || mobilePreviewRef.current;
      if (target) {
        // Capture Pro version (as-is)
        const proCanvas = await html2canvas(target, { scale: 1, useCORS: true, logging: false, backgroundColor: null, onclone: (doc) => { doc.querySelectorAll("[data-export-exclude]").forEach((el) => el.remove()); } });
        setProUpgradeSnapshot(proCanvas.toDataURL("image/png"));

        // Capture Free version (strip pro features from clone)
        const freeCanvas = await html2canvas(target, {
          scale: 1, useCORS: true, logging: false, backgroundColor: null,
          onclone: (doc) => {
            doc.querySelectorAll("[data-export-exclude]").forEach((el) => el.remove());
            // Remove background images
            const bgEls = doc.querySelectorAll("[class*='bg-cover']");
            bgEls.forEach((el) => (el as HTMLElement).style.display = "none");
            // Remove colored word spans - reset to inherit
            doc.querySelectorAll("span[style*='color']").forEach((el) => {
              (el as HTMLElement).style.color = "inherit";
            });
          },
        });
        // Add watermark to free version
        const ctx = freeCanvas.getContext("2d");
        if (ctx) {
          const w = freeCanvas.width;
          const h = freeCanvas.height;
          const pad = Math.max(8, w * 0.03);
          const fontSize = Math.max(8, Math.min(14, w * 0.025));
          ctx.font = `600 ${fontSize}px sans-serif`;
          const text = "Made with LazyFaceless.com";
          const metrics = ctx.measureText(text);
          const boxW = metrics.width + pad * 1.5;
          const boxH = fontSize * 1.8;
          const x = w - boxW - pad;
          const y = h - boxH - pad;
          ctx.fillStyle = "rgba(0,0,0,0.55)";
          ctx.beginPath();
          ctx.roundRect(x, y, boxW, boxH, 4);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.fillText(text, x + pad * 0.75, y + boxH * 0.68);
        }
        setProWatermarkSnapshot(freeCanvas.toDataURL("image/png"));
        setShowProUpgradePrompt(true);
      } else {
        setShowProUpgradePrompt(true);
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

      // Show watermark for free users during capture
      if (!isPro) {
        setShowDownloadWatermark(true);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      }

      const blob = await renderPreviewBlob(target, 3);
      downloadBlob(blob, `quote-${Date.now()}.png`);
    } catch (err) {
      console.error("Failed to export", err);
    } finally {
      setShowDownloadWatermark(false);
      setDownloading(false);
    }
  }, [downloadBlob, renderPreviewBlob, user, editorState, isPro]);

  const handleSignupAccept = useCallback(() => {
    setShowSignupPrompt(false);
    localStorage.setItem("lazy-quotes-signup-dismissed", "true");
    localStorage.setItem(DRAFT_KEY, JSON.stringify(editorState));
    setShowAuthModal(true);
  }, [editorState]);

  const handleSignupDownload = useCallback(() => {
    setShowSignupPrompt(false);
    localStorage.setItem("lazy-quotes-signup-dismissed", "true");
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
              <>
                <button
                  onClick={() => { setAuthModalMode("login"); setShowAuthModal(true); }}
                  className="text-sm font-heading font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => { setAuthModalMode("signup"); setShowAuthModal(true); }}
                  className="px-4 py-2 bg-foreground text-background font-heading text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
                >
                  Get started free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile sticky preview */}
      <div className="lg:hidden sticky top-0 z-20 bg-background border-b border-border px-4 py-3">
        <div className="max-w-[280px] mx-auto relative">
          <QuotePreview
            key={`mobile-${editorState.font}-${editorState.authorFont}-${editorState.isBold}-${editorState.isItalic}`}
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
            filterIntensity={editorState.filterIntensity}
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
            showWatermark={showDownloadWatermark}
            showQuotationMarks={editorState.showQuotationMarks}
            photoStroke={editorState.photoStroke}
            customWidth={editorState.customWidth}
            customHeight={editorState.customHeight}
            borderWidth={editorState.borderWidth}
            borderColor={editorState.borderColor}
            borderStyle={editorState.borderStyle}
            logo={editorState.logo}
            logoPosition={editorState.logoPosition}
            logoSize={editorState.logoSize}
            onAutoFontSize={(size) => setEditorState((prev) => ({ ...prev, fontSize: size }))}
          />
          {isFreeUser && usesProFeatures(editorState) && (
            <span className="absolute top-2 right-2 z-40 px-2 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full shadow-sm pointer-events-none select-none opacity-80">
              Pro
            </span>
          )}
        </div>
        <div className="relative w-full mt-2 max-w-[280px] mx-auto flex gap-2">
          <button
            onClick={() => {
              if (!user) { setAuthModalMode("signup"); setShowAuthModal(true); return; }
              handleSaveQuote();
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 border border-border text-foreground font-heading text-xs font-medium rounded-md hover:bg-accent transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <div className="relative flex-1">
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
            <div className="w-full overflow-hidden relative">
                <QuotePreview
                  key={`desktop-${editorState.font}-${editorState.authorFont}-${editorState.isBold}-${editorState.isItalic}`}
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
                  filterIntensity={editorState.filterIntensity}
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
                  showWatermark={showDownloadWatermark}
                  showQuotationMarks={editorState.showQuotationMarks}
                  photoStroke={editorState.photoStroke}
                  customWidth={editorState.customWidth}
                  customHeight={editorState.customHeight}
                  borderWidth={editorState.borderWidth}
                  borderColor={editorState.borderColor}
                   borderStyle={editorState.borderStyle}
                   logo={editorState.logo}
                   logoPosition={editorState.logoPosition}
                   logoSize={editorState.logoSize}
                   onAutoFontSize={(size) => setEditorState((prev) => ({ ...prev, fontSize: size }))}
                 />
                {isFreeUser && usesProFeatures(editorState) && (
                  <span className="absolute top-2 right-2 z-40 px-2 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full shadow-sm pointer-events-none select-none opacity-80">
                    Pro
                  </span>
                )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!user) { setAuthModalMode("signup"); setShowAuthModal(true); return; }
                  handleSaveQuote();
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-border text-foreground font-heading text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <div className="relative">
                <div className="flex">
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
        defaultMode={authModalMode}
      />

      {/* Signup prompt after download for non-logged-in users */}
      <AlertDialog open={showSignupPrompt} onOpenChange={(o) => !o && setShowSignupPrompt(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Sign up free to save this design and create more free designs.</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Create a free account to save your designs, and create unlimited new ones from your personal dashboard.
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

      {/* Pro upgrade prompt for free users */}
      <AlertDialog open={showProUpgradePrompt} onOpenChange={(o) => { if (!o) { setShowProUpgradePrompt(false); setProUpgradeSnapshot(null); setProWatermarkSnapshot(null); } }}>
        <AlertDialogContent className="overflow-hidden max-w-lg p-0">
          {/* Blurred background of their design */}
          {proUpgradeSnapshot && (
            <div className="absolute inset-0 -z-10">
              <img
                src={proUpgradeSnapshot}
                alt=""
                className="w-full h-full object-cover blur-lg scale-125 opacity-15"
              />
              <div className="absolute inset-0 bg-background/80" />
            </div>
          )}

          <div className="p-6 space-y-5">
            <AlertDialogHeader className="text-center space-y-1">
              <AlertDialogTitle className="font-heading text-base">Start your 14-day free trial</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                Try all Pro features free for 14 days. Cancel anytime.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Side by side previews */}
            {proUpgradeSnapshot && proWatermarkSnapshot && (
              <div className="grid grid-cols-2 gap-3">
                {/* Pro version */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-heading font-semibold text-primary">Pro</span>
                  <div className="relative overflow-hidden shadow-lg">
                    <img
                      src={proUpgradeSnapshot}
                      alt="Your Pro design"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-heading font-semibold text-foreground">Your design</span>
                </div>
                {/* Free version */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-heading font-medium text-muted-foreground">Free</span>
                  <div className="relative overflow-hidden shadow-sm">
                    <img
                      src={proWatermarkSnapshot}
                      alt="Free version"
                      className="w-full h-auto object-contain opacity-75"
                    />
                    <div className="absolute bottom-0 right-0 z-10 px-1.5 py-0.5 text-[6px] font-semibold text-white/90" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
                      Made with <span className="font-bold">LazyFaceless.com</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-heading text-muted-foreground">Without Pro features</span>
                </div>
              </div>
            )}

            {/* Feature comparison — synced with pricing page */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-heading font-semibold text-primary mb-2">Pro</h4>
                <ul className="space-y-1.5">
                  {[
                    "Create unlimited designs",
                    "Save unlimited designs",
                    "PNG download",
                    "Re-edit your designs",
                    "Premium templates",
                    "Wallpaper backgrounds",
                    "Background image upload",
                    "Upload your own image library",
                    "Background image remover",
                    "Image filters",
                    "Logo upload",
                    "Word colors",
                    "All formats & sizes",
                    "No watermark",
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-foreground">
                      <span className="text-primary">✓</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-2">Free</h4>
                <ul className="space-y-1.5">
                  {[
                    { text: "Create unlimited designs", included: true },
                    { text: "Save unlimited designs", included: true },
                    { text: "PNG download", included: true },
                    { text: "Re-edit your designs", included: false },
                    { text: "Premium templates", included: false },
                    { text: "Wallpaper backgrounds", included: false },
                    { text: "Background image upload", included: false },
                    { text: "Upload your own image library", included: false },
                    { text: "Background image remover", included: false },
                    { text: "Image filters", included: false },
                    { text: "Logo upload", included: false },
                    { text: "Word colors", included: false },
                    { text: "All formats & sizes", included: false },
                    { text: "No watermark", included: false },
                  ].map((f, i) => (
                    <li key={i} className={`flex items-center gap-1.5 ${f.included ? "text-foreground" : "text-muted-foreground/50 line-through"}`}>
                      <span>{f.included ? "✓" : "✗"}</span>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <AlertDialogFooter className="flex-col sm:flex-col gap-2 pt-1">
              <AlertDialogAction onClick={() => { setShowProUpgradePrompt(false); setProUpgradeSnapshot(null); setProWatermarkSnapshot(null); navigate("/pricing"); }} className="w-full py-2.5 text-sm font-heading font-semibold">
                Start 14-day free trial
              </AlertDialogAction>
              <AlertDialogCancel onClick={handleDownloadFreeVersion} className="w-full border-0 text-muted-foreground hover:text-foreground text-xs mt-0">
                Download free version
              </AlertDialogCancel>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pro signup prompt for guests using pro features */}
      <AlertDialog open={showProSignupPrompt} onOpenChange={(o) => !o && setShowProSignupPrompt(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Nice design! 🎨</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Your first PRO design is on us. Sign up for free to download it.
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
      {!user && <SiteFooter />}
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
