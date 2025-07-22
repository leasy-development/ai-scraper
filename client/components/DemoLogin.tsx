import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Key,
  ArrowRight,
  Loader2,
  CheckCircle,
  Info,
} from "lucide-react";

interface DemoLoginProps {
  onClose?: () => void;
}

export function DemoLogin({ onClose }: DemoLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoCredentials = {
    email: "demo@aiscraper.com",
    password: "demo123",
  };

  const handleDemoLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      await login(demoCredentials.email, demoCredentials.password);
      if (onClose) onClose();

      // Small delay to ensure auth state propagates, then navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="w-full max-w-md mx-auto glass border-border/50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4">
          <User className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold gradient-text">
          Demo Login
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Try AiScraper with pre-loaded demo data
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Alert className="border-blue-500/50 bg-blue-500/10">
          <Info className="w-4 h-4 text-blue-500" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            This demo account includes sample crawlers to showcase the
            platform's capabilities.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                Demo Credentials
              </Badge>
              <Badge
                variant="outline"
                className="text-xs text-green-600 border-green-200"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Ready to Use
              </Badge>
            </div>
          </div>

          <div className="glass rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
              </div>
              <div className="flex items-center space-x-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {demoCredentials.email}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(demoCredentials.email)}
                  className="h-6 w-6 p-0"
                >
                  📋
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Password:</span>
              </div>
              <div className="flex items-center space-x-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {demoCredentials.password}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(demoCredentials.password)}
                  className="h-6 w-6 p-0"
                >
                  📋
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              What's included:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 6 sample web crawlers with different statuses</li>
              <li>• E-commerce, news, social media, and job data examples</li>
              <li>• Full dashboard functionality and CRUD operations</li>
              <li>• Real-time status management and filtering</li>
            </ul>
          </div>

          <Button
            onClick={handleDemoLogin}
            className="w-full btn-gradient"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                Access Demo Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            No registration required • Full functionality available
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
