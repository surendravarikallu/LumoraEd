import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, BookOpen, Award, Lightbulb, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RequestFormProps {
  onClose?: () => void;
}

export function RequestForm({ onClose }: RequestFormProps) {
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    category: "",
    priority: "medium",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitRequestMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your request has been submitted successfully. We'll review it soon!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      setFormData({
        type: "",
        title: "",
        description: "",
        category: "",
        priority: "medium",
      });
      onClose?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    submitRequestMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "roadmap": return <BookOpen className="h-4 w-4" />;
      case "challenge": return <Award className="h-4 w-4" />;
      case "certification": return <Award className="h-4 w-4" />;
      case "suggestion": return <Lightbulb className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Request New Content
        </CardTitle>
        <CardDescription>
          Suggest new roadmaps, challenges, certifications, or share your ideas with us
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Request Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roadmap">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Learning Roadmap
                  </div>
                </SelectItem>
                <SelectItem value="challenge">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Challenge
                  </div>
                </SelectItem>
                <SelectItem value="certification">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certification
                  </div>
                </SelectItem>
                <SelectItem value="suggestion">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    General Suggestion
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title for your request"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what you'd like to see. Be as specific as possible to help us understand your needs."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Web Development, Data Science, AI/ML"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={submitRequestMutation.isPending}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {submitRequestMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
