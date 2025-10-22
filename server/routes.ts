import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertChallengeSchema, insertTaskSchema, insertCertificationSchema } from "@shared/schema";
import { verifyIdToken } from "./firebase-admin";

// Middleware to verify user is authenticated via Firebase token
async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await verifyIdToken(token);
    
    // Get user from database by Firebase UID
    const user = await storage.getUserByFirebaseUid(decodedToken.uid);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    
    req.userId = user.id;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
}

// Middleware to verify user is admin
async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = await storage.getUser(req.userId!);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth endpoints
  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { email, name, firebaseUid } = req.body;

      // Check if user exists by Firebase UID
      let user = await storage.getUserByFirebaseUid(firebaseUid);

      if (!user) {
        // Check by email
        user = await storage.getUserByEmail(email);

        if (!user) {
          // Create new user
          user = await storage.createUser({
            email,
            name,
            firebaseUid,
            role: "student",
          });
        }
      }

      res.json(user);
    } catch (error: any) {
      console.error("Auth error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Dashboard endpoint
  app.get("/api/dashboard", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const progressData = await storage.getUserProgress(userId);
      const allSubmissions = await storage.getUserSubmissions(userId);

      const activeChallenges = progressData.length;
      const totalCompleted = progressData.reduce((sum, p) => sum + p.completedDays, 0);
      const totalDays = progressData.reduce(async (sumPromise, p) => {
        const sum = await sumPromise;
        const challenge = await storage.getChallenge(p.challengeId);
        return sum + (challenge?.duration || 0);
      }, Promise.resolve(0));

      const totalDaysValue = await totalDays;
      const completionRate = totalDaysValue > 0 ? Math.round((totalCompleted / totalDaysValue) * 100) : 0;
      const currentStreak = progressData.reduce((max, p) => Math.max(max, p.streakCount), 0);
      const totalPoints = allSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);

      // Get enrolled challenges with progress
      const enrolledChallenges = await Promise.all(
        progressData.map(async (progress) => {
          const challenge = await storage.getChallenge(progress.challengeId);
          return challenge ? { ...challenge, progress } : null;
        })
      );

      // Mock progress history (in real app, track this over time)
      const progressHistory = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        completion: Math.min(completionRate, Math.floor(Math.random() * 20 + completionRate - 10)),
      }));

      res.json({
        activeChallenges,
        completionRate,
        currentStreak,
        totalPoints,
        enrolledChallenges: enrolledChallenges.filter(Boolean),
        progressHistory,
      });
    } catch (error: any) {
      console.error("Dashboard error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Challenges endpoints
  app.get("/api/challenges", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const allChallenges = await storage.getAllChallenges();
      const userProgress = await storage.getUserProgress(userId);
      const progressMap = new Map(userProgress.map((p) => [p.challengeId, p]));

      const challengesWithProgress = await Promise.all(
        allChallenges.map(async (challenge) => {
          const participantCount = await storage.getChallengeParticipantCount(challenge.id);
          const progress = progressMap.get(challenge.id);
          return {
            ...challenge,
            enrolled: !!progress,
            participantCount,
            progress,
          };
        })
      );

      res.json(challengesWithProgress);
    } catch (error: any) {
      console.error("Challenges error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/challenges/:id", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const challenge = await storage.getChallenge(id);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }

      const tasks = await storage.getTasksByChallenge(id);
      const progress = await storage.getProgress(userId, id);
      const submissions = await storage.getUserSubmissions(userId);

      res.json({
        challenge,
        tasks,
        progress,
        submissions: submissions.filter((s) => tasks.some((t) => t.id === s.taskId)),
      });
    } catch (error: any) {
      console.error("Challenge detail error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/challenges/:id/enroll", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      // Check if already enrolled
      const existing = await storage.getProgress(userId, id);
      if (existing) {
        return res.json(existing);
      }

      const progress = await storage.createProgress({
        userId,
        challengeId: id,
        completedDays: 0,
        streakCount: 0,
        lastActivityDate: null,
      });

      res.json(progress);
    } catch (error: any) {
      console.error("Enroll error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Tasks endpoints
  app.get("/api/tasks/:id", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      const quiz = await storage.getQuizByTask(id);
      const submission = await storage.getSubmission(userId, id);

      res.json({
        task,
        quiz,
        submission,
      });
    } catch (error: any) {
      console.error("Task detail error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tasks/:id/complete", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Check if already completed
      let submission = await storage.getSubmission(userId, id);
      if (submission && submission.status === "completed") {
        return res.json(submission);
      }

      if (!submission) {
        submission = await storage.createSubmission({
          userId,
          taskId: id,
          status: "completed",
          score: null,
        });
      } else {
        submission = await storage.updateSubmissionStatus(submission.id, "completed");
      }

      // Update progress
      const progress = await storage.getProgress(userId, task.challengeId);
      if (progress && task.dayNumber > progress.completedDays) {
        const now = new Date();
        const lastActivity = progress.lastActivityDate ? new Date(progress.lastActivityDate) : null;
        const isConsecutive =
          lastActivity &&
          now.getTime() - lastActivity.getTime() < 48 * 60 * 60 * 1000 &&
          now.getDate() !== lastActivity.getDate();

        await storage.updateProgress(progress.id, {
          completedDays: task.dayNumber,
          streakCount: isConsecutive ? progress.streakCount + 1 : 1,
          lastActivityDate: now,
        });
      }

      res.json(submission);
    } catch (error: any) {
      console.error("Complete task error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tasks/:id/quiz/submit", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { answers } = req.body;

      const quiz = await storage.getQuizByTask(id);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      let score = 0;
      quiz.questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
          score++;
        }
      });

      let submission = await storage.getSubmission(userId, id);
      if (!submission) {
        submission = await storage.createSubmission({
          userId,
          taskId: id,
          status: "completed",
          score,
        });
      } else {
        submission = await storage.updateSubmissionStatus(submission.id, "completed", score);
      }

      res.json({ score, totalQuestions: quiz.questions.length });
    } catch (error: any) {
      console.error("Quiz submit error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Certifications endpoints
  app.get("/api/certifications", async (req, res) => {
    try {
      const certifications = await storage.getAllCertifications();
      res.json(certifications);
    } catch (error: any) {
      console.error("Certifications error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin endpoints
  app.get("/api/admin/challenges", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      res.json(challenges);
    } catch (error: any) {
      console.error("Admin challenges error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/challenges", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const validated = insertChallengeSchema.parse({ ...req.body, createdBy: userId });
      const challenge = await storage.createChallenge(validated);
      res.json(challenge);
    } catch (error: any) {
      console.error("Create challenge error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/admin/challenges/:id/tasks", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertTaskSchema.parse({ ...req.body, challengeId: id });
      const task = await storage.createTask(validated);
      res.json(task);
    } catch (error: any) {
      console.error("Create task error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/admin/certifications", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const certifications = await storage.getAllCertifications();
      res.json(certifications);
    } catch (error: any) {
      console.error("Admin certifications error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/certifications", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const validated = insertCertificationSchema.parse(req.body);
      const certification = await storage.createCertification(validated);
      res.json(certification);
    } catch (error: any) {
      console.error("Create certification error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/certifications/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCertification(id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Delete certification error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
