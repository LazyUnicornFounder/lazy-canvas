import { useNavigate } from "react-router-dom";
import { Check, X, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MainNav, LogoWithTagline } from "@/components/MainNav";
import AuthModal from "@/components/AuthModal";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const POLAR_PRO_MONTHLY_ID = "5513f675-e192-4626-815d-375b75d84e43";
const POLAR_PRO_YEARLY_ID = "3652d762-6798-41e9-89d5-3603e0f5a6f5";

const proFeatures = [
  { text: "Everything in Free", included: true },
  { text: "Premium templates", included: true },
  { text: "Wallpaper backgrounds", included: true },
  { text: "Background image upload", included: true },
  { text: "Background image remover", included: true },
  { text: "Image filters", included: true },
  { text: "Word colors", included: true },
  { text: "No watermark", included: true },
  { text: "Save unlimited quotes", included: true },
  { text: "Re-edit your quotes", included: true },
];

const freeFeatures = [
  { text: "Unlimited designs", included: true },
  { text: "PNG download", included: true },
  { text: "Save unlimited quotes", included: false },
  { text: "Premium templates", included: false },
  { text: "Wallpaper backgrounds", included: false },
  { text: "Background image upload", included: false },
  { text: "Background image remover", included: false },
  { text: "Image filters", included: false },
  { text: "Word colors", included: false },
  { text: "Text formatting", included: false },
  { text: "No watermark", included: false },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user, isPro } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <LogoWithTagline />
            <MainNav />
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
            All plans include unlimited quote designs. No credit card required for Free.
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free tier */}
          <div className="relative rounded-xl border border-border bg-card/50 p-6 flex flex-col">
            <div className="space-y-3 mb-6">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Free
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-foreground">$0</span>
              </div>
              <p className="text-sm text-muted-foreground">Create and save unlimited quotes.</p>
            </div>

            <button
              onClick={() => handleCta("Free")}
              className="w-full py-2.5 rounded-md font-heading text-sm font-medium transition-opacity hover:opacity-90 mb-6 bg-foreground text-background disabled:opacity-50"
            >
              {user && !isPro ? "Current Plan" : "Get Started"}
            </button>

            <ul className="space-y-2.5 flex-1">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  {f.included ? (
                    <Check className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={f.included ? "text-foreground" : "text-muted-foreground/50"}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro tier */}
          <div className="relative rounded-xl border border-border bg-card/50 p-6 flex flex-col">
            <div className="space-y-3 mb-6">
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
            </div>

            <button
              onClick={() => handleCta("Pro")}
              disabled={checkoutLoading}
              className="w-full py-2.5 rounded-md font-heading text-sm font-medium transition-opacity hover:opacity-90 mb-6 bg-foreground text-background disabled:opacity-50"
            >
              {isPro ? "Current Plan" : checkoutLoading ? "Loading..." : "Upgrade to Pro"}
            </button>

            <ul className="space-y-2.5 flex-1">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  {f.included ? (
                    <Check className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={f.included ? "text-foreground" : "text-muted-foreground/50"}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Pricing;
