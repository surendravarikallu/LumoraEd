import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Target, BookOpen } from "lucide-react";
import { useLocation } from "wouter";
import type { Roadmap } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Roadmaps() {
  const [, setLocation] = useLocation();

  const { data: roadmaps, isLoading } = useQuery<Roadmap[]>({
    queryKey: ["/api/roadmaps"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading roadmaps...</p>
        </div>
      </div>
    );
  }

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
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Learning Roadmaps</h1>
        <p className="text-muted-foreground mt-2">
          Structured learning paths to master new skills and technologies
        </p>
      </div>

      {roadmaps && roadmaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => (
            <Card
              key={roadmap.id}
              className="flex flex-col hover-elevate cursor-pointer"
              onClick={() => setLocation(`/roadmaps/${roadmap.id}`)}
              data-testid={`roadmap-card-${roadmap.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(roadmap.category)}</span>
                    <CardTitle className="text-xl">{roadmap.title}</CardTitle>
                  </div>
                  <Badge 
                    className={getDifficultyColor(roadmap.difficulty)}
                    data-testid={`badge-difficulty-${roadmap.id}`}
                  >
                    {roadmap.difficulty}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {roadmap.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{roadmap.estimatedDuration} weeks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>{roadmap.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No roadmaps available yet</p>
            <p className="text-sm text-muted-foreground">
              Check back soon for new learning roadmaps
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
