import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StreakCalendar } from "@/components/StreakCalendar";
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, FileText, Video, Link as LinkIcon } from "lucide-react";
import type { Challenge, Task, UserProgress, Submission } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChallengeDetailData {
  challenge: Challenge;
  tasks: Task[];
  progress?: UserProgress;
  submissions: Submission[];
}

export default function ChallengeDetail() {
  const [, params] = useRoute("/challenges/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const challengeId = params?.id;

  const { data, isLoading } = useQuery<ChallengeDetailData>({
    queryKey: ["/api/challenges", challengeId],
    enabled: !!challengeId,
  });

  const completeTaskMutation = useMutation({
    mutationFn: (taskId: string) =>
      apiRequest("POST", `/api/tasks/${taskId}/complete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges", challengeId] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Task completed!",
        description: "Great job! Keep up the momentum.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Challenge not found</p>
        <Button onClick={() => setLocation("/challenges")} className="mt-4">
          Back to Challenges
        </Button>
      </div>
    );
  }

  const { challenge, tasks, progress, submissions } = data;
  const completedTaskIds = new Set(
    submissions.filter((s) => s.status === "completed").map((s) => s.taskId)
  );

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return FileText;
      case "video":
        return Video;
      default:
        return LinkIcon;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          onClick={() => setLocation("/challenges")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Challenges
        </Button>
        <h1 className="text-4xl font-bold tracking-tight">{challenge.title}</h1>
        <p className="text-muted-foreground mt-2">{challenge.description}</p>
      </div>

      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                Day {progress.completedDays} of {challenge.duration}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium">
                      {Math.round((progress.completedDays / challenge.duration) * 100)}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{
                        width: `${(progress.completedDays / challenge.duration) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-2xl font-bold">{progress.streakCount}</p>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{progress.completedDays}</p>
                    <p className="text-sm text-muted-foreground">Days Completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Calendar</CardTitle>
              <CardDescription>Your completed days</CardDescription>
            </CardHeader>
            <CardContent>
              <StreakCalendar
                activeDays={Array.from({ length: progress.completedDays }, (_, i) => i + 1)}
                totalDays={challenge.duration}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daily Tasks</CardTitle>
          <CardDescription>Complete tasks day by day to finish the challenge</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks && tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => {
                const isCompleted = completedTaskIds.has(task.id);
                const canAccess = !progress || task.dayNumber <= progress.completedDays + 1;

                return (
                  <div
                    key={task.id}
                    className={`border rounded-lg p-6 space-y-4 ${
                      canAccess ? "hover-elevate cursor-pointer" : "opacity-50"
                    }`}
                    onClick={() => canAccess && setLocation(`/tasks/${task.id}`)}
                    data-testid={`task-${task.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-primary" data-testid={`icon-completed-${task.id}`} />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">Day {task.dayNumber}</Badge>
                            {isCompleted && <Badge variant="default">Completed</Badge>}
                          </div>
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {task.content}
                          </p>
                        </div>
                      </div>
                      {canAccess && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/tasks/${task.id}`);
                          }}
                          variant={isCompleted ? "outline" : "default"}
                          data-testid={`button-view-task-${task.id}`}
                        >
                          {isCompleted ? "Review" : "Start"}
                        </Button>
                      )}
                    </div>

                    {task.resourceLinks && task.resourceLinks.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {task.resourceLinks.map((resource, index) => {
                          const Icon = getResourceIcon(resource.type);
                          return (
                            <a
                              key={index}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                              data-testid={`resource-${task.id}-${index}`}
                            >
                              <Icon className="h-4 w-4" />
                              {resource.title}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No tasks available for this challenge yet</p>
              <p className="text-sm text-muted-foreground">
                Tasks will appear here once they are added by an administrator
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
