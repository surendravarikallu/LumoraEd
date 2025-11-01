import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, signInWithEmail } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { Footer } from "@/components/Footer";
import { BookOpen, Shield } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { checkSessionAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message.includes("not configured") 
          ? "Firebase authentication is not configured. Please contact the administrator to set up authentication."
          : error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (isAdminLogin) {
        // Handle admin login
        if (email === "admin@lumoraed.com" && password === "Admin@123") {
          const response = await fetch("/api/admin/create-admin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Important for session cookies
            body: JSON.stringify({ email, password }),
          });
          
          if (response.ok) {
            const data = await response.json();
            toast({
              title: "Admin Access Granted",
              description: "You can now access the admin dashboard.",
            });
            // Trigger session check to update auth context
            await checkSessionAuth();
            setLocation("/admin");
          } else {
            const errorData = await response.json();
            toast({
              title: "Admin Login Failed",
              description: errorData.error || "Invalid admin credentials.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Invalid Admin Credentials",
            description: "Please check your email and password.",
            variant: "destructive",
          });
        }
      } else {
        // Handle regular user login - create or authenticate student
        try {
          const response = await fetch("/api/auth/student-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ 
              email, 
              name: email.split("@")[0] // Use email prefix as name
            }),
          });
          
          if (response.ok) {
            const userData = await response.json();
            toast({
              title: "Welcome!",
              description: `Welcome ${userData.name}! You're logged in as a student.`,
            });
            // Trigger session check to update auth context
            await checkSessionAuth();
            setLocation("/dashboard");
          } else {
            const errorData = await response.json();
            toast({
              title: "Login Failed",
              description: errorData.error || "Unable to authenticate. Please try again.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Authentication Error",
            description: "Failed to authenticate. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message.includes("not configured")
          ? "Firebase authentication is not configured. Please contact the administrator to set up authentication."
          : error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-xl ${isAdminLogin ? 'bg-red-500/10' : 'bg-primary/10'}`}>
              {isAdminLogin ? (
                <Shield className="h-8 w-8 text-red-500" />
              ) : (
                <BookOpen className="h-8 w-8 text-primary" />
              )}
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            {isAdminLogin ? "Admin Access" : "Welcome to LumoraEd"}
          </CardTitle>
          <CardDescription className="text-base">
            {isAdminLogin 
              ? "Enter admin credentials to manage challenges and tasks"
              : "Enter your email to access student learning features"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAdminLogin && (
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full"
              data-testid="button-google-signin"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          )}

          {!isAdminLogin && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={isAdminLogin ? "admin@lumoraed.com" : "you@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password {!isAdminLogin && "(Optional)"}</Label>
              <Input
                id="password"
                type="password"
                placeholder={isAdminLogin ? "••••••••" : "Leave empty for student login"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={isAdminLogin}
                data-testid="input-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading} data-testid="button-signin">
              {loading 
                ? (isAdminLogin ? "Accessing..." : "Signing in...") 
                : (isAdminLogin ? "Access Admin Dashboard" : "Access Student Dashboard")
              }
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setIsAdminLogin(!isAdminLogin)}
          >
            {isAdminLogin ? "← Back to User Login" : "Admin Access"}
          </Button>
          {!isAdminLogin && (
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="ghost"
                className="p-0 h-auto font-semibold text-primary hover:text-primary"
                onClick={() => setLocation("/register")}
                data-testid="link-register"
              >
                Sign up
              </Button>
            </p>
          )}
        </CardFooter>
      </Card>
      <Footer />
    </div>
  );
}
