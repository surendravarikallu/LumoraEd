import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Challenges from "@/pages/Challenges";
import ChallengeDetail from "@/pages/ChallengeDetail";
import TaskDetail from "@/pages/TaskDetail";
import Certifications from "@/pages/Certifications";
import Roadmaps from "@/pages/Roadmaps";
import RoadmapDetail from "@/pages/RoadmapDetail";
import Admin from "@/pages/Admin";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function AuthenticatedLayout() {
  const { user } = useAuth();
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Switch>
              <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
              <Route path="/challenges" component={() => <ProtectedRoute component={Challenges} />} />
              <Route path="/challenges/:id" component={() => <ProtectedRoute component={ChallengeDetail} />} />
              <Route path="/tasks/:id" component={() => <ProtectedRoute component={TaskDetail} />} />
              <Route path="/roadmaps" component={() => <ProtectedRoute component={Roadmaps} />} />
              <Route path="/roadmaps/:id" component={() => <ProtectedRoute component={RoadmapDetail} />} />
              <Route path="/certifications" component={() => <ProtectedRoute component={Certifications} />} />
              {user?.role === "admin" && (
                <Route path="/admin" component={() => <ProtectedRoute component={Admin} />} />
              )}
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

      return (
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/login">{user ? <Redirect to="/dashboard" /> : <Login />}</Route>
          <Route path="/register">{user ? <Redirect to="/dashboard" /> : <Register />}</Route>
          <Route>{user ? <AuthenticatedLayout /> : <Redirect to="/login" />}</Route>
        </Switch>
      );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
