import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-gradient-via/20 rounded-full filter blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gradient-via/20 to-gradient-to/20 rounded-full filter blur-3xl animate-float animation-delay-1000" />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold gradient-text mb-4 animate-fade-in">404</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-gradient-via mx-auto rounded-full" />
        </div>

        {/* Error message */}
        <h2 className="text-3xl font-bold text-foreground mb-4 animate-fade-in-up">
          Page Not Found
        </h2>
        <p className="text-xl text-muted-foreground mb-12 text-balance animate-fade-in-up animation-delay-200">
          The page you're looking for doesn't exist or has been moved to a different location.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
          <Button asChild className="btn-gradient">
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="ghost" className="btn-glass">
            <Link to="/" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Helpful links */}
        <div className="mt-16 glass rounded-2xl p-8 animate-fade-in-up animation-delay-600">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Looking for something specific?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Link 
              to="/" 
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent/50"
            >
              Homepage
            </Link>
            <a 
              href="#features" 
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent/50"
            >
              Features
            </a>
            <a 
              href="#about" 
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent/50"
            >
              About Us
            </a>
            <a 
              href="#contact" 
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent/50"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
