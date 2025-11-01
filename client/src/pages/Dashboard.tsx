import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MetricCard } from "@/components/MetricCard";
import { ProgressRing } from "@/components/ProgressRing";
import { RequestForm } from "@/components/RequestForm";
import { ProfileForm } from "@/components/ProfileForm";
import { BookOpen, Target, Flame, Award, Users, Settings, BarChart3, Plus, MessageSquare, User, Mail, Calendar, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import type { Challenge, UserProgress } from "@shared/schema";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DashboardData {
  id: string;
  email: string;
  name: string;
  role: string;
  profileComplete?: boolean;
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
  const [showRequestForm, setShowRequestForm] = useState(false);
  const queryClient = useQueryClient();
  const { data: userData, isLoading, refetch } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  // Admin queries - must be called before conditional returns (React Hooks rule)
  const { data: adminStats, isLoading: statsLoading } = useQuery<{
    totalChallenges: number;
    totalTasks: number;
    activeStudents: number;
    totalCertifications: number;
  }>({
    queryKey: ["/api/admin/stats"],
    enabled: userData?.role === "admin", // Only fetch when user is admin
  });

  const { data: students, isLoading: studentsLoading } = useQuery<Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    profileComplete?: boolean;
    enrolledChallenges: number;
    activeChallenges: number;
    totalXP: number;
    level: number;
    rollNumber?: string | null;
    branch?: string | null;
    year?: string | null;
    collegeName?: string | null;
  }>>({
    queryKey: ["/api/admin/students"],
    enabled: userData?.role === "admin", // Only fetch when user is admin
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

  // Check if profile is complete for students
  if (userData.role === "student" && !userData.profileComplete) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <Dialog 
          open={true} 
          onOpenChange={() => {
            // Prevent manual closing - only allow closing when profile is complete
            // The dialog will automatically close when userData.profileComplete becomes true
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Complete Your Profile</DialogTitle>
            </DialogHeader>
            <ProfileForm 
              onComplete={async () => {
                // Refetch dashboard data to get updated profileComplete status
                await refetch();
                // The dialog will automatically close when userData.profileComplete becomes true
                // due to the conditional rendering above
              }} 
            />
          </DialogContent>
        </Dialog>
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
            value={statsLoading ? "..." : (adminStats?.totalChallenges ?? 0)}
            icon={BookOpen}
            description="Created challenges"
          />
          <MetricCard
            title="Total Tasks"
            value={statsLoading ? "..." : (adminStats?.totalTasks ?? 0)}
            icon={Target}
            description="Learning tasks"
          />
          <MetricCard
            title="Active Students"
            value={statsLoading ? "..." : (adminStats?.activeStudents ?? 0)}
            icon={Users}
            description="Currently enrolled"
          />
          <MetricCard
            title="Certifications"
            value={statsLoading ? "..." : (adminStats?.totalCertifications ?? 0)}
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
            <CardTitle>Student Requests</CardTitle>
            <CardDescription>Recent requests from students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No pending requests</p>
              <p className="text-sm text-muted-foreground mt-1">
                Student requests will appear here for your review
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>
              View and manage student profiles ({students?.length ?? 0} total students)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading students...</p>
              </div>
            ) : !students || students.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No students enrolled yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Student profiles will appear here once they complete registration
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Profile</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>XP</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {student.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {student.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {student.profileComplete ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Complete
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Incomplete
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{student.enrolledChallenges}</TableCell>
                        <TableCell>{student.activeChallenges}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3 text-primary" />
                            {student.level}
                          </div>
                        </TableCell>
                        <TableCell>{student.totalXP} XP</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(student.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Student Dashboard
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track your progress and continue your learning journey
          </p>
        </div>
        <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Request Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request New Content</DialogTitle>
            </DialogHeader>
            <RequestForm onClose={() => setShowRequestForm(false)} />
          </DialogContent>
        </Dialog>
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
