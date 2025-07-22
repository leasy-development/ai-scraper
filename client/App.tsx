import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Crawlers from "./pages/Crawlers";
import CrawlerForm from "./pages/CrawlerForm";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Properties from "./pages/Properties";
import NotificationDemo from "./pages/NotificationDemo";
import NotFound from "./pages/NotFound";
import { AuthDebug } from "./components/AuthDebug";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { TestNotifications } from "./components/TestNotifications";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                {process.env.NODE_ENV === 'development' && <AuthDebug />}
                <TestNotifications />
                <Routes>
                {/* Public routes with navigation */}
                <Route path="/" element={
                  <div>
                    <Navigation />
                    <main>
                      <Index />
                    </main>
                    <Footer />
                  </div>
                } />

                {/* Protected dashboard routes without public navigation */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/crawlers" element={
                  <ProtectedRoute>
                    <Crawlers />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/crawlers/new" element={
                  <ProtectedRoute>
                    <CrawlerForm />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/crawlers/:id/edit" element={
                  <ProtectedRoute>
                    <CrawlerForm />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/properties" element={
                  <ProtectedRoute>
                    <Properties />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/analytics" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/notifications" element={
                  <ProtectedRoute>
                    <NotificationDemo />
                  </ProtectedRoute>
                } />

                {/* Catch-all route */}
                <Route path="*" element={
                  <div>
                    <Navigation />
                    <main>
                      <NotFound />
                    </main>
                    <Footer />
                  </div>
                } />
              </Routes>
            </div>
          </BrowserRouter>
            </TooltipProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
