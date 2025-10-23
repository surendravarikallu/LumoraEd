import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/MetricCard";
import { ProgressRing } from "@/components/ProgressRing";
import { BookOpen, Target, Flame, Award, Users, Settings, BarChart3, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import type { Challenge, UserProgress } from "@shared/schema";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DashboardData {
  id: string;
  email: string;
  name: string;
  role: string;
  activeChallenges: number;
  completionRate: number;
  currentStreak: number;
  totalPoints: number;
  totalXP: number;
  level: number;
  badges: Array<{ id: string; name: string; icon: string; color: string; earnedAt: string }>;
  enrolledChallenges: Array<Challenge & { progress: UserProgress }>;
  progressHistory: Array<{ date: string; completion: number }>;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: userData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Use userData directly - no need for mockData since we have loading state
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  const mockData = {
    activeChallenges: userData.activeChallenges || 0,
    completionRate: userData.completionRate || 0,
    currentStreak: userData.currentStreak || 0,
    totalPoints: userData.totalPoints || 0,
    totalXP: userData.totalXP || 0,
    level: userData.level || 1,
    badges: userData.badges || [],
    enrolledChallenges: userData.enrolledChallenges || [],
    progressHistory: userData.progressHistory || [],
  };

  // Admin Dashboard
  if (userData?.role === "admin") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage challenges, tasks, and monitor student progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Challenges"
            value={8}
            icon={BookOpen}
            description="Created challenges"
          />
          <MetricCard
            title="Total Tasks"
            value={70}
            icon={Target}
            description="Learning tasks"
          />
          <MetricCard
            title="Active Students"
            value={0}
            icon={Users}
            description="Currently enrolled"
          />
          <MetricCard
            title="Certifications"
            value={19}
            icon={Award}
            description="Available certifications"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setLocation("/admin")} 
                className="w-full justify-start"
                data-testid="button-manage-challenges"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Challenges & Tasks
              </Button>
              <Button 
                onClick={() => setLocation("/certifications")} 
                variant="outline" 
                className="w-full justify-start"
                data-testid="button-manage-certifications"
              >
                <Award className="h-4 w-4 mr-2" />
                Manage Certifications
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Platform statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Platform Status</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Authentication</span>
                  <span className="text-sm font-medium text-green-600">Session-based</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No recent activity</p>
              <p className="text-sm text-muted-foreground mt-1">
                Activity will appear here as students enroll and complete challenges
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Student Dashboard
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and continue your learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Level"
          value={mockData.level}
          icon={Award}
          description={`${mockData.totalXP} XP`}
        />
        <MetricCard
          title="Active Challenges"
          value={mockData.activeChallenges}
          icon={BookOpen}
          description="Currently enrolled"
        />
        <MetricCard
          title="Current Streak"
          value={mockData.currentStreak}
          icon={Flame}
          description="Days in a row"
        />
        <MetricCard
          title="Badges Earned"
          value={mockData.badges.length}
          icon={Award}
          description="Achievements unlocked"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progress Over Time</CardTitle>
            <CardDescription>Your learning activity in the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {mockData.progressHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData.progressHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completion"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No progress data yet</p>
                  <p className="text-sm mt-1">Start a challenge to see your progress</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Badges</CardTitle>
            <CardDescription>Your latest achievements</CardDescription>
          </CardHeader>
          <CardContent>
            {mockData.badges.length > 0 ? (
              <div className="space-y-3">
                {mockData.badges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Earned {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {mockData.badges.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{mockData.badges.length - 3} more badges
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No badges yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete challenges to earn your first badge!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Challenges</CardTitle>
          <CardDescription>Continue where you left off</CardDescription>
        </CardHeader>
        <CardContent>
          {mockData.enrolledChallenges.length > 0 ? (
            <div className="space-y-4">
              {mockData.enrolledChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setLocation(`/challenges/${challenge.id}`)}
                  data-testid={`challenge-${challenge.id}`}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Day {challenge.progress.completedDays} of {challenge.duration}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {Math.round((challenge.progress.completedDays / challenge.duration) * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>
                    <Button data-testid={`button-continue-${challenge.id}`}>Continue</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">
                You haven't enrolled in any challenges yet
              </p>
              <Button onClick={() => setLocation("/challenges")} data-testid="button-browse-challenges">
                Browse Challenges
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
