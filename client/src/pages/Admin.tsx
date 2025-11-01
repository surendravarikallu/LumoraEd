import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, BookOpen, Trophy, Map, MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react";
import type { Challenge, Certification, Task, Roadmap } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Admin() {
  const { toast } = useToast();
  const [newChallenge, setNewChallenge] = useState({ title: "", description: "", duration: "" });
  const [newCert, setNewCert] = useState({ title: "", provider: "", link: "" });
  const [newRoadmap, setNewRoadmap] = useState({ title: "", description: "", category: "" });
  const [selectedChallenge, setSelectedChallenge] = useState<string>("");
  const [newTask, setNewTask] = useState({
    dayNumber: "",
    title: "",
    content: "",
    resourceLinks: "",
  });

  const { data: challenges } = useQuery<Challenge[]>({
    queryKey: ["/api/admin/challenges"],
  });

  const { data: certifications } = useQuery<Certification[]>({
    queryKey: ["/api/admin/certifications"],
  });

  const { data: roadmaps } = useQuery<Roadmap[]>({
    queryKey: ["/api/admin/roadmaps"],
  });

  const { data: studentRequests, isLoading: requestsLoading } = useQuery<Array<{
    id: string;
    userId: string;
    type: string;
    title: string;
    description: string;
    category?: string | null;
    priority: string;
    status: string;
    adminNotes?: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
    } | null;
  }>>({
    queryKey: ["/api/admin/requests"],
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, status, adminNotes }: { id: string; status: string; adminNotes?: string }) =>
      apiRequest("PUT", `/api/admin/requests/${id}`, { status, adminNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/requests"] });
      toast({ title: "Request updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update request", variant: "destructive" });
    },
  });

  const createChallengeMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/admin/challenges", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/challenges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      setNewChallenge({ title: "", description: "", duration: "" });
      toast({ title: "Challenge created successfully" });
    },
  });

  const createCertMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/admin/certifications", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/certifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
      setNewCert({ title: "", provider: "", link: "" });
      toast({ title: "Certification added successfully" });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", `/api/admin/challenges/${selectedChallenge}/tasks`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/challenges"] });
      setNewTask({ dayNumber: "", title: "", content: "", resourceLinks: "" });
      toast({ title: "Task created successfully" });
    },
  });

  const deleteCertMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/admin/certifications/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/certifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
      toast({ title: "Certification deleted" });
    },
  });

  const createRoadmapMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/admin/roadmaps", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/roadmaps"] });
      setNewRoadmap({ title: "", description: "", category: "" });
      toast({ title: "Roadmap created successfully" });
    },
  });

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    createChallengeMutation.mutate({
      ...newChallenge,
      duration: parseInt(newChallenge.duration),
    });
  };

  const handleCreateCert = (e: React.FormEvent) => {
    e.preventDefault();
    createCertMutation.mutate(newCert);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const resourceLinks = newTask.resourceLinks
      ? newTask.resourceLinks.split("\n").filter(Boolean).map((line) => {
          const [type, title, url] = line.split("|").map((s) => s.trim());
          return { type, title, url };
        })
      : [];

    createTaskMutation.mutate({
      challengeId: selectedChallenge,
      dayNumber: parseInt(newTask.dayNumber),
      title: newTask.title,
      content: newTask.content,
      resourceLinks: resourceLinks.length > 0 ? resourceLinks : null,
    });
  };

  const handleCreateRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    createRoadmapMutation.mutate(newRoadmap);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground mt-2">
          Manage challenges, tasks, and certifications
        </p>
      </div>

      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="roadmaps">Roadmaps</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {studentRequests && studentRequests.filter(r => r.status === "pending").length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {studentRequests.filter(r => r.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Challenge</CardTitle>
              <CardDescription>Add a new learning challenge for students</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateChallenge} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Challenge Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., 50 Days of Python"
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                    required
                    data-testid="input-challenge-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the challenge..."
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                    required
                    data-testid="input-challenge-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    value={newChallenge.duration}
                    onChange={(e) => setNewChallenge({ ...newChallenge, duration: e.target.value })}
                    required
                    data-testid="input-challenge-duration"
                  />
                </div>
                <Button type="submit" disabled={createChallengeMutation.isPending} data-testid="button-create-challenge">
                  <Plus className="h-4 w-4 mr-2" />
                  {createChallengeMutation.isPending ? "Creating..." : "Create Challenge"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Tasks to Challenge</CardTitle>
              <CardDescription>Create daily tasks for an existing challenge</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="challenge">Select Challenge</Label>
                  <select
                    id="challenge"
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                    value={selectedChallenge}
                    onChange={(e) => setSelectedChallenge(e.target.value)}
                    required
                    data-testid="select-challenge"
                  >
                    <option value="">Choose a challenge...</option>
                    {challenges?.map((challenge) => (
                      <option key={challenge.id} value={challenge.id}>
                        {challenge.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dayNumber">Day Number</Label>
                  <Input
                    id="dayNumber"
                    type="number"
                    placeholder="1"
                    value={newTask.dayNumber}
                    onChange={(e) => setNewTask({ ...newTask, dayNumber: e.target.value })}
                    required
                    data-testid="input-task-day"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskTitle">Task Title</Label>
                  <Input
                    id="taskTitle"
                    placeholder="e.g., Introduction to Variables"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                    data-testid="input-task-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Task Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Describe what the student should learn or do..."
                    value={newTask.content}
                    onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
                    required
                    rows={4}
                    data-testid="input-task-content"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resources">Resource Links (optional)</Label>
                  <Textarea
                    id="resources"
                    placeholder="Format: type|title|url (one per line)&#10;Example:&#10;video|Python Tutorial|https://example.com&#10;pdf|Python Cheatsheet|https://example.com/pdf"
                    value={newTask.resourceLinks}
                    onChange={(e) => setNewTask({ ...newTask, resourceLinks: e.target.value })}
                    rows={3}
                    data-testid="input-task-resources"
                  />
                </div>
                <Button type="submit" disabled={!selectedChallenge || createTaskMutation.isPending} data-testid="button-create-task">
                  <Plus className="h-4 w-4 mr-2" />
                  {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {challenges && challenges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Existing Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {challenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                      data-testid={`admin-challenge-${challenge.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">{challenge.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {challenge.duration} days
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roadmaps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Roadmap</CardTitle>
              <CardDescription>Add a new learning roadmap for students</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRoadmap} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roadmapTitle">Roadmap Title</Label>
                  <Input
                    id="roadmapTitle"
                    placeholder="e.g., Python Developer Roadmap"
                    value={newRoadmap.title}
                    onChange={(e) => setNewRoadmap({ ...newRoadmap, title: e.target.value })}
                    required
                    data-testid="input-roadmap-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roadmapDescription">Description</Label>
                  <Textarea
                    id="roadmapDescription"
                    placeholder="Describe the roadmap and learning path..."
                    value={newRoadmap.description}
                    onChange={(e) => setNewRoadmap({ ...newRoadmap, description: e.target.value })}
                    required
                    data-testid="input-roadmap-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roadmapCategory">Category</Label>
                  <Input
                    id="roadmapCategory"
                    placeholder="e.g., Programming, Data Science, Web Development"
                    value={newRoadmap.category}
                    onChange={(e) => setNewRoadmap({ ...newRoadmap, category: e.target.value })}
                    required
                    data-testid="input-roadmap-category"
                  />
                </div>
                <Button type="submit" disabled={createRoadmapMutation.isPending} data-testid="button-create-roadmap">
                  <Plus className="h-4 w-4 mr-2" />
                  {createRoadmapMutation.isPending ? "Creating..." : "Create Roadmap"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {roadmaps && roadmaps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Existing Roadmaps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roadmaps.map((roadmap) => (
                    <div
                      key={roadmap.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                      data-testid={`admin-roadmap-${roadmap.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <Map className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">{roadmap.title}</p>
                          <p className="text-sm text-muted-foreground">{roadmap.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Certification</CardTitle>
              <CardDescription>Share free certification opportunities with students</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCert} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certTitle">Certification Title</Label>
                  <Input
                    id="certTitle"
                    placeholder="e.g., AWS Cloud Practitioner"
                    value={newCert.title}
                    onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                    required
                    data-testid="input-cert-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Input
                    id="provider"
                    placeholder="e.g., Amazon Web Services"
                    value={newCert.provider}
                    onChange={(e) => setNewCert({ ...newCert, provider: e.target.value })}
                    required
                    data-testid="input-cert-provider"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    type="url"
                    placeholder="https://..."
                    value={newCert.link}
                    onChange={(e) => setNewCert({ ...newCert, link: e.target.value })}
                    required
                    data-testid="input-cert-link"
                  />
                </div>
                <Button type="submit" disabled={createCertMutation.isPending} data-testid="button-create-cert">
                  <Plus className="h-4 w-4 mr-2" />
                  {createCertMutation.isPending ? "Adding..." : "Add Certification"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {certifications && certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Existing Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                      data-testid={`admin-cert-${cert.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <Trophy className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">{cert.title}</p>
                          <p className="text-sm text-muted-foreground">{cert.provider}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCertMutation.mutate(cert.id)}
                        disabled={deleteCertMutation.isPending}
                        data-testid={`button-delete-cert-${cert.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Requests</CardTitle>
              <CardDescription>
                Manage and review requests from students ({studentRequests?.length ?? 0} total, {" "}
                {studentRequests?.filter(r => r.status === "pending").length ?? 0} pending)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading requests...</p>
                </div>
              ) : !studentRequests || studentRequests.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No requests yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Student requests will appear here for your review
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-6 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{request.type}</Badge>
                            <Badge
                              variant={
                                request.status === "pending"
                                  ? "secondary"
                                  : request.status === "approved"
                                  ? "default"
                                  : request.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {request.status.replace("_", " ")}
                            </Badge>
                            {request.priority === "high" && (
                              <Badge variant="destructive">High Priority</Badge>
                            )}
                          </div>
                          <h4 className="font-semibold text-lg">{request.title}</h4>
                          <p className="text-sm text-muted-foreground mt-2">{request.description}</p>
                          {request.user && (
                            <p className="text-sm text-muted-foreground mt-2">
                              <span className="font-medium">From: </span>
                              {request.user.name} ({request.user.email})
                            </p>
                          )}
                          {request.category && (
                            <p className="text-xs text-muted-foreground mt-1">Category: {request.category}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Submitted: {new Date(request.createdAt).toLocaleDateString()}
                            {request.updatedAt && request.updatedAt !== request.createdAt && (
                              <> • Updated: {new Date(request.updatedAt).toLocaleDateString()}</>
                            )}
                          </p>
                          {request.adminNotes && (
                            <div className="mt-3 p-3 bg-muted rounded text-sm">
                              <span className="font-medium">Admin Notes: </span>
                              {request.adminNotes}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Select
                          value={request.status}
                          onValueChange={(newStatus) => {
                            updateRequestMutation.mutate({
                              id: request.id,
                              status: newStatus,
                            });
                          }}
                          disabled={updateRequestMutation.isPending}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
