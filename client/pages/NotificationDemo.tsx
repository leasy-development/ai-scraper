import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  Sparkles,
  Download,
  Upload,
  Save,
  Trash2,
  Copy,
  RefreshCw,
} from "lucide-react";

import {
  useNotifications,
  useNotificationActions,
} from "@/contexts/NotificationContext";
import {
  InlineNotification,
  SuccessNotification,
  ErrorNotification,
  WarningNotification,
  InfoNotification,
  LoadingNotification,
} from "@/components/notifications/InlineNotification";
import {
  quickNotify,
  operationNotify,
  authNotify,
  systemNotify,
  ProgressNotification,
  batchNotify,
} from "@/lib/notifications";
import {
  useApiNotifications,
  useCrawlerNotifications,
  usePropertyNotifications,
} from "@/hooks/useApiNotifications";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function NotificationDemo() {
  const { notifications, unreadCount } = useNotifications();
  const { success, error, warning, info, loading, dismiss } =
    useNotificationActions();
  const apiNotifications = useApiNotifications();
  const crawlerNotifications = useCrawlerNotifications();
  const propertyNotifications = usePropertyNotifications();

  const [customTitle, setCustomTitle] = useState("Custom Notification");
  const [customMessage, setCustomMessage] = useState(
    "This is a custom notification message.",
  );
  const [showInlineDemo, setShowInlineDemo] = useState(true);

  // Demo API operations
  const simulateApiOperation = async (
    type: "success" | "error",
    delay = 2000,
  ) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    if (type === "error") {
      throw new Error("Simulated API error");
    }
    return { data: "Success response" };
  };

  const runProgressDemo = () => {
    const progress = new ProgressNotification(
      "Processing Data",
      "Initializing...",
    );

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;

      if (currentProgress <= 100) {
        progress.updateProgress(
          currentProgress,
          `Processing step ${currentProgress / 20}...`,
        );
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        progress.complete("All data processed successfully!");
      }
    }, 800);
  };

  const runBatchDemo = async () => {
    const items = Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`);

    await batchNotify.processItems(
      items,
      async (item, index) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (index === 2) throw new Error(`Failed to process ${item}`);
        return `Processed ${item}`;
      },
      {
        title: "Batch Processing Demo",
        showProgress: true,
        successMessage: (results) =>
          `Successfully processed ${results.length} items`,
        errorMessage: (errors) => `Failed to process ${errors.length} items`,
      },
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Notification System Demo
          </h1>
          <p className="text-muted-foreground">
            Test all notification features and components
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="outline" className="text-sm">
              <Bell className="w-4 h-4 mr-1" />
              {notifications.length} Total Notifications
            </Badge>
            <Badge variant="destructive" className="text-sm">
              {unreadCount} Unread
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quick Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() =>
                  success("Success!", "Operation completed successfully")
                }
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Success
              </Button>
              <Button
                onClick={() => error("Error!", "Something went wrong")}
                variant="destructive"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Error
              </Button>
              <Button
                onClick={() => warning("Warning!", "Please review this action")}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Warning
              </Button>
              <Button
                onClick={() => info("Info", "Here is some useful information")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Info className="w-4 h-4 mr-2" />
                Info
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                size="sm"
                onClick={() => success(customTitle, customMessage)}
              >
                Custom Success
              </Button>
              <Button
                size="sm"
                onClick={() => error(customTitle, customMessage)}
                variant="destructive"
              >
                Custom Error
              </Button>
              <Button
                size="sm"
                onClick={() => warning(customTitle, customMessage)}
                variant="outline"
              >
                Custom Warning
              </Button>
              <Button
                size="sm"
                onClick={() => info(customTitle, customMessage)}
                variant="secondary"
              >
                Custom Info
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Operation Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Operation Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                size="sm"
                onClick={() => operationNotify.created("Property")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Created
              </Button>
              <Button
                size="sm"
                onClick={() => operationNotify.updated("Crawler")}
              >
                <Save className="w-4 h-4 mr-2" />
                Updated
              </Button>
              <Button
                size="sm"
                onClick={() => operationNotify.deleted("Item")}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deleted
              </Button>
              <Button size="sm" onClick={() => operationNotify.copied("URL")}>
                <Copy className="w-4 h-4 mr-2" />
                Copied
              </Button>
              <Button
                size="sm"
                onClick={() => operationNotify.uploaded("File")}
              >
                <Upload className="w-4 h-4 mr-2" />
                Uploaded
              </Button>
              <Button
                size="sm"
                onClick={() => operationNotify.downloaded("Report")}
              >
                <Download className="w-4 h-4 mr-2" />
                Downloaded
              </Button>
              <Button
                size="sm"
                onClick={() => operationNotify.networkError()}
                variant="destructive"
              >
                Network Error
              </Button>
              <Button
                size="sm"
                onClick={() => operationNotify.unauthorizedError()}
                variant="destructive"
              >
                Unauthorized
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Advanced Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={() => {
                  const id = loading("Processing...", "This will take a while");
                  setTimeout(() => dismiss(id), 3000);
                }}
              >
                <Loader2 className="w-4 h-4 mr-2" />
                Loading State
              </Button>
              <Button onClick={runProgressDemo}>Progress Demo</Button>
              <Button onClick={runBatchDemo}>Batch Processing</Button>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={() =>
                  apiNotifications.crud.create(
                    () => simulateApiOperation("success"),
                    "test item",
                  )
                }
              >
                API Success Demo
              </Button>
              <Button
                onClick={() =>
                  apiNotifications.crud
                    .create(() => simulateApiOperation("error"), "test item")
                    .catch(() => {})
                }
                variant="outline"
              >
                API Error Demo
              </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={() => systemNotify.updateAvailable()}
                variant="outline"
              >
                Update Available
              </Button>
              <Button
                onClick={() => systemNotify.connectionLost()}
                variant="destructive"
              >
                Connection Lost
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inline Notifications Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Inline Notifications
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowInlineDemo(!showInlineDemo)}
              >
                {showInlineDemo ? "Hide" : "Show"} Examples
              </Button>
            </CardTitle>
          </CardHeader>
          {showInlineDemo && (
            <CardContent className="space-y-4">
              <SuccessNotification
                title="Operation Successful"
                message="Your data has been saved successfully."
                action={{
                  label: "View Details",
                  onClick: () => info("Details", "Opening details view..."),
                }}
              />

              <ErrorNotification
                title="Upload Failed"
                message="The file could not be uploaded due to size restrictions."
                variant="compact"
              />

              <WarningNotification
                title="Storage Almost Full"
                message="You have used 95% of your storage quota. Consider upgrading your plan."
                variant="banner"
                action={{
                  label: "Upgrade Now",
                  onClick: () =>
                    info("Upgrade", "Redirecting to upgrade page..."),
                }}
              />

              <InfoNotification
                title="New Feature Available"
                message="Check out our new dashboard analytics features."
                variant="compact"
                onDismiss={() => console.log("Info dismissed")}
              />

              <LoadingNotification
                title="Processing Your Request"
                message="Please wait while we process your data..."
                variant="default"
              />
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
