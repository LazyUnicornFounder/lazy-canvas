import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Download } from "lucide-react";
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
  const { user, signOut } = useAuth();
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
  const previewRef = useRef<HTMLDivElement>(null);

  // Clear draft from localStorage once user is logged in and state is restored
  useEffect(() => {
    if (user) {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [user]);

  const handleDownloadClick = useCallback(() => {
    if (!user) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(editorState));
      setShowAuthModal(true);
      return;
    }
    setShowGalleryPrompt(true);
  }, [user, editorState]);

  const performDownload = useCallback(async (shareToGallery: boolean) => {
    setShowGalleryPrompt(false);
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      if (shareToGallery && user) {
        await supabase.from("gallery_submissions").insert({
          user_id: user.id,
          editor_state: editorState as any,
        });
      }
      const canvas = await html2canvas(previewRef.current, {
        scale: 3, useCORS: true, logging: false, backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `quote-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch { console.error("Failed to export"); }
    finally { setDownloading(false); }
  }, [user, editorState]);

  const socials = [
    editorState.socialUsername
      ? `${SOCIAL_PLATFORMS.find((p) => p.value === editorState.socialPlatform)?.prefix || ""}${editorState.socialUsername}`
      : "",
    editorState.website,
  ].filter(Boolean).join(" · ");

  const isFreeUser = true;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-[1600px] mx-auto">
          <h1 className="font-dancing text-xl font-semibold tracking-tight text-foreground">
            &ldquo;Lazy Quotes&rdquo;
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate("/gallery")}
              className="text-xs font-heading font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Gallery
            </button>
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

      <section className="min-h-[calc(100vh-4rem)] flex px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto w-full flex gap-8 lg:gap-12 py-6">
          {/* Left — text + editor */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="space-y-2 mb-6">
              <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight text-foreground leading-tight">
                Create awesome quotes for your socials.
              </h2>
              <p className="text-muted-foreground text-sm max-w-md">
                Design beautiful, shareable quote images in seconds. Pick fonts, colors, layouts — download and post.
              </p>
            </div>
            <div className="flex-1 min-h-0">
              <QuoteEditor state={editorState} onChange={setEditorState} />
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
              {downloading ? "Exporting…" : user ? "Download PNG" : "Sign up to download"}
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
      />
      <GalleryPromptDialog
        open={showGalleryPrompt}
        onClose={() => setShowGalleryPrompt(false)}
        onConfirm={performDownload}
      />
    </div>
  );
};

export default Index;
