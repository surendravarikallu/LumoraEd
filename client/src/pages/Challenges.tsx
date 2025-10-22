import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock } from "lucide-react";
import { useLocation } from "wouter";
import type { Challenge, UserProgress } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChallengeWithProgress extends Challenge {
  enrolled?: boolean;
  participantCount: number;
  progress?: UserProgress;
}

export default function Challenges() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: challenges, isLoading } = useQuery<ChallengeWithProgress[]>({
    queryKey: ["/api/challenges"],
  });

  const enrollMutation = useMutation({
    mutationFn: (challengeId: string) =>
      apiRequest("POST", `/api/challenges/${challengeId}/enroll`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Enrolled successfully",
        description: "You can now start this challenge",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to enroll in challenge",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Challenges</h1>
        <p className="text-muted-foreground mt-2">
          Choose a challenge and start your learning journey
        </p>
      </div>

      {challenges && challenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card
              key={challenge.id}
              className="flex flex-col hover-elevate cursor-pointer"
              onClick={() => setLocation(`/challenges/${challenge.id}`)}
              data-testid={`challenge-card-${challenge.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-xl">{challenge.title}</CardTitle>
                  {challenge.enrolled && (
                    <Badge variant="default" data-testid={`badge-enrolled-${challenge.id}`}>
                      Enrolled
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {challenge.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{challenge.duration} days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{challenge.participantCount} participants</span>
                  </div>
                  {challenge.progress && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {Math.round((challenge.progress.completedDays / challenge.duration) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{
                            width: `${(challenge.progress.completedDays / challenge.duration) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {challenge.enrolled ? (
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/challenges/${challenge.id}`);
                    }}
                    data-testid={`button-continue-${challenge.id}`}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      enrollMutation.mutate(challenge.id);
                    }}
                    disabled={enrollMutation.isPending}
                    data-testid={`button-enroll-${challenge.id}`}
                  >
                    {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No challenges available yet</p>
            <p className="text-sm text-muted-foreground">
              Check back soon for new learning challenges
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
