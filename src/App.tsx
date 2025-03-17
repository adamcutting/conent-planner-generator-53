
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EmailPage from "./pages/EmailPage";
import GeneratePlanPage from "./pages/GeneratePlanPage";
import AppHeader from "./components/AppHeader";
import { WebsiteProvider, useWebsite } from "./contexts/WebsiteContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { selectedWebsite } = useWebsite();
  
  // Update CSS variable whenever selectedWebsite changes
  useEffect(() => {
    document.documentElement.style.setProperty('--website-color', selectedWebsite.color);
  }, [selectedWebsite]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/generate" element={<GeneratePlanPage />} />
          <Route path="/" element={<Index />} />
          <Route path="/email" element={<EmailPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WebsiteProvider>
          <AppContent />
        </WebsiteProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
