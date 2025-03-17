
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
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";

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
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/generate" element={
            <ProtectedRoute>
              <GeneratePlanPage />
            </ProtectedRoute>
          } />
          <Route path="/email" element={
            <ProtectedRoute>
              <EmailPage />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
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
        <AuthProvider>
          <WebsiteProvider>
            <AppContent />
          </WebsiteProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
