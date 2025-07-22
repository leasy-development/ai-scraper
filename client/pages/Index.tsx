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
  Palette, 
  Code2, 
  Layers3,
  Rocket,
  Star,
  CheckCircle,
  PlayCircle,
  Monitor,
  Clock,
  TrendingUp,
  Users,
  Eye,
  Check,
  X
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
              AI-Powered Web Scraping Platform
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
              in One Smart Dashboard
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-balance transition-all duration-1000 animation-delay-400 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            Save time, automate tasks, and get real-time status tracking for all your web scraping projects. 
            The most powerful crawler management platform for modern teams.
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
                <Button className="btn-gradient group">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="ghost" className="btn-glass group" onClick={scrollToDemo}>
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Try Live Demo
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 animation-delay-800 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
            {[
              { label: "Active Crawlers", value: "50K+", icon: Globe },
              { label: "Success Rate", value: "99.9%", icon: Zap },
              { label: "Data Processed", value: "10TB+", icon: TrendingUp },
              { label: "Happy Users", value: "2K+", icon: Users }
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
              <span className="gradient-text">Everything</span> You Need to Manage Crawlers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Powerful tools and intelligent automation to streamline your web scraping workflow.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Monitor,
                title: "Smart Dashboard",
                description: "Get a complete overview of all your crawlers with real-time status updates and performance metrics.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Clock,
                title: "Automated Scheduling",
                description: "Set up crawlers to run automatically on custom schedules with intelligent retry mechanisms.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Shield,
                title: "Advanced Security",
                description: "Enterprise-grade security with proxy rotation, user-agent switching, and anti-detection features.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: TrendingUp,
                title: "Performance Analytics",
                description: "Detailed insights into crawler performance, success rates, and data quality metrics.",
                gradient: "from-red-500 to-orange-500"
              },
              {
                icon: Code2,
                title: "API Integration",
                description: "RESTful APIs and webhooks for seamless integration with your existing tools and workflows.",
                gradient: "from-yellow-500 to-amber-500"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Multi-user support with role-based permissions and collaborative crawler management.",
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

      {/* Demo Section */}
      <section id="demo" className="py-32 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="glass px-4 py-2 text-sm font-medium mb-6">
            <Eye className="w-4 h-4 mr-2" />
            Product Demo
          </Badge>
          <h2 className="text-display-lg font-bold mb-6">
            See <span className="gradient-text">AiScraper</span> in Action
          </h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto text-balance">
            Watch how easy it is to create, manage, and monitor web crawlers with our intuitive dashboard.
          </p>

          {/* Demo placeholder */}
          <div className="glass rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-r from-primary/20 to-gradient-via/20 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <PlayCircle className="w-20 h-20 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Interactive Demo</h3>
                <p className="text-muted-foreground">Click to see the dashboard in action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="glass px-4 py-2 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-display-lg font-bold mb-6">
              Loved by <span className="gradient-text">Thousands</span> Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              See what our customers are saying about AiScraper and how it transformed their data operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Data Engineer at TechCorp",
                content: "AiScraper reduced our data collection time by 80%. The automated scheduling and real-time monitoring are game-changers for our team.",
                rating: 5,
                avatar: "SC"
              },
              {
                name: "Marcus Rodriguez",
                role: "Product Manager at DataFlow",
                content: "The most intuitive crawler management platform I've used. Setting up complex scraping workflows has never been this simple.",
                rating: 5,
                avatar: "MR"
              },
              {
                name: "Emily Watson",
                role: "Research Lead at InsightLab",
                content: "The anti-detection features and reliability are outstanding. We've achieved 99.9% uptime across all our crawlers.",
                rating: 5,
                avatar: "EW"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="glass border-border/50 hover:scale-105 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-gradient-via flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="glass px-4 py-2 text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4 mr-2" />
              Simple Pricing
            </Badge>
            <h2 className="text-display-lg font-bold mb-6">
              Choose Your <span className="gradient-text">Perfect</span> Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Start free and scale as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Perfect for getting started",
                features: [
                  "Up to 5 crawlers",
                  "1,000 requests/month",
                  "Basic scheduling",
                  "Email support",
                  "7-day data retention"
                ],
                notIncluded: [
                  "Advanced analytics",
                  "Priority support",
                  "Custom integrations"
                ],
                cta: "Get Started Free",
                popular: false
              },
              {
                name: "Pro",
                price: "$49",
                period: "per month",
                description: "Best for growing teams",
                features: [
                  "Unlimited crawlers",
                  "100,000 requests/month",
                  "Advanced scheduling",
                  "Priority support",
                  "30-day data retention",
                  "Advanced analytics",
                  "API access",
                  "Team collaboration"
                ],
                notIncluded: [
                  "Custom integrations",
                  "Dedicated support"
                ],
                cta: "Start Pro Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "$199",
                period: "per month",
                description: "For large-scale operations",
                features: [
                  "Everything in Pro",
                  "Unlimited requests",
                  "Custom integrations",
                  "Dedicated support",
                  "90-day data retention",
                  "SSO integration",
                  "Custom SLA",
                  "White-label options"
                ],
                notIncluded: [],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`glass border-border/50 hover:scale-105 transition-all duration-300 relative ${plan.popular ? 'ring-2 ring-primary/50' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-gradient-via text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center opacity-50">
                        <X className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full mt-8 ${plan.popular ? 'btn-gradient' : 'btn-glass'}`}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-gradient-via/10 to-gradient-to/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-display-lg font-bold mb-6">
            Ready to <span className="gradient-text">Transform</span> Your Web Scraping?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 text-balance">
            Join thousands of teams already using AiScraper to automate their data collection workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button asChild className="btn-gradient text-lg px-8 py-6">
                <Link to="/dashboard">
                  <Rocket className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <Button className="btn-gradient text-lg px-8 py-6">
                Start Free Today
                <Rocket className="w-5 h-5 ml-2" />
              </Button>
            )}
            <Button variant="ghost" className="btn-glass text-lg px-8 py-6">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
