import { useNavigate } from "react-router-dom";
import { Check, X, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MainNav, LogoWithTagline } from "@/components/MainNav";
import { SiteFooter } from "@/components/SiteFooter";
import AuthModal from "@/components/AuthModal";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const POLAR_PRO_MONTHLY_ID = "5513f675-e192-4626-815d-375b75d84e43";
const POLAR_PRO_YEARLY_ID = "3652d762-6798-41e9-89d5-3603e0f5a6f5";

// Unified feature list: [text, freeIncluded, proIncluded]
const featureRows: [string, boolean, boolean][] = [
  ["Unlimited designs", true, true],
  ["PNG download", true, true],
  ["Save unlimited designs", true, true],
  ["Re-edit your designs", false, true],
  ["Premium templates", false, true],
  ["Wallpaper backgrounds", false, true],
  ["Background image upload", false, true],
  ["Upload your own image library", false, true],
  ["Background image remover", false, true],
  ["Image filters", false, true],
  ["Word colors", false, true],
  ["All formats & sizes", false, true],
  ["No watermark", false, true],
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user, isPro, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("signup");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  const handleCheckout = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (isPro) {
      toast.info("You're already a Pro subscriber!");
      return;
    }

    setCheckoutLoading(true);
    try {
      const productId = billingInterval === "yearly" ? POLAR_PRO_YEARLY_ID : POLAR_PRO_MONTHLY_ID;
      const successUrl = `${window.location.origin}/pricing?checkout=success&checkout_id={CHECKOUT_ID}`;
      const { data, error } = await supabase.functions.invoke("polar-checkout", {
        body: { productId, successUrl },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCta = (tierName: string) => {
    if (tierName === "Free") {
      if (user) {
        navigate("/");
      } else {
        setShowAuthModal(true);
      }
    } else {
      handleCheckout();
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      toast.success("Welcome to Pro! 🎉 Your subscription is now active.");
      window.history.replaceState({}, "", "/pricing");
    }
  }, []);

  const proPrice = billingInterval === "yearly" ? "$4" : "$5";
  const proPeriod = billingInterval === "yearly" ? "/mo" : "/month";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <LogoWithTagline />
            <MainNav />
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={signOut}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
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

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center space-y-4 mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Simple, transparent pricing
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Start for free. Upgrade when you need to remove the watermark or unlock premium tools.
          </p>
          <p className="text-sm text-muted-foreground">
            All plans include unlimited designs. No credit card required for Free.
          </p>
          <p className="text-xs text-muted-foreground">
            Secure payments with Polar and Stripe.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setBillingInterval("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingInterval === "monthly"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval("yearly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              billingInterval === "yearly"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-primary text-primary-foreground">
              Save 20%
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
          {/* Free tier */}
          <div className="relative rounded-xl border border-border bg-card/50 p-6 flex flex-col">
            <div className="space-y-3 mb-6 md:min-h-[140px]">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Free
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-foreground">$0</span>
              </div>
              <p className="text-sm text-muted-foreground">Create and save unlimited designs.</p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-6">
              {featureRows.map(([text, freeIncluded], i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  {freeIncluded ? (
                    <Check className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={freeIncluded ? "text-foreground" : "text-muted-foreground/50"}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCta("Free")}
              className="w-full py-2.5 rounded-md font-heading text-sm font-medium transition-opacity hover:opacity-90 bg-foreground text-background disabled:opacity-50 mt-auto"
            >
              {user && !isPro ? "Current Plan" : "Get Started"}
            </button>
          </div>

          {/* Pro tier */}
          <div className="relative rounded-xl border border-border bg-card/50 p-6 flex flex-col">
            <div className="space-y-3 mb-6 md:min-h-[140px]">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Pro
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-foreground">{proPrice}</span>
                <span className="text-sm text-muted-foreground">{proPeriod}</span>
                {billingInterval === "yearly" && (
                  <span className="text-xs text-muted-foreground ml-1">($48/year)</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Everything in Free, plus premium tools.</p>
              <p className="text-xs font-medium text-primary">14-day free trial · Cancel anytime.</p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-6">
              {featureRows.map(([text, , proIncluded], i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  {proIncluded ? (
                    <Check className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={proIncluded ? "text-foreground" : "text-muted-foreground/50"}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCta("Pro")}
              disabled={checkoutLoading}
              className="w-full py-2.5 rounded-md font-heading text-sm font-medium transition-opacity hover:opacity-90 bg-foreground text-background disabled:opacity-50 mt-auto"
            >
              {isPro ? "Current Plan" : checkoutLoading ? "Loading..." : "Start 14-day free trial"}
            </button>
          </div>
        </div>
      </main>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} defaultMode={authModalMode} />
      <SiteFooter />
    </div>
  );
};

export default Pricing;
