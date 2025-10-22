import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/MetricCard";
import { ProgressRing } from "@/components/ProgressRing";
import { BookOpen, Target, Flame, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import type { Challenge, UserProgress } from "@shared/schema";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DashboardData {
  activeChallenges: number;
  completionRate: number;
  currentStreak: number;
  totalPoints: number;
  enrolledChallenges: Array<Challenge & { progress: UserProgress }>;
  progressHistory: Array<{ date: string; completion: number }>;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data, isLoading } = useQuery<DashboardData>({
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

  const mockData = data || {
    activeChallenges: 0,
    completionRate: 0,
    currentStreak: 0,
    totalPoints: 0,
    enrolledChallenges: [],
    progressHistory: [],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and continue your learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Challenges"
          value={mockData.activeChallenges}
          icon={BookOpen}
          description="Currently enrolled"
        />
        <MetricCard
          title="Completion Rate"
          value={`${mockData.completionRate}%`}
          icon={Target}
          description="Average across challenges"
        />
        <MetricCard
          title="Current Streak"
          value={mockData.currentStreak}
          icon={Flame}
          description="Days in a row"
        />
        <MetricCard
          title="Total Points"
          value={mockData.totalPoints}
          icon={Award}
          description="From quiz scores"
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
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>Completion across all challenges</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <ProgressRing percentage={mockData.completionRate} />
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
