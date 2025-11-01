import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Footer } from "@/components/Footer";
import { BookOpen, Trophy, Users, Target, Star, ArrowRight, CheckCircle, Zap, Brain, Gamepad2, Sparkles, AlertTriangle } from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  // Check if Firebase is properly configured
  const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
    import.meta.env.VITE_FIREBASE_API_KEY !== "demo-api-key" &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID !== "demo-project" &&
    import.meta.env.VITE_FIREBASE_APP_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID !== "demo-app-id";

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Daily Streaks",
      description: "Build unstoppable learning habits with gamified daily challenges"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Smart Learning",
      description: "AI-powered personalized paths that adapt to your learning style"
    },
    {
      icon: <Gamepad2 className="h-6 w-6" />,
      title: "Gamified Experience",
      description: "Level up, earn XP, and compete with friends in epic learning battles"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Instant Rewards",
      description: "Get badges, certificates, and unlock achievements as you progress"
    }
  ];

  const stats = [
    { label: "Active Learners", value: "50K+" },
    { label: "Challenges Completed", value: "1M+" },
    { label: "Certificates Earned", value: "250K+" },
    { label: "Success Rate", value: "98%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-300 rounded-full opacity-80 animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-70 animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/20 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">LumoraEd</span>
          </div>
              <div className="flex items-center space-x-4 animate-fade-in-delay">
                <Button variant="ghost" onClick={() => setLocation("/login")} className="text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  Sign In
                </Button>
                <Button onClick={() => setLocation("/register")} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
                  Get Started
                </Button>
              </div>
        </div>
      </nav>

      {/* Configuration Notice */}
      {!isFirebaseConfigured && (
        <div className="relative z-40 container mx-auto px-4 py-4">
          <Alert className="bg-yellow-500/10 border-yellow-500/30 text-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Development Mode:</strong> Firebase authentication is not configured. 
              To enable user authentication, please configure your Firebase credentials in the environment variables.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          <Badge variant="secondary" className="px-6 py-3 text-sm font-semibold bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-500/50 text-purple-200 animate-bounce">
            🚀 The Future of Learning is Here
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight animate-slide-up">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Learn Like
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Never Before
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-slide-up-delay">
            Join the <span className="text-purple-300 font-semibold">Gen Z learning revolution</span>. 
            Master skills through epic challenges, earn sick rewards, and level up your future. 
            <span className="text-pink-300 font-semibold"> No boring lectures, just pure learning magic.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-slide-up-delay-2">
            <Button size="lg" onClick={() => setLocation("/register")} className="text-xl px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40">
              Start Your Journey
              <ArrowRight className="ml-3 h-6 w-6 animate-pulse" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation("/login")} className="text-xl px-12 py-6 border-white/40 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">{stat.value}</div>
              <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Why LumoraEd is Fire 🔥</h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            We've reimagined learning for the digital generation. No more boring textbooks, just pure learning vibes.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center space-y-4 bg-black/30 border-white/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardHeader>
                <div className="mx-auto p-4 rounded-2xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 w-fit hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-200">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-12 border border-white/20 animate-fade-in">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">How It Works</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Three simple steps to unlock your learning superpowers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-2xl font-black hover:scale-110 transition-transform duration-300 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-white">Sign Up</h3>
              <p className="text-gray-200 text-lg">
                Create your account and choose your learning goals. Takes 30 seconds, we promise.
              </p>
            </div>
            <div className="text-center space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-2xl font-black hover:scale-110 transition-transform duration-300 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold text-white">Start Challenges</h3>
              <p className="text-gray-200 text-lg">
                Jump into epic challenges and complete daily tasks. Level up your skills like a pro.
              </p>
            </div>
            <div className="text-center space-y-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white flex items-center justify-center text-2xl font-black hover:scale-110 transition-transform duration-300 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold text-white">Earn Rewards</h3>
              <p className="text-gray-200 text-lg">
                Collect badges, earn certificates, and unlock achievements. Flex your skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <Card className="max-w-5xl mx-auto text-center bg-gradient-to-r from-purple-900/60 to-pink-900/60 border-white/20 backdrop-blur-sm animate-fade-in">
          <CardHeader className="space-y-6">
            <CardTitle className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Level Up?
            </CardTitle>
            <CardDescription className="text-xl text-gray-200">
              Join thousands of learners who are already building their future. Your learning journey starts now.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" onClick={() => setLocation("/register")} className="text-xl px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-2xl shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40">
                Start Your Journey
                <ArrowRight className="ml-3 h-6 w-6 animate-pulse" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLocation("/login")} className="text-xl px-12 py-6 border-white/40 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                Sign In
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
              <CheckCircle className="h-5 w-5 text-green-400 animate-pulse" />
              <span>Free to start • No credit card required • Cancel anytime</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">LumoraEd</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-300">
              <div>© 2025 LumoraEd. All rights reserved.</div>
              <div>Developed by varikallu surendra</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}