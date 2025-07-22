import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading, {
  PageLoading,
  CardLoading,
  ButtonLoading,
  TableLoading,
  DataLoading,
  SkeletonCard,
  SkeletonTable,
  LoadingWrapper,
} from "@/components/Loading";
import { useLoading, useAsyncOperation } from "@/hooks/useLoading";
import { Separator } from "@/components/ui/separator";

export default function LoadingExamples() {
  const [showPageLoading, setShowPageLoading] = useState(false);
  const { loading: buttonLoading, withLoading } = useLoading();
  const { loading: asyncLoading, execute } = useAsyncOperation();

  const handleButtonTest = () => {
    withLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });
  };

  const handleAsyncTest = () => {
    execute(async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return { message: "Success!" };
    });
  };

  if (showPageLoading) {
    return <PageLoading text="Loading application..." />;
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Loading Components
          </h1>
          <p className="text-muted-foreground">
            Comprehensive loading states and components for the AiScraper
            application
          </p>
        </div>

        {/* Basic Loading Variants */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Loading Variants</CardTitle>
            <CardDescription>
              Different loading animations and styles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              <div className="text-center space-y-2">
                <Loading variant="spinner" size="lg" />
                <p className="text-sm text-muted-foreground">Spinner</p>
              </div>
              <div className="text-center space-y-2">
                <Loading variant="dots" size="lg" />
                <p className="text-sm text-muted-foreground">Dots</p>
              </div>
              <div className="text-center space-y-2">
                <Loading variant="pulse" size="lg" />
                <p className="text-sm text-muted-foreground">Pulse</p>
              </div>
              <div className="text-center space-y-2">
                <Loading variant="brand" size="lg" />
                <p className="text-sm text-muted-foreground">Brand</p>
              </div>
              <div className="text-center space-y-2">
                <Loading variant="minimal" size="lg" />
                <p className="text-sm text-muted-foreground">Minimal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Sizes */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Loading Sizes</CardTitle>
            <CardDescription>
              Different sizes for various use cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center space-y-2">
                <Loading variant="brand" size="sm" />
                <p className="text-sm text-muted-foreground">Small</p>
              </div>
              <div className="text-center space-y-2">
                <Loading variant="brand" size="md" />
                <p className="text-sm text-muted-foreground">Medium</p>
              </div>
              <div className="text-center space-y-2">
                <Loading variant="brand" size="lg" />
                <p className="text-sm text-muted-foreground">Large</p>
              </div>
              <div className="text-center space-y-2">
                <Loading variant="brand" size="xl" />
                <p className="text-sm text-muted-foreground">Extra Large</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialized Loading Components */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Specialized Components</CardTitle>
            <CardDescription>
              Pre-configured loading components for common scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h4 className="font-medium mb-4">Card Loading</h4>
              <div className="border border-border/50 rounded-lg">
                <CardLoading text="Loading card content..." />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-4">Table Loading</h4>
              <div className="border border-border/50 rounded-lg">
                <TableLoading />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-4">Data Loading</h4>
              <DataLoading
                title="Loading Crawlers"
                description="Fetching your web crawler data from the server..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Interactive Examples */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Interactive Examples</CardTitle>
            <CardDescription>
              Test loading states with real interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleButtonTest}
                disabled={buttonLoading}
                className="btn-gradient"
              >
                {buttonLoading && <ButtonLoading />}
                {buttonLoading ? "Loading..." : "Test Button Loading"}
              </Button>

              <Button
                onClick={handleAsyncTest}
                disabled={asyncLoading}
                variant="outline"
              >
                {asyncLoading && <ButtonLoading />}
                {asyncLoading ? "Processing..." : "Test Async Operation"}
              </Button>

              <Button
                onClick={() => setShowPageLoading(true)}
                variant="destructive"
              >
                Test Page Loading
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>• Button Loading: Shows inline loading spinner</p>
              <p>• Async Operation: Demonstrates async operation handling</p>
              <p>• Page Loading: Full-screen loading overlay</p>
            </div>
          </CardContent>
        </Card>

        {/* Skeleton Loading */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Skeleton Loading</CardTitle>
            <CardDescription>
              Skeleton placeholders for content loading
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-4">Skeleton Cards</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-4">Skeleton Table</h4>
              <SkeletonTable />
            </div>
          </CardContent>
        </Card>

        {/* Loading Wrapper */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Loading Wrapper</CardTitle>
            <CardDescription>
              Conditional loading with overlay support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoadingWrapper
              loading={asyncLoading}
              overlay={true}
              fallback={
                <Loading variant="brand" size="lg" text="Processing data..." />
              }
            >
              <div className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Content Area</h3>
                <p className="text-muted-foreground">
                  This content will be overlaid with a loading spinner when the
                  async operation is running.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-muted/50 rounded-lg" />
                  ))}
                </div>
              </div>
            </LoadingWrapper>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Usage Guidelines</CardTitle>
            <CardDescription>
              When to use each loading component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <strong className="text-foreground">PageLoading:</strong>
                <span className="text-muted-foreground ml-2">
                  Full-screen loading for initial app load or page transitions
                </span>
              </div>
              <div>
                <strong className="text-foreground">CardLoading:</strong>
                <span className="text-muted-foreground ml-2">
                  Loading state within cards or contained areas
                </span>
              </div>
              <div>
                <strong className="text-foreground">ButtonLoading:</strong>
                <span className="text-muted-foreground ml-2">
                  Inline loading for buttons during form submission
                </span>
              </div>
              <div>
                <strong className="text-foreground">TableLoading:</strong>
                <span className="text-muted-foreground ml-2">
                  Loading state for data tables and lists
                </span>
              </div>
              <div>
                <strong className="text-foreground">SkeletonCard/Table:</strong>
                <span className="text-muted-foreground ml-2">
                  Content placeholders during initial data fetch
                </span>
              </div>
              <div>
                <strong className="text-foreground">LoadingWrapper:</strong>
                <span className="text-muted-foreground ml-2">
                  Conditional loading with optional overlay
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
