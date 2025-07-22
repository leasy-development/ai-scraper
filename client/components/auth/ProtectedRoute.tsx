import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "@/components/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Loading
        variant="brand"
        size="lg"
        text="Verifying authentication..."
        fullScreen
        timeout={15000} // 15 second timeout
        onTimeout={() => {
          console.error("Auth verification timed out");
          // Force reload to try again
          window.location.reload();
        }}
      />
    );
  }

  if (!isAuthenticated) {
    // Redirect to home page with the current location as state
    // This allows us to redirect back after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
