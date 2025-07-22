import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Activity, Clock } from "lucide-react";

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Monitor crawler performance and data insights
          </p>
        </div>

        {/* Coming Soon Notice */}
        <Card className="glass border-border/50 bg-primary/5">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-gradient-via flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold gradient-text">
              Analytics Dashboard
            </CardTitle>
            <CardDescription className="text-muted-foreground max-w-lg mx-auto">
              Comprehensive analytics and insights for your web crawling operations are coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <Badge className="glass px-4 py-2">
                Coming Soon
              </Badge>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center space-y-2">
                  <TrendingUp className="w-8 h-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Performance Metrics</h3>
                  <p className="text-sm text-muted-foreground">Track success rates and execution times</p>
                </div>
                <div className="text-center space-y-2">
                  <Activity className="w-8 h-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Real-time Monitoring</h3>
                  <p className="text-sm text-muted-foreground">Live status updates and alerts</p>
                </div>
                <div className="text-center space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Historical Data</h3>
                  <p className="text-sm text-muted-foreground">Analyze trends over time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
