import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Bot,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Activity,
  Rocket
} from "lucide-react";
import { CrawlerStatus, STATUS_LABELS, STATUS_COLORS } from "@shared/crawler";

interface DashboardStats {
  total: number;
  by_status: Record<CrawlerStatus, number>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/crawlers/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    {
      title: "Total Crawlers",
      value: stats?.total || 0,
      icon: Spider,
      description: "Active web crawlers",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "In Progress",
      value: stats?.by_status[CrawlerStatus.IN_PROGRESS] || 0,
      icon: Activity,
      description: "Currently running",
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      title: "Completed",
      value: stats?.by_status[CrawlerStatus.COMPLETED] || 0,
      icon: CheckCircle,
      description: "Successfully finished",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Failed",
      value: stats?.by_status[CrawlerStatus.FAILED] || 0,
      icon: AlertCircle,
      description: "Require attention",
      gradient: "from-red-500 to-orange-500"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {getGreeting()}, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening with your web crawlers today.
            </p>
          </div>
          <Button asChild className="btn-gradient mt-4 sm:mt-0">
            <Link to="/dashboard/crawlers/new">
              <Plus className="w-4 h-4 mr-2" />
              New Crawler
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="glass border-border/50 hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.gradient} p-2`}>
                  <stat.icon className="w-full h-full text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {isLoading ? '...' : stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Status Overview */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Status Overview
              </CardTitle>
              <CardDescription>
                Current status distribution of your crawlers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.values(CrawlerStatus).map((status) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="secondary" 
                      className={`${STATUS_COLORS[status]} border`}
                    >
                      {STATUS_LABELS[status]}
                    </Badge>
                  </div>
                  <span className="font-medium text-foreground">
                    {isLoading ? '...' : stats?.by_status[status] || 0}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks to get you started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="ghost" className="w-full justify-start hover:bg-accent/50">
                <Link to="/dashboard/crawlers/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Crawler
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start hover:bg-accent/50">
                <Link to="/dashboard/crawlers">
                  <Spider className="w-4 h-4 mr-2" />
                  View All Crawlers
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
              </Button>
              
              <Button asChild variant="ghost" className="w-full justify-start hover:bg-accent/50">
                <Link to="/dashboard/analytics">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        {(!stats || stats.total === 0) && !isLoading && (
          <Card className="glass border-border/50 bg-gradient-to-r from-primary/5 to-gradient-via/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="w-6 h-6 mr-2 text-primary" />
                Welcome to AiScraper!
              </CardTitle>
              <CardDescription>
                Get started by creating your first web crawler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                AiScraper makes it easy to manage and monitor your web scraping projects. 
                Create your first crawler to start extracting valuable data from the web.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="btn-gradient">
                  <Link to="/dashboard/crawlers/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Crawler
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="btn-glass">
                  <Link to="/dashboard/analytics">
                    View Documentation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
