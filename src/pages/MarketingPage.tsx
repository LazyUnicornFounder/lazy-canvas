import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TemplateLibrary from "@/components/TemplateLibrary";
import { MainNav, LogoWithTagline } from "@/components/MainNav";
import type { QuoteEditorState } from "@/components/QuoteEditor";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface MarketingPageConfig {
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  description: string;
  features: Feature[];
  templateCategory?: string;
  ctaText?: string;
}

const DRAFT_KEY = "lazy-quotes-draft";

const MarketingPage = ({ config }: { config: MarketingPageConfig }) => {
  const navigate = useNavigate();
  const [bgOpacity] = useState(0.4);

  useEffect(() => {
    document.title = config.title;
    return () => { document.title = "Lazy Faceless — Marketing content for anything."; };
  }, [config.title]);

  const handleApplyTemplate = (partial: Partial<QuoteEditorState>) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(partial));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-6">
            <LogoWithTagline />
            <MainNav />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-foreground text-background font-heading text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Open Editor
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-foreground text-background font-heading text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Open Editor
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-[900px] mx-auto text-center space-y-6">
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-foreground tracking-tight leading-tight">
            {config.headline}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-[600px] mx-auto leading-relaxed">
            {config.subheadline}
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-heading text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            {config.ctaText || "Start Creating"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.features.map((feature, i) => (
            <div key={i} className="border border-border rounded-lg p-6 space-y-3 bg-card">
              <span className="text-2xl">{feature.icon}</span>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl font-bold text-foreground">Ready-Made Templates</h2>
            <p className="text-sm text-muted-foreground">Pick a template, customize it, download. Done in seconds.</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <TemplateLibrary
              onApply={handleApplyTemplate}
              backgroundOpacity={bgOpacity}
              defaultCategory={config.templateCategory}
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border px-4 sm:px-6 py-16 text-center">
        <div className="max-w-[600px] mx-auto space-y-4">
          <h2 className="font-heading text-xl font-bold text-foreground">Ready to create?</h2>
          <p className="text-sm text-muted-foreground">{config.description}</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-heading text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            {config.ctaText || "Start Creating"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 sm:px-6 py-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-xs text-muted-foreground">
            Lazy Faceless is part of{" "}
            <a href="https://lazyfactoryventures.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
              Lazy Factory Ventures
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MarketingPage;
