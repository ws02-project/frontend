import { useAuthContext } from "@asgardeo/auth-react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, Sparkles, Layers, ArrowRight, Lock } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export function LoginPage() {
  const { state, signIn, trySignInSilently } = useAuthContext();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const silentLoginAttempted = useRef(false);

  // Check for existing session on mount - only once
  useEffect(() => {
    const checkAuth = async () => {
      // Prevent multiple silent login attempts
      if (silentLoginAttempted.current) {
        setIsCheckingAuth(false);
        return;
      }
      
      if (!state.isAuthenticated && !state.isLoading) {
        silentLoginAttempted.current = true;
        try {
          await trySignInSilently();
        } catch {
          // No existing session - this is expected for unauthenticated users
        }
      }
      setIsCheckingAuth(false);
    };

    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isLoading]); // Only depend on isLoading, not trySignInSilently

  // Show loading while checking auth
  if (state.isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
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
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Left Side - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 relative z-10">
        <div className="space-y-10 max-w-lg">
          {/* Logo & Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-blue-500" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">TaskFlow</h1>
                <p className="text-sm text-muted-foreground">Project Management Platform</p>
              </div>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Streamline your workflow, empower your team, and deliver exceptional results.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-5">
            <FeatureItem
              icon={<Layers className="h-5 w-5" />}
              title="Intuitive Project Management"
              description="Organize tasks, track progress, and hit deadlines with ease"
            />
            <FeatureItem
              icon={<Lock className="h-5 w-5" />}
              title="Enterprise-Grade Security"
              description="SOC 2 compliant with Asgardeo identity management"
            />
            <FeatureItem
              icon={<Sparkles className="h-5 w-5" />}
              title="Smart Automation"
              description="Automate workflows and focus on what matters most"
            />
          </div>

          {/* Social proof */}
          <div className="pt-6 border-t border-border/50">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-10 w-10 rounded-full border-2 border-background bg-blue-500/20"
                    style={{ 
                      opacity: 1 - i * 0.15,
                      zIndex: 4 - i 
                    }}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Join 10,000+ teams</p>
                <p className="text-xs text-muted-foreground">Already using TaskFlow</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-foreground">TaskFlow</span>
            </div>
          </div>

          {/* Login Card */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center space-y-1 pb-6">
              <div className="mx-auto mb-4 h-16 w-16 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <LogIn className="h-7 w-7 text-blue-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription className="text-base">
                Sign in to continue to your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={handleLogin}
                className="w-full h-12 text-base font-medium group"
                size="lg"
              >
                <span className="flex items-center justify-center gap-2">
                  Sign in with Asgardeo
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              {/* Terms */}
              <p className="text-center text-xs text-muted-foreground leading-relaxed pt-2">
                By signing in, you agree to our{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-8">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 h-11 w-11 rounded-lg bg-blue-500/10 flex items-center justify-center">
        <div className="text-blue-500">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-0.5">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
