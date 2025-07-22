import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { CheckCircle, AlertTriangle, XCircle, Info, Bell, Zap } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'custom';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  timestamp: Date;
  read?: boolean;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  
  // Core notification functions
  notify: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  success: (title: string, message?: string, options?: Partial<Notification>) => string;
  error: (title: string, message?: string, options?: Partial<Notification>) => string;
  warning: (title: string, message?: string, options?: Partial<Notification>) => string;
  info: (title: string, message?: string, options?: Partial<Notification>) => string;
  loading: (title: string, message?: string) => string;
  
  // Management functions
  dismiss: (id: string) => void;
  dismissAll: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  remove: (id: string) => void;
  removeAll: () => void;
  
  // Update functions
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  
  // Batch operations
  getNotificationsByType: (type: NotificationType) => Notification[];
  getUnreadNotifications: () => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATION_ICONS = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  loading: <Zap className="w-5 h-5 text-purple-500 animate-pulse" />,
  custom: <Bell className="w-5 h-5 text-primary" />,
};

const DEFAULT_DURATIONS = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000,
  loading: 0, // Loading notifications persist until manually dismissed
  custom: 5000,
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Auto-dismiss notifications after their duration
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    notifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0 && !notification.persistent) {
        const timer = setTimeout(() => {
          dismiss(notification.id);
        }, notification.duration);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications]);

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const notify = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = generateId();
    const timestamp = new Date();
    
    const notification: Notification = {
      ...notificationData,
      id,
      timestamp,
      duration: notificationData.duration ?? DEFAULT_DURATIONS[notificationData.type],
      icon: notificationData.icon ?? NOTIFICATION_ICONS[notificationData.type],
      read: false,
    };

    setNotifications(prev => [notification, ...prev]);

    // Also show as toast for immediate feedback
    const variant = notification.type === 'error' ? 'destructive' : 'default';
    
    toast({
      variant,
      title: notification.title,
      description: notification.message,
      duration: notification.type === 'loading' ? undefined : (notification.duration || 4000),
      action: notification.action ? React.createElement(ToastAction, {
        altText: notification.action.label,
        onClick: notification.action.onClick,
        children: notification.action.label,
      }) : undefined,
    });

    return id;
  }, [generateId]);

  const success = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return notify({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [notify]);

  const error = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return notify({
      type: 'error',
      title,
      message,
      ...options,
    });
  }, [notify]);

  const warning = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return notify({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }, [notify]);

  const info = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    return notify({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [notify]);

  const loading = useCallback((title: string, message?: string) => {
    return notify({
      type: 'loading',
      title,
      message,
      persistent: true,
    });
  }, [notify]);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const removeAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateNotification = useCallback((id: string, updates: Partial<Notification>) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, ...updates } : n)
    );
  }, []);

  const getNotificationsByType = useCallback((type: NotificationType) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  const unreadCount = getUnreadNotifications().length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    notify,
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    dismissAll,
    markAsRead,
    markAllAsRead,
    remove,
    removeAll,
    updateNotification,
    getNotificationsByType,
    getUnreadNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Convenience hooks for specific notification types
export function useNotificationActions() {
  const { success, error, warning, info, loading, updateNotification, dismiss } = useNotifications();
  
  return {
    success,
    error,
    warning,
    info,
    loading,
    updateNotification,
    dismiss,
    // Helper for loading states
    withLoading: async <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error?: string;
      }
    ): Promise<T> => {
      const loadingId = loading(messages.loading);
      
      try {
        const result = await promise;
        dismiss(loadingId);
        success(messages.success);
        return result;
      } catch (err) {
        dismiss(loadingId);
        error(messages.error || 'Operation failed', err instanceof Error ? err.message : 'Unknown error');
        throw err;
      }
    },
  };
}
