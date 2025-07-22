import { cn } from "@/lib/utils";
import { Loader2, Bot, Zap, RefreshCw, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'brand' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
  timeout?: number; // Timeout in milliseconds
  onTimeout?: () => void; // Callback when timeout occurs
  showTimeoutWarning?: boolean; // Show warning before timeout
}

export default function Loading({
  variant = 'spinner',
  size = 'md',
  text,
  className,
  fullScreen = false,
  timeout,
  onTimeout,
  showTimeoutWarning = true
}: LoadingProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!timeout) return;

    // Show warning at 80% of timeout duration
    const warningTime = timeout * 0.8;
    const warningTimer = setTimeout(() => {
      if (showTimeoutWarning) {
        setShowWarning(true);
      }
    }, warningTime);

    // Trigger timeout
    const timeoutTimer = setTimeout(() => {
      setTimedOut(true);
      onTimeout?.();
    }, timeout);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(timeoutTimer);
    };
  }, [timeout, onTimeout, showTimeoutWarning]);

  if (timedOut) {
    return (
      <div className={containerClasses}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">Taking longer than expected</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This operation is taking longer than usual. There might be a connectivity issue.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const containerClasses = cn(
    "flex items-center justify-center",
    fullScreen && "min-h-screen w-full",
    className
  );

  const renderLoadingIcon = () => {
    const iconClasses = cn(sizeClasses[size], "animate-spin text-primary");
    
    switch (variant) {
      case 'brand':
        return (
          <div className="relative">
            <div className={cn(sizeClasses[size], "rounded-lg bg-gradient-to-r from-primary to-gradient-via flex items-center justify-center animate-pulse")}>
              <Bot className={cn(sizeClasses[size === 'xl' ? 'lg' : size === 'lg' ? 'md' : 'sm'], "text-white")} />
            </div>
          </div>
        );
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-primary animate-bounce",
                  size === 'sm' && "w-2 h-2",
                  size === 'md' && "w-3 h-3", 
                  size === 'lg' && "w-4 h-4",
                  size === 'xl' && "w-5 h-5"
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>
        );
      case 'pulse':
        return (
          <div className="relative">
            <div className={cn(sizeClasses[size], "rounded-full bg-primary/20 animate-ping")} />
            <div className={cn(sizeClasses[size], "absolute top-0 left-0 rounded-full bg-primary animate-pulse")} />
          </div>
        );
      case 'minimal':
        return <RefreshCw className={iconClasses} />;
      default:
        return <Loader2 className={iconClasses} />;
    }
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-2">
        {renderLoadingIcon()}
        {text && (
          <p className={cn(
            "text-muted-foreground font-medium",
            textSizeClasses[size]
          )}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

// Specialized loading components for common use cases
export function PageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <Loading
      variant="brand"
      size="lg"
      text={text}
      fullScreen
      className="bg-background"
    />
  );
}

export function CardLoading({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loading variant="spinner" size="md" text={text} />
    </div>
  );
}

export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return <Loading variant="spinner" size={size} className="mr-2" />;
}

export function TableLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loading 
        variant="dots" 
        size="md" 
        text="Loading data..." 
      />
    </div>
  );
}

export function DataLoading({ 
  title = "Loading", 
  description 
}: { 
  title?: string; 
  description?: string; 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Loading variant="brand" size="xl" />
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground max-w-sm">{description}</p>
        )}
      </div>
    </div>
  );
}

// Skeleton loading components
export function SkeletonCard() {
  return (
    <div className="glass rounded-3xl p-8 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-14 h-14 bg-muted rounded-2xl" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded" />
            <div className="h-3 bg-muted rounded w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 animate-pulse">
          <div className="h-10 w-10 bg-muted rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-8 w-8 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

// Loading wrapper component
interface LoadingWrapperProps {
  loading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  overlay?: boolean;
}

export function LoadingWrapper({ 
  loading, 
  children, 
  fallback,
  overlay = false 
}: LoadingWrapperProps) {
  if (!loading) return <>{children}</>;

  if (overlay) {
    return (
      <div className="relative">
        {children}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          {fallback || <Loading variant="brand" size="lg" />}
        </div>
      </div>
    );
  }

  return <>{fallback || <Loading variant="spinner" size="md" />}</>;
}
