import React from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { NotificationType } from '@/contexts/NotificationContext';

interface InlineNotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: 'default' | 'compact' | 'banner';
  showIcon?: boolean;
}

const NOTIFICATION_STYLES = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    badge: 'bg-green-100 text-green-800 border-green-300',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: <XCircle className="w-5 h-5 text-red-600" />,
    badge: 'bg-red-100 text-red-800 border-red-300',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <Info className="w-5 h-5 text-blue-600" />,
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  loading: {
    container: 'bg-purple-50 border-purple-200 text-purple-800',
    icon: <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />,
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  custom: {
    container: 'bg-primary/10 border-primary/20 text-primary',
    icon: <Info className="w-5 h-5 text-primary" />,
    badge: 'bg-primary/20 text-primary border-primary/30',
  },
};

export function InlineNotification({
  type,
  title,
  message,
  onDismiss,
  action,
  className,
  variant = 'default',
  showIcon = true,
}: InlineNotificationProps) {
  const styles = NOTIFICATION_STYLES[type];

  if (variant === 'compact') {
    return (
      <div className={cn(
        'flex items-center gap-3 p-3 rounded-lg border',
        styles.container,
        className
      )}>
        {showIcon && styles.icon}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{title}</p>
          {message && <p className="text-xs opacity-90 mt-1">{message}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-3 text-xs hover:bg-black/5"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-black/5"
              onClick={onDismiss}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={cn(
        'w-full p-4 border-l-4',
        styles.container,
        className
      )}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {showIcon && (
              <div className="mt-0.5">
                {styles.icon}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm">{title}</h4>
                <Badge variant="outline" className={cn('text-xs', styles.badge)}>
                  {type}
                </Badge>
              </div>
              {message && (
                <p className="text-sm opacity-90">{message}</p>
              )}
              {action && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 h-8 px-3 text-xs hover:bg-black/5"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              )}
            </div>
          </div>
          {onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-black/5"
              onClick={onDismiss}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn(
      'p-4 rounded-lg border shadow-sm',
      styles.container,
      className
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {showIcon && (
            <div className="mt-0.5">
              {styles.icon}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold">{title}</h4>
              <Badge variant="outline" className={cn('text-xs', styles.badge)}>
                {type}
              </Badge>
            </div>
            {message && (
              <p className="text-sm opacity-90 mb-3">{message}</p>
            )}
            {action && (
              <Button
                size="sm"
                variant="ghost"
                className="hover:bg-black/5"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
          </div>
        </div>
        {onDismiss && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-black/5"
            onClick={onDismiss}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Convenience components for specific types
export function SuccessNotification(props: Omit<InlineNotificationProps, 'type'>) {
  return <InlineNotification {...props} type="success" />;
}

export function ErrorNotification(props: Omit<InlineNotificationProps, 'type'>) {
  return <InlineNotification {...props} type="error" />;
}

export function WarningNotification(props: Omit<InlineNotificationProps, 'type'>) {
  return <InlineNotification {...props} type="warning" />;
}

export function InfoNotification(props: Omit<InlineNotificationProps, 'type'>) {
  return <InlineNotification {...props} type="info" />;
}

export function LoadingNotification(props: Omit<InlineNotificationProps, 'type'>) {
  return <InlineNotification {...props} type="loading" />;
}
