import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle2, XCircle, ExternalLink, FileText, Video, Link as LinkIcon } from "lucide-react";
import type { Task, Quiz, Submission } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TaskDetailData {
  task: Task;
  quiz?: Quiz;
  submission?: Submission;
}

export default function TaskDetail() {
  const [, params] = useRoute("/tasks/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const taskId = params?.id;

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const { data, isLoading } = useQuery<TaskDetailData>({
    queryKey: ["/api/tasks", taskId],
    enabled: !!taskId,
  });

  const completeTaskMutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", `/api/tasks/${taskId}/complete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", taskId] });
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Task completed!",
        description: "Well done! Move on to the next task.",
      });
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: (answers: number[]) =>
      apiRequest("POST", `/api/tasks/${taskId}/quiz/submit`, { answers }),
    onSuccess: (result: { score: number; totalQuestions: number }) => {
      setScore(result.score);
      setQuizCompleted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", taskId] });
      toast({
        title: "Quiz submitted!",
        description: `You scored ${result.score} out of ${result.totalQuestions}`,
      });
    },
  });

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (data?.quiz && currentQuestion < data.quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuizMutation.mutate(selectedAnswers);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Task not found</p>
        <Button onClick={() => setLocation("/challenges")} className="mt-4">
          Back to Challenges
        </Button>
      </div>
    );
  }

  const { task, quiz, submission } = data;
  const isCompleted = submission?.status === "completed";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Button
          variant="ghost"
          onClick={() => setLocation(-1)}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Day {task.dayNumber}</Badge>
              {isCompleted && <Badge variant="default">Completed</Badge>}
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{task.title}</h1>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed whitespace-pre-wrap">{task.content}</p>
          </div>

          {task.resourceLinks && task.resourceLinks.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold mb-3">Resources</h3>
              <div className="space-y-2">
                {task.resourceLinks.map((resource, index) => {
                  const Icon = getResourceIcon(resource.type);
                  return (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover-elevate"
                      data-testid={`resource-${index}`}
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-sm text-muted-foreground">{resource.type}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {quiz && !isCompleted && (
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Check</CardTitle>
            <CardDescription>
              Complete the quiz to test your understanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!quizStarted && !quizCompleted ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Ready to test your knowledge? This quiz has {quiz.questions.length} questions.
                </p>
                <Button onClick={() => setQuizStarted(true)} data-testid="button-start-quiz">
                  Start Quiz
                </Button>
              </div>
            ) : quizCompleted ? (
              <div className="text-center py-8 space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Quiz Completed!</h3>
                <p className="text-muted-foreground">
                  You scored {score} out of {quiz.questions.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  {score === quiz.questions.length
                    ? "Perfect score! Excellent work!"
                    : score >= quiz.questions.length * 0.7
                    ? "Great job! You've passed the quiz."
                    : "Keep practicing to improve your score."}
                </p>
                {!isCompleted && (
                  <Button
                    onClick={() => completeTaskMutation.mutate()}
                    disabled={completeTaskMutation.isPending}
                    data-testid="button-complete-task"
                  >
                    {completeTaskMutation.isPending ? "Completing..." : "Mark as Complete"}
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Question {currentQuestion + 1} of {quiz.questions.length}
                    </span>
                    <span className="font-medium">
                      {Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={((currentQuestion + 1) / quiz.questions.length) * 100}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    {quiz.questions[currentQuestion].question}
                  </h3>
                  <div className="space-y-3">
                    {quiz.questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full text-left p-4 border-2 rounded-lg transition-all hover-elevate ${
                          selectedAnswers[currentQuestion] === index
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                        data-testid={`option-${index}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswers[currentQuestion] === index
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                            }`}
                          >
                            {selectedAnswers[currentQuestion] === index && (
                              <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                            )}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestion] === undefined || submitQuizMutation.isPending}
                    data-testid="button-next-question"
                  >
                    {currentQuestion === quiz.questions.length - 1
                      ? submitQuizMutation.isPending
                        ? "Submitting..."
                        : "Submit Quiz"
                      : "Next Question"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!quiz && !isCompleted && (
        <div className="flex justify-center">
          <Button
            onClick={() => completeTaskMutation.mutate()}
            disabled={completeTaskMutation.isPending}
            size="lg"
            data-testid="button-complete-task-no-quiz"
          >
            {completeTaskMutation.isPending ? "Completing..." : "Mark as Complete"}
          </Button>
        </div>
      )}
    </div>
  );
}
