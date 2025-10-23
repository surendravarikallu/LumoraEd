import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Target, BookOpen, ExternalLink, CheckCircle } from "lucide-react";
import type { Roadmap, RoadmapStep } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface RoadmapWithSteps {
  roadmap: Roadmap;
  steps: RoadmapStep[];
}

export default function RoadmapDetail() {
  const [, params] = useRoute("/roadmaps/:id");
  const roadmapId = params?.id;

  const { data: roadmapData, isLoading } = useQuery<RoadmapWithSteps>({
    queryKey: [`/api/roadmaps/${roadmapId}`],
    enabled: !!roadmapId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Roadmap not found</p>
        </div>
      </div>
    );
  }

  const { roadmap, steps } = roadmapData;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'web development':
        return '🌐';
      case 'data science':
        return '📊';
      case 'mobile development':
        return '📱';
      case 'devops':
        return '⚙️';
      case 'cybersecurity':
        return '🔒';
      default:
        return '📚';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{getCategoryIcon(roadmap.category)}</span>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{roadmap.title}</h1>
              <p className="text-muted-foreground mt-2">{roadmap.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={getDifficultyColor(roadmap.difficulty)}>
              {roadmap.difficulty}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{roadmap.estimatedDuration} weeks</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>{roadmap.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Path
              </CardTitle>
              <CardDescription>
                Follow these steps in order to master {roadmap.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    data-testid={`roadmap-step-${step.stepNumber}`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{step.title}</h3>
                        {step.isOptional && (
                          <Badge variant="outline" className="text-xs">
                            Optional
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                      {step.resourceLinks && step.resourceLinks.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Resources:</p>
                          <div className="flex flex-wrap gap-2">
                            {step.resourceLinks.map((link, linkIndex) => (
                              <Button
                                key={linkIndex}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => window.open(link.url, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {link.title}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Steps</span>
                  <span className="font-medium">{steps.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Optional Steps</span>
                  <span className="font-medium">
                    {steps.filter(step => step.isOptional).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Duration</span>
                  <span className="font-medium">{roadmap.estimatedDuration} weeks</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed Steps</span>
                  <span>0 / {steps.length}</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">
                Start your learning journey by following the steps above
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
