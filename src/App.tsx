import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import Settings from "./pages/Settings.tsx";
import Admin from "./pages/Admin.tsx";
import Pricing from "./pages/Pricing.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import Gallery from "./pages/Gallery.tsx";
import NotFound from "./pages/NotFound.tsx";
import MarketingPage from "./pages/MarketingPage.tsx";
import { MARKETING_PAGES } from "./pages/marketingConfigs.ts";
import ErrorBoundary from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/privacy" element={<Privacy />} />
            {MARKETING_PAGES.map((config) => (
              <Route
                key={config.slug}
                path={`/${config.slug}`}
                element={<MarketingPage config={config} />}
              />
            ))}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
    </ErrorBoundary>
);

export default App;
