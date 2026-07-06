import { useAuth } from "@/contexts/AuthContext";
import { Redirect, useLocation } from "wouter";
function ProtectedRoute({
  children,
  allowedRoles = []
}) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();
  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center p-8">Loading...</div>;
  }
  if (!user) {
    return <Redirect to={`/login?redirect=${encodeURIComponent(location)}`} />;
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Redirect to={`/${user.role}/dashboard`} />;
  }
  return <>{children}</>;
}
export {
  ProtectedRoute
};
