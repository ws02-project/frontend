import { useAuthContext } from "@asgardeo/auth-react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, Zap, Shield, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function LoginPage() {
  const { state, signIn, trySignInSilently } = useAuthContext();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!state.isAuthenticated && !state.isLoading) {
        try {
          // Try to restore session silently
          await trySignInSilently();
        } catch {
          // No existing session
        }
      }
      setIsCheckingAuth(false);
    };

    // Small delay to let SDK initialize
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [state.isAuthenticated, state.isLoading, trySignInSilently]);

  // Show loading while checking auth
  if (state.isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to intended destination or home if authenticated
  if (state.isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  const handleLogin = () => {
    signIn();
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">TaskFlow</h1>
            </div>
            <p className="text-xl text-white/70 max-w-md">
              Streamline your projects, collaborate with your team, and achieve more together.
            </p>
          </div>

          <div className="space-y-6">
            <Feature
              icon={<Users className="h-5 w-5" />}
              title="Team Collaboration"
              description="Work together seamlessly with real-time updates"
            />
            <Feature
              icon={<Shield className="h-5 w-5" />}
              title="Enterprise Security"
              description="Bank-grade security with Asgardeo authentication"
            />
            <Feature
              icon={<Zap className="h-5 w-5" />}
              title="Lightning Fast"
              description="Built for speed with modern microservices"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center lg:hidden">
              <Zap className="h-9 w-9 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleLogin}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              size="lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign in with Asgardeo
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/60">{description}</p>
      </div>
    </div>
  );
}

