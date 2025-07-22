import { useAuth } from "@/contexts/AuthContext";

export function AuthDebug() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50">
      <div>Loading: {isLoading ? "true" : "false"}</div>
      <div>Authenticated: {isAuthenticated ? "true" : "false"}</div>
      <div>User: {user ? user.email : "null"}</div>
      <div>Token: {localStorage.getItem("auth_token") ? "exists" : "none"}</div>
    </div>
  );
}
