import { useAuthContext } from "@asgardeo/auth-react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, Sparkles, Shield, Layers, ArrowRight } from "lucide-react";
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
          await trySignInSilently();
        } catch {
          // No existing session
        }
      }
      setIsCheckingAuth(false);
    };

    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [state.isAuthenticated, state.isLoading, trySignInSilently]);

  // Show loading while checking auth
  if (state.isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 blur-xl opacity-50 animate-pulse" />
            <Loader2 className="relative h-10 w-10 animate-spin text-violet-600" />
          </div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-500/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Left Side - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20 relative z-10">
        <div className="space-y-10 max-w-lg">
          {/* Logo & Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
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
              icon={<Shield className="h-5 w-5" />}
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
                    className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-violet-400 to-indigo-500"
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
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">TaskFlow</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 rounded-3xl blur-xl opacity-20" />
            
            <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 sm:p-10 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 mb-5">
                  <LogIn className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back</h2>
                <p className="text-muted-foreground">Sign in to continue to your workspace</p>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 group rounded-xl"
                size="lg"
              >
                <span className="flex items-center gap-3">
                  Sign in with Asgardeo
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">Secure authentication</span>
                </div>
              </div>

              {/* Security badges */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-xs">256-bit SSL</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-xs">SOC 2</span>
                </div>
              </div>

              {/* Terms */}
              <p className="text-center text-xs text-muted-foreground leading-relaxed">
                By signing in, you agree to our{" "}
                <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

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
    <div className="flex items-start gap-4 group">
      <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-0.5">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
