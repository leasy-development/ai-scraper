import React, { useState } from "react";
import { Bell, X, Check, Trash2, Archive, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useNotifications,
  NotificationType,
  Notification,
} from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    remove,
    removeAll,
    getNotificationsByType,
    getUnreadNotifications,
  } = useNotifications();

  const [filterType, setFilterType] = useState<
    NotificationType | "all" | "unread"
  >("all");
  const [isOpen, setIsOpen] = useState(false);

  const getFilteredNotifications = () => {
    switch (filterType) {
      case "unread":
        return getUnreadNotifications();
      case "all":
        return notifications;
      default:
        return getNotificationsByType(filterType);
    }
  };

  const filteredNotifications = getFilteredNotifications();

  const getTypeColor = (type: NotificationType) => {
    const colors = {
      success: "text-green-600 bg-green-50 border-green-200",
      error: "text-red-600 bg-red-50 border-red-200",
      warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
      info: "text-blue-600 bg-blue-50 border-blue-200",
      loading: "text-purple-600 bg-purple-50 border-purple-200",
      custom: "text-primary bg-primary/10 border-primary/20",
    };
    return colors[type];
  };

  const NotificationItem = ({
    notification,
  }: {
    notification: Notification;
  }) => (
    <Card
      className={cn(
        "mb-3 transition-all duration-200 hover:shadow-md",
        !notification.read && "border-l-4 border-l-primary bg-primary/5",
        notification.read && "opacity-75",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-0.5">{notification.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4
                  className={cn(
                    "font-medium text-sm",
                    !notification.read && "text-foreground",
                    notification.read && "text-muted-foreground",
                  )}
                >
                  {notification.title}
                </h4>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs px-2 py-0.5",
                    getTypeColor(notification.type),
                  )}
                >
                  {notification.type}
                </Badge>
              </div>
              {notification.message && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {notification.message}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(notification.timestamp, {
                    addSuffix: true,
                  })}
                </span>
                {notification.action && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-3 text-xs"
                    onClick={notification.action.onClick}
                  >
                    {notification.action.label}
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!notification.read && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => markAsRead(notification.id)}
                title="Mark as read"
              >
                <Check className="w-3 h-3" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => remove(notification.id)}
              title="Remove"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center min-w-[1.25rem]"
              variant="destructive"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterType("all")}>
                    All notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("unread")}>
                    Unread only
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterType("success")}>
                    Success
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("error")}>
                    Errors
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("warning")}>
                    Warnings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("info")}>
                    Info
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs
            value={filterType}
            onValueChange={(value) => setFilterType(value as any)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
              <TabsTrigger value="error" className="text-xs">
                Errors
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="h-96">
          <div className="p-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {filterType === "unread"
                    ? "No unread notifications"
                    : "No notifications"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="border-t p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={removeAll}
              className="w-full text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
