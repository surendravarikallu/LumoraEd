import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, GraduationCap, Calendar, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormProps {
  onComplete?: () => void;
  initialData?: {
    rollNumber?: string;
    branch?: string;
    year?: string;
    collegeName?: string;
  };
}

export function ProfileForm({ onComplete, initialData }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    rollNumber: initialData?.rollNumber || "",
    branch: initialData?.branch || "",
    year: initialData?.year || "",
    collegeName: initialData?.collegeName || "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
      // Call onComplete to let the parent component handle the state
      if (onComplete) {
        onComplete();
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rollNumber || !formData.branch || !formData.year || !formData.collegeName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    updateProfileMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const branchOptions = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Chemical Engineering",
    "Aerospace Engineering",
    "Biotechnology",
    "Data Science",
    "Artificial Intelligence",
    "Cybersecurity",
    "Software Engineering",
    "Other"
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Complete Your Profile
        </CardTitle>
        <CardDescription>
          Help us personalize your learning experience by providing your academic information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rollNumber" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Roll Number *
            </Label>
            <Input
              id="rollNumber"
              placeholder="Enter your roll number"
              value={formData.rollNumber}
              onChange={(e) => handleInputChange("rollNumber", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Branch/Department *
            </Label>
            <Select value={formData.branch} onValueChange={(value) => handleInputChange("branch", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your branch" />
              </SelectTrigger>
              <SelectContent>
                {branchOptions.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Academic Year *
            </Label>
            <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your academic year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collegeName" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              College/University Name *
            </Label>
            <Input
              id="collegeName"
              placeholder="Enter your college or university name"
              value={formData.collegeName}
              onChange={(e) => handleInputChange("collegeName", e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={updateProfileMutation.isPending}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              {updateProfileMutation.isPending ? "Updating..." : "Complete Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
