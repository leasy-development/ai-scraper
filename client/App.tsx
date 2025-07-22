import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Crawlers from "./pages/Crawlers";
import CrawlerForm from "./pages/CrawlerForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes with navigation */}
              <Route path="/" element={
                <div>
                  <Navigation />
                  <main>
                    <Index />
                  </main>
                </div>
              } />

              {/* Protected dashboard routes without public navigation */}
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/crawlers" element={<Crawlers />} />
                    <Route path="/crawlers/new" element={<CrawlerForm />} />
                    <Route path="/crawlers/:id/edit" element={<CrawlerForm />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Catch-all route */}
              <Route path="*" element={
                <div>
                  <Navigation />
                  <main>
                    <NotFound />
                  </main>
                </div>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
