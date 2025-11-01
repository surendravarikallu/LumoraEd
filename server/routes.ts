import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChallengeSchema, insertTaskSchema, insertCertificationSchema, insertRoadmapSchema, insertRoadmapStepSchema } from "@shared/schema";
import { verifyIdToken } from "./firebase-admin";

// Extend Express Request interface to include session
declare global {
  namespace Express {
    interface Request {
      session?: {
        userId?: string;
        userRole?: string;
        isAdmin?: boolean;
        destroy?: (callback: (err?: any) => void) => void;
      };
    }
  }
}

// Middleware to verify user is authenticated (supports both Firebase and session auth)
async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Check for session-based authentication first (for admin users)
    if (req.session && req.session.userId) {
      console.log("Auth middleware - using session authentication for user:", req.session.userId);
      req.userId = req.session.userId;
      return next();
    }

    // Fall back to Firebase token authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await verifyIdToken(token);
    
    console.log("Auth middleware - decoded token UID:", decodedToken.uid);
    
    // For development, if we're using the mock UID, try to find any user
    let user;
    if (decodedToken.uid === "dev-user-123") {
      // For development, try to find a student user first, then create one if none exists
      const allUsers = await storage.getAllUsers();
      let studentUser = allUsers.find(u => u.role === "student");
      
      if (!studentUser) {
        // Create a student user for development
        console.log("Auth middleware - creating student user for development");
        studentUser = await storage.createUser({
          email: "student@lumoraed.com",
          name: "Development Student",
          firebaseUid: "dev-user-123",
          role: "student",
          profileComplete: false
        });
      }
      
      user = studentUser;
      console.log("Auth middleware - using user for development:", user ? `${user.role} user` : "No user found");
    } else if (decodedToken.uid === "admin-user-123") {
      // Handle admin user specifically
      user = await storage.getUserByFirebaseUid("admin-user-123");
      console.log("Auth middleware - using admin user:", user ? "Yes" : "No");
    } else {
      // Get user from database by Firebase UID
      user = await storage.getUserByFirebaseUid(decodedToken.uid);
    }
    
    console.log("Auth middleware - user found:", user ? "Yes" : "No");
    
    if (!user) {
      console.log("Auth middleware - User not found for UID:", decodedToken.uid);
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
  // Create admin user endpoint (for development)
  app.post("/api/admin/create-admin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (email !== "admin@lumoraed.com" || password !== "Admin@123") {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }

      // Check if admin user already exists
      let adminUser = await storage.getUserByEmail("admin@lumoraed.com");
      
      if (!adminUser) {
        // Create admin user
        adminUser = await storage.createUser({
          email: "admin@lumoraed.com",
          name: "Admin User",
          firebaseUid: "admin-user-123",
          role: "admin"
        });
      } else {
        // Update existing user to admin
        adminUser = await storage.updateUser(adminUser.id, { role: "admin" });
      }

      // Set admin session
      if (req.session) {
        req.session.userId = adminUser.id;
        req.session.userRole = "admin";
        req.session.isAdmin = true;
      }

      res.json({ message: "Admin user created/updated successfully", user: adminUser });
    } catch (error: any) {
      console.error("Create admin error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    if (req.session?.destroy) {
      req.session.destroy((_err?: any) => {
        if (_err) {
          console.error("Session destruction error:", _err);
          return res.status(500).json({ error: "Could not log out" });
        }
        res.json({ message: "Logged out successfully" });
      });
    } else {
      res.json({ message: "Logged out successfully" });
    }
  });

  // Student login endpoint
  app.post("/api/auth/student-login", async (req, res) => {
    try {
      const { email, name } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Check if user exists by email
      let user = await storage.getUserByEmail(email);

      if (!user) {
        // Create new student user
        user = await storage.createUser({
          email: email,
          name: name || email.split("@")[0],
          firebaseUid: `student-${Date.now()}`, // Generate unique ID for students
          role: "student",
        });
      }

      // Set up session for the student
      if (req.session) {
        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.isAdmin = false;
      }

      res.json(user);
    } catch (error: any) {
      console.error("Student login error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Auth endpoints (for Firebase integration)
  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { email, name, firebaseUid } = req.body;

      // For development, if no Firebase UID is provided, use the mock one
      const actualFirebaseUid = firebaseUid || "dev-user-123";

      // Check if user exists by Firebase UID
      let user = await storage.getUserByFirebaseUid(actualFirebaseUid);

      if (!user) {
        // Check by email
        user = await storage.getUserByEmail(email);

        if (!user) {
          // Create new user - only admin@lumoraed.com should be admin, all others are students
          const isAdminEmail = email === "admin@lumoraed.com";
          const userRole = isAdminEmail ? "admin" : "student";
          
          console.log(`Creating new user: ${email} with role: ${userRole}`);
          
          user = await storage.createUser({
            email: email || "dev@example.com",
            name: name || "Development User",
            firebaseUid: actualFirebaseUid,
            role: userRole,
            profileComplete: userRole === "admin", // Only admins have complete profiles by default
          });
        } else {
          // Update existing user with Firebase UID if they don't have one
          if (!user.firebaseUid) {
            user = await storage.updateUser(user.id, { firebaseUid: actualFirebaseUid });
          }
        }
      }

      // Set up session for the user (both admin and student)
      if (req.session) {
        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.isAdmin = user.role === "admin";
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
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      console.log(`Dashboard API - User: ${user.email}, Role: ${user.role}`);
      
      // Get XP data
      const xpData = await storage.getUserXP(userId);
      const totalXP = xpData?.totalXP || 0;
      const level = xpData?.level || 1;
      
      // Get user badges
      const userBadges = await storage.getUserBadges(userId);
      
      // Get user progress and enrolled challenges
      const userProgressList = await storage.getUserProgress(userId);
      const allChallenges = await storage.getAllChallenges();
      
      const enrolledChallenges = allChallenges
        .filter(challenge => userProgressList.some(p => p.challengeId === challenge.id))
        .map(challenge => {
          const progress = userProgressList.find(p => p.challengeId === challenge.id);
          return {
            ...challenge,
            progress,
          };
        });

      // Calculate active challenges (challenges with progress < 100%)
      const activeChallenges = enrolledChallenges.filter(
        c => c.progress && c.progress.completedDays < c.duration
      ).length;

      // Calculate current streak (max streak from user progress)
      const maxStreak = userProgressList.reduce((max, p) => Math.max(max, p.streakCount), 0);

      // Get XP transactions for progress history (last 30 days)
      const transactions = await storage.getUserXPTransactions(userId);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Group transactions by date for progress history
      const progressByDate = new Map<string, number>();
      transactions
        .filter(t => new Date(t.createdAt) >= thirtyDaysAgo)
        .forEach(t => {
          const date = new Date(t.createdAt).toISOString().split('T')[0];
          const current = progressByDate.get(date) || 0;
          progressByDate.set(date, current + t.amount);
        });

      const progressHistory = Array.from(progressByDate.entries())
        .map(([date, xp]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          completion: xp,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7); // Last 7 days

      // Calculate completion rate
      let completionRate = 0;
      if (enrolledChallenges.length > 0) {
        const totalProgress = enrolledChallenges.reduce(
          (sum, c) => sum + (c.progress?.completedDays || 0),
          0
        );
        const totalDays = enrolledChallenges.reduce((sum, c) => sum + c.duration, 0);
        completionRate = totalDays > 0 ? Math.round((totalProgress / totalDays) * 100) : 0;
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        firebaseUid: user.firebaseUid,
        createdAt: user.createdAt,
        profileComplete: user.profileComplete,
        totalXP,
        level,
        activeChallenges,
        currentStreak: maxStreak,
        completionRate,
        badges: userBadges.map(badge => ({
          id: badge.id,
          name: badge.name,
          icon: badge.icon,
          color: badge.color,
          earnedAt: badge.earnedAt,
        })),
        enrolledChallenges,
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
      const { learningTime, resourcesViewed, quizScore } = req.body;

      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Check if already completed
      let submission = await storage.getSubmission(userId, id);
      if (submission && submission.status === "completed") {
        return res.json(submission);
      }

      // Validate requirements
      const quiz = await storage.getQuizByTask(id);
      const resourceCount = task.resourceLinks?.length || 0;
      const minResourcesViewed = Math.ceil(resourceCount * 0.5);
      const minLearningTime = 30; // 30 seconds minimum

      // Check if requirements are met
      const hasViewedEnoughResources = !resourceCount || (resourcesViewed && resourcesViewed.length >= minResourcesViewed);
      const hasSpentEnoughTime = !learningTime || learningTime >= minLearningTime;
      const hasCompletedQuiz = !quiz || (quizScore !== null && quizScore !== undefined);

      if (!hasViewedEnoughResources || !hasSpentEnoughTime || !hasCompletedQuiz) {
        return res.status(400).json({ 
          error: "Task requirements not met",
          details: {
            needMoreResources: !hasViewedEnoughResources,
            needMoreTime: !hasSpentEnoughTime,
            needQuizCompletion: !hasCompletedQuiz,
          }
        });
      }

      // Create or update submission
      if (!submission) {
        submission = await storage.createSubmission({
          userId,
          taskId: id,
          status: "completed",
          score: quizScore || null,
        });
      } else {
        submission = await storage.updateSubmissionStatus(submission.id, "completed", quizScore || undefined);
      }

      // Calculate XP to award
      let xpAmount = 50; // Base XP for completing a task
      let xpDescription = `Completed task: ${task.title}`;

      // Bonus XP for perfect quiz score
      if (quiz && quizScore === quiz.questions.length) {
        xpAmount += 25;
        xpDescription += " (Perfect quiz score!)";
      }

      // Award XP
      await storage.addXP(userId, xpAmount, "task_completion", id, xpDescription);

      // Update progress
      const progress = await storage.getProgress(userId, task.challengeId);
      if (progress) {
        let newStreakCount = 1;
        const now = new Date();
        const lastActivity = progress.lastActivityDate ? new Date(progress.lastActivityDate) : null;
        
        // Check if this continues a streak
        if (lastActivity) {
          const hoursSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
          const isConsecutive = hoursSinceLastActivity < 48 && now.getDate() !== lastActivity.getDate();
          if (isConsecutive) {
            newStreakCount = progress.streakCount + 1;
            // Award bonus XP for streaks
            if (newStreakCount % 7 === 0) {
              await storage.addXP(userId, 100, "streak", task.challengeId, `${newStreakCount} day streak!`);
            } else if (newStreakCount > 1) {
              await storage.addXP(userId, 10, "streak", task.challengeId, `${newStreakCount} day streak`);
            }
          }
        }

        // Only update if this task advances progress
        if (task.dayNumber > progress.completedDays) {
          await storage.updateProgress(progress.id, {
            completedDays: task.dayNumber,
            streakCount: newStreakCount,
            lastActivityDate: now,
          });
        }

        // Check if challenge is completed
        const challenge = await storage.getChallenge(task.challengeId);
        if (challenge && task.dayNumber === challenge.duration) {
          await storage.addXP(userId, 200, "challenge_completion", challenge.id, `Completed challenge: ${challenge.title}`);
        }
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

  // Roadmaps endpoints
  app.get("/api/roadmaps", async (req, res) => {
    try {
      const roadmaps = await storage.getAllRoadmaps();
      res.json(roadmaps);
    } catch (error: any) {
      console.error("Roadmaps error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/roadmaps/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const roadmap = await storage.getRoadmap(id);
      if (!roadmap) {
        return res.status(404).json({ error: "Roadmap not found" });
      }
      const steps = await storage.getStepsByRoadmap(id);
      res.json({ roadmap, steps });
    } catch (error: any) {
      console.error("Roadmap detail error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin roadmap endpoints
  app.get("/api/admin/roadmaps", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const roadmaps = await storage.getAllRoadmaps();
      res.json(roadmaps);
    } catch (error: any) {
      console.error("Admin roadmaps error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/roadmaps", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const validated = insertRoadmapSchema.parse({ ...req.body, createdBy: userId });
      const roadmap = await storage.createRoadmap(validated);
      res.json(roadmap);
    } catch (error: any) {
      console.error("Create roadmap error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/admin/roadmaps/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const roadmap = await storage.updateRoadmap(id, req.body);
      res.json(roadmap);
    } catch (error: any) {
      console.error("Update roadmap error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/roadmaps/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRoadmap(id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Delete roadmap error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Roadmap steps endpoints
  app.post("/api/admin/roadmaps/:id/steps", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertRoadmapStepSchema.parse({ ...req.body, roadmapId: id });
      const step = await storage.createRoadmapStep(validated);
      res.json(step);
    } catch (error: any) {
      console.error("Create roadmap step error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/admin/roadmap-steps/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const step = await storage.updateRoadmapStep(id, req.body);
      res.json(step);
    } catch (error: any) {
      console.error("Update roadmap step error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/admin/roadmap-steps/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRoadmapStep(id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Delete roadmap step error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // User profile endpoints
  app.put("/api/profile", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const { rollNumber, branch, year, collegeName } = req.body;
      
      if (!rollNumber || !branch || !year || !collegeName) {
        return res.status(400).json({ error: "All profile fields are required" });
      }

      const updatedUser = await storage.updateUserProfile(userId, {
        rollNumber,
        branch,
        year,
        collegeName,
        profileComplete: true,
      });

      res.json(updatedUser);
    } catch (error: any) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Student request endpoints
  app.post("/api/requests", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const { type, title, description, category, priority } = req.body;
      
      if (!type || !title || !description) {
        return res.status(400).json({ error: "Type, title, and description are required" });
      }

      const request = await storage.createStudentRequest({
        userId,
        type,
        title,
        description,
        category: category || null,
        priority: priority || "medium",
      });

      res.json(request);
    } catch (error: any) {
      console.error("Create request error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/requests", authMiddleware, async (req, res) => {
    try {
      const userId = req.userId!;
      const requests = await storage.getUserRequests(userId);
      res.json(requests);
    } catch (error: any) {
      console.error("Get requests error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin request management endpoints
  app.get("/api/admin/requests", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const requests = await storage.getAllStudentRequests();
      
      // Get user information for each request
      const requestsWithUsers = await Promise.all(
        requests.map(async (request) => {
          const user = await storage.getUser(request.userId);
          return {
            ...request,
            user: user ? {
              id: user.id,
              name: user.name,
              email: user.email,
            } : null,
          };
        })
      );
      
      res.json(requestsWithUsers);
    } catch (error: any) {
      console.error("Get all requests error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/admin/requests/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      
      const updatedRequest = await storage.updateStudentRequest(id, {
        status,
        adminNotes,
      });

      res.json(updatedRequest);
    } catch (error: any) {
      console.error("Update request error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin student management endpoints
  app.get("/api/admin/students", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      const allChallenges = await storage.getAllChallenges();
      const challengesMap = new Map(allChallenges.map(c => [c.id, c]));
      
      // Get additional data for each student
      const studentsWithDetails = await Promise.all(
        students.map(async (student) => {
          const progress = await storage.getUserProgress(student.id);
          const xpData = await storage.getUserXP(student.id);
          const enrolledChallenges = progress.length;
          
          // Calculate active and completed challenges
          let activeChallenges = 0;
          let completedChallenges = 0;
          
          progress.forEach(p => {
            const challenge = challengesMap.get(p.challengeId);
            if (challenge) {
              if (p.completedDays >= challenge.duration) {
                completedChallenges++;
              } else {
                activeChallenges++;
              }
            }
          });
          
          return {
            ...student,
            enrolledChallenges,
            activeChallenges,
            completedChallenges,
            totalXP: xpData?.totalXP || 0,
            level: xpData?.level || 1,
          };
        })
      );
      
      res.json(studentsWithDetails);
    } catch (error: any) {
      console.error("Get students error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin statistics endpoint
  app.get("/api/admin/stats", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const stats = await storage.getAdminStatistics();
      res.json(stats);
    } catch (error: any) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
