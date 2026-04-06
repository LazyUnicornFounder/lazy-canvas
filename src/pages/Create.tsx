import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { Download, LogOut, ArrowLeft } from "lucide-react";
import DesignPreview, {
  type SocialPlatform,
} from "@/components/DesignPreview";
import DesignEditor, {
  type DesignEditorState,
  DEFAULT_EDITOR_STATE,
  SOCIAL_PLATFORMS,
} from "@/components/DesignEditor";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
import { AppSidebar } from "@/components/AppSidebar";
import { useUserDesigns, type UserDesign } from "@/hooks/useUserDesigns";

const DRAFT_KEY = "lazy-designs-draft";

const Create = () => {
  const { user, signOut, isPro } = useAuth();
  const { designs, loading: designsLoading, saveDesign, deleteDesign } = useUserDesigns();
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState<DesignEditorState>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        localStorage.removeItem(DRAFT_KEY);
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_EDITOR_STATE;
  });
  const [activeDesignId, setActiveQuoteId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProUpgradePrompt, setShowProUpgradePrompt] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const isFreeUser = !isPro;

  const openProEditPrompt = useCallback(() => {
    setShowProUpgradePrompt(true);
  }, []);

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

  const handleSelectDesign = (quote: UserDesign) => {
    if (!isPro) {
      openProEditPrompt();
      return;
    }
    setActiveQuoteId(quote.id);
    setEditorState(quote.editor_state);
  };

  const handleNewDesign = () => {
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
              <span className="font-orbitron text-sm font-bold tracking-widest text-foreground uppercase">Lazy Faceless</span>
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
            <DesignEditor state={editorState} onChange={setEditorState} isPro={isPro} />
          </div>

          <div className="hidden lg:flex sticky top-4 flex-shrink-0 flex-col gap-3" style={{ width: "clamp(260px, 25vw, 320px)" }}>
            <div className="w-full">
              <DesignPreview
                ref={previewRef}
                quote={editorState.quote}
                authorName={editorState.authorName}
                authorPhoto={editorState.authorPhoto}
                photoShape={editorState.photoShape}
                socialPlatform={editorState.socialUsername ? editorState.socialPlatform as SocialPlatform : undefined}
                socials={socials}
                aspectRatio="square"
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
                authorPosition={editorState.authorPosition}
                backgroundColor={editorState.backgroundColor}
                isBold={editorState.isBold}
                isItalic={editorState.isItalic}
                coloredWords={editorState.coloredWords}
                showWatermark={isFreeUser}
                showQuotationMarks={editorState.showQuotationMarks}
                photoStroke={editorState.photoStroke}
                logo={editorState.logo}
                logoPosition={editorState.logoPosition}
                logoSize={editorState.logoSize}
                onAutoFontSize={(size) => setEditorState((prev) => ({ ...prev, fontSize: size }))}
              />
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

      <AlertDialog open={showProUpgradePrompt} onOpenChange={setShowProUpgradePrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">This is a Pro feature</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Upgrade to Pro to re-edit your saved designs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col gap-2">
            <AlertDialogAction
              onClick={() => {
                setShowProUpgradePrompt(false);
                navigate("/pricing");
              }}
              className="w-full"
            >
              Upgrade to Pro
            </AlertDialogAction>
            <AlertDialogCancel className="w-full mt-0">Maybe later</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            activeDesignId={activeDesignId}
            onSelectDesign={handleSelectDesign}
            onNewDesign={handleNewDesign}
            currentEditorState={editorState}
            designs={designs}
            loading={designsLoading}
            saveDesign={saveDesign}
            deleteDesign={deleteDesign}
            onLockedEdit={openProEditPrompt}
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
