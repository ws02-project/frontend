import { useAuthContext } from "@asgardeo/auth-react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { state, trySignInSilently } = useAuthContext();
  const location = useLocation();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Try to restore session from storage on mount
    const initAuth = async () => {
      if (!state.isAuthenticated && !state.isLoading) {
        try {
          await trySignInSilently();
        } catch {
          // Silent sign-in failed, user needs to login
        }
      }
      setIsInitializing(false);
    };

    // Give SDK a moment to initialize from storage
    const timer = setTimeout(() => {
      if (!state.isLoading) {
        initAuth();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [state.isAuthenticated, state.isLoading, trySignInSilently]);

  // Show loading during initial check or SDK loading
  if (state.isLoading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

