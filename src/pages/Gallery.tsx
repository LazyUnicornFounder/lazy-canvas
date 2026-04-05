import { useNavigate } from "react-router-dom";
import QuoteGallery from "@/components/QuoteGallery";
import { MainNav, LogoWithTagline } from "@/components/MainNav";

const Gallery = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
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
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8">
          Gallery
        </h1>
        <QuoteGallery hideWrapper />
      </main>
    </div>
  );
};

export default Gallery;
