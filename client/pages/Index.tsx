import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { DemoLogin } from "@/components/DemoLogin";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield, 
  Globe, 
  Code2, 
  Layers3,
  CheckCircle,
  PlayCircle,
  Monitor,
  Clock,
  TrendingUp,
  Users,
  Eye,
  Terminal,
  Database,
  Settings
} from "lucide-react";

export default function Index() {
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/30 to-gradient-via/30 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gradient-via/30 to-gradient-to/30 rounded-full filter blur-3xl animate-float animation-delay-1000" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Badge */}
          <div className={`inline-block transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <Badge className="glass px-4 py-2 text-sm font-medium mb-6 hover-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              Developer & Admin Tool
            </Badge>
          </div>

          {/* Main headline */}
          <h1 className={`text-display-2xl sm:text-display-xl md:text-display-2xl font-bold mb-6 transition-all duration-1000 animation-delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            <span className="text-foreground">
              Manage All Your
            </span>
            <br />
            <span className="gradient-text animate-gradient-shift">
              Web Crawlers
            </span>
            <br />
            <span className="text-foreground">
              in One Dashboard
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-balance transition-all duration-1000 animation-delay-400 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            A powerful management interface for developers and administrators to monitor, 
            configure, and track web scraping operations.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-1000 animation-delay-600 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            {isAuthenticated ? (
              <Button asChild className="btn-gradient group">
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            ) : (
              <>
                <Button className="btn-gradient group" onClick={scrollToDemo}>
                  Try Demo Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 animation-delay-800 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            {[
              { label: "Crawlers Managed", value: "6", icon: Globe },
              { label: "Status Tracking", value: "Real-time", icon: Zap },
              { label: "Data Sources", value: "Multiple", icon: TrendingUp },
              { label: "Admin Users", value: "Multi", icon: Users }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:bg-accent/50">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <Badge className="glass px-4 py-2 text-sm font-medium mb-6">
              <Layers3 className="w-4 h-4 mr-2" />
              Core Features
            </Badge>
            <h2 className="text-display-lg font-bold mb-6">
              <span className="gradient-text">Developer-Focused</span> Management Tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Built for developers and administrators who need reliable web scraping management.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Terminal,
                title: "Command Center",
                description: "Centralized dashboard to monitor all your web crawlers with real-time status updates and logs.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Database,
                title: "Data Management",
                description: "Track crawler configurations, URLs, descriptions, and execution status in one organized interface.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Settings,
                title: "Configuration Control",
                description: "Easy-to-use forms for creating, editing, and managing crawler settings and parameters.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "Access Control",
                description: "Multi-user authentication with secure login and role-based access management.",
                gradient: "from-red-500 to-orange-500"
              },
              {
                icon: Code2,
                title: "Developer API",
                description: "RESTful API endpoints for programmatic access and integration with existing tools.",
                gradient: "from-yellow-500 to-amber-500"
              },
              {
                icon: Monitor,
                title: "Status Monitoring",
                description: "Visual status indicators with filterable views: Todo, In Progress, QA, Completed, Failed.",
                gradient: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="glass rounded-3xl p-8 hover:scale-105 transition-all duration-500 group hover-glow"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.gradient} p-3 mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-32 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="glass px-4 py-2 text-sm font-medium mb-6">
            <Eye className="w-4 h-4 mr-2" />
            Live Demo
          </Badge>
          <h2 className="text-display-lg font-bold mb-6">
            Try <span className="gradient-text">AiScraper</span> Dashboard
          </h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto text-balance">
            Access the full dashboard with sample crawler data to explore all features.
          </p>

          {/* Interactive Demo Login */}
          <div className="max-w-lg mx-auto">
            <DemoLogin />
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="glass px-4 py-2 text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4 mr-2" />
              Quick Start
            </Badge>
            <h2 className="text-display-lg font-bold mb-6">
              Get <span className="gradient-text">Started</span> in Minutes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Simple setup process for developers and administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Access Dashboard",
                description: "Login with your credentials or try the demo to explore the interface."
              },
              {
                step: "2", 
                title: "Add Crawlers",
                description: "Create new web crawlers by specifying target URLs and configurations."
              },
              {
                step: "3",
                title: "Monitor & Manage",
                description: "Track status, update configurations, and manage your scraping operations."
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-gradient-via text-white font-bold text-lg flex items-center justify-center mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
