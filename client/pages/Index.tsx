import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield, 
  Globe, 
  Palette, 
  Code2, 
  Layers3,
  Rocket,
  Star,
  CheckCircle,
  PlayCircle
} from "lucide-react";

export default function Index() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
              AI-Powered Web Scraping
            </Badge>
          </div>

          {/* Main headline */}
          <h1 className={`text-display-2xl sm:text-display-xl md:text-display-2xl font-bold mb-6 transition-all duration-1000 animation-delay-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            <span className="gradient-text animate-gradient-shift">
              Intelligent Data
            </span>
            <br />
            <span className="text-foreground">
              Extraction Platform
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-balance transition-all duration-1000 animation-delay-400 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            Harness the power of AI to extract, transform, and analyze web data at scale.
            Built for modern businesses that need reliable, intelligent web scraping solutions.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 transition-all duration-1000 animation-delay-600 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            <Button className="btn-gradient group">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="ghost" className="btn-glass group">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 animation-delay-800 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            {[
              { label: "Active Users", value: "100K+", icon: Globe },
              { label: "Performance", value: "99.9%", icon: Zap },
              { label: "Security", value: "A+ Grade", icon: Shield },
              { label: "Satisfaction", value: "4.9/5", icon: Star }
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
              <span className="gradient-text">Revolutionary</span> Capabilities
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Discover the advanced features that make our platform the ultimate choice for modern digital experiences.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Rocket,
                title: "Lightning Fast",
                description: "Optimized for speed with cutting-edge performance techniques and modern architecture.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Palette,
                title: "Beautiful Design",
                description: "Stunning visual design with glassmorphism effects and smooth animations.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Code2,
                title: "Developer Friendly",
                description: "Built with modern tools and best practices for seamless development experience.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level security with advanced encryption and compliance standards.",
                gradient: "from-red-500 to-orange-500"
              },
              {
                icon: Zap,
                title: "Real-time Updates",
                description: "Instant synchronization and live updates across all connected devices.",
                gradient: "from-yellow-500 to-amber-500"
              },
              {
                icon: Globe,
                title: "Global Scale",
                description: "Worldwide infrastructure with edge computing for optimal performance.",
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
                <div className="mt-6 flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="glass px-4 py-2 text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4 mr-2" />
            Trusted by Industry Leaders
          </Badge>
          <h2 className="text-display-lg font-bold mb-6">
            Join <span className="gradient-text">10,000+</span> Happy Customers
          </h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto text-balance">
            Leading companies worldwide trust our platform to deliver exceptional digital experiences.
          </p>

          {/* Company logos placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="glass rounded-xl p-6 h-20 flex items-center justify-center">
                <div className="w-full h-8 bg-gradient-to-r from-muted to-muted-foreground rounded opacity-30" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-gradient-via/10 to-gradient-to/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-display-lg font-bold mb-6">
            Ready to <span className="gradient-text">Transform</span> Your Digital Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 text-balance">
            Join thousands of forward-thinking companies already using our cutting-edge platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-gradient text-lg px-8 py-6">
              Start Your Journey
              <Rocket className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="ghost" className="btn-glass text-lg px-8 py-6">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
