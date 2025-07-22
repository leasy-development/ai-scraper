import { useNotificationActions } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";

export function TestNotifications() {
  const { success, error, warning, info } = useNotificationActions();

  const generateTestNotifications = () => {
    success(
      "Crawler Started",
      "E-commerce scraper is now running successfully",
    );
    error(
      "Connection Failed",
      "Unable to connect to target website. Please check the URL.",
    );
    warning(
      "Rate Limited",
      "Request rate is approaching limits. Consider reducing frequency.",
    );
    info(
      "New Update",
      "Dashboard has been updated with new features and improvements.",
    );
  };

  // Only show in development mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Button
      onClick={generateTestNotifications}
      variant="outline"
      size="sm"
      className="fixed bottom-4 left-4 z-50 opacity-50 hover:opacity-100"
    >
      Generate Test Notifications
    </Button>
  );
}
