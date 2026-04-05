import { useNavigate } from "react-router-dom";
import { Check, X, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import { useState, useEffect } from "react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Create and save unlimited quotes.",
    cta: "Get Started",
    highlighted: false,
    features: [
      { text: "Unlimited quote designs", included: true },
      
      { text: "PNG download", included: true },
      { text: "Save unlimited quotes", included: true },
      
      { text: "Word colors", included: false },
      { text: "Text formatting", included: false },
      { text: "Background image upload", included: false },
      { text: "No watermark", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    description: "Everything in Free, plus premium tools.",
    cta: "Upgrade to Pro",
    highlighted: false,
    features: [
      { text: "Everything in Free", included: true },
      { text: "Word colors", included: true },
      
      { text: "Background image upload", included: true },
      
      { text: "No watermark", included: true },
      { text: "Save and re-edit your quotes", included: true },
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  const handleCta = (tierName: string) => {
    if (tierName === "Free") {
      if (user) {
        navigate("/");
      } else {
        setShowAuthModal(true);
      }
    } else {
      // TODO: integrate payments
      if (!user) {
        setShowAuthModal(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-shadows-into-light text-xl font-bold tracking-tight text-foreground">Lazy Quotes</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center space-y-4 mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl border p-6 flex flex-col ${
                tier.highlighted
                  ? "border-foreground bg-card shadow-xl scale-[1.02]"
                  : "border-border bg-card/50"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-heading font-semibold uppercase tracking-widest bg-foreground text-background">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold text-foreground">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <button
                onClick={() => handleCta(tier.name)}
                className={`w-full py-2.5 rounded-md font-heading text-sm font-medium transition-opacity hover:opacity-90 mb-6 ${
                  tier.highlighted
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground"
                }`}
              >
                {tier.cta}
              </button>

              <ul className="space-y-2.5 flex-1">
                {tier.features.map((f, i) => (
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
          ))}
        </div>

      </main>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Pricing;
