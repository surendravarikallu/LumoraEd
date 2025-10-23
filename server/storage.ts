import {
  users,
  challenges,
  tasks,
  quizzes,
  submissions,
  userProgress,
  certifications,
  roadmaps,
  roadmapSteps,
  type User,
  type InsertUser,
  type Challenge,
  type InsertChallenge,
  type Task,
  type InsertTask,
  type Quiz,
  type InsertQuiz,
  type Submission,
  type InsertSubmission,
  type UserProgress,
  type InsertUserProgress,
  type Certification,
  type InsertCertification,
  type Roadmap,
  type InsertRoadmap,
  type RoadmapStep,
  type InsertRoadmapStep,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;

  // Challenges
  getAllChallenges(userId?: string): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  getChallengeParticipantCount(challengeId: string): Promise<number>;

  // Tasks
  getTasksByChallenge(challengeId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;

  // Quizzes
  getQuizByTask(taskId: string): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // Submissions
  getUserSubmissions(userId: string, taskId?: string): Promise<Submission[]>;
  getSubmission(userId: string, taskId: string): Promise<Submission | undefined>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmissionStatus(id: string, status: string, score?: number): Promise<Submission>;

  // User Progress
  getUserProgress(userId: string, challengeId?: string): Promise<UserProgress[]>;
  getProgress(userId: string, challengeId: string): Promise<UserProgress | undefined>;
  createProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateProgress(id: string, data: Partial<UserProgress>): Promise<UserProgress>;

  // Certifications
  getAllCertifications(): Promise<Certification[]>;
  createCertification(cert: InsertCertification): Promise<Certification>;
  deleteCertification(id: string): Promise<void>;

  // Roadmaps
  getAllRoadmaps(): Promise<Roadmap[]>;
  getRoadmap(id: string): Promise<Roadmap | undefined>;
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  updateRoadmap(id: string, data: Partial<Roadmap>): Promise<Roadmap>;
  deleteRoadmap(id: string): Promise<void>;

  // Roadmap Steps
  getStepsByRoadmap(roadmapId: string): Promise<RoadmapStep[]>;
  getRoadmapStep(id: string): Promise<RoadmapStep | undefined>;
  createRoadmapStep(step: InsertRoadmapStep): Promise<RoadmapStep>;
  updateRoadmapStep(id: string, data: Partial<RoadmapStep>): Promise<RoadmapStep>;
  deleteRoadmapStep(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  // Challenges
  async getAllChallenges(): Promise<Challenge[]> {
    return await db.select().from(challenges).orderBy(desc(challenges.createdAt));
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge || undefined;
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [newChallenge] = await db.insert(challenges).values(challenge).returning();
    return newChallenge;
  }

  async getChallengeParticipantCount(challengeId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(userProgress)
      .where(eq(userProgress.challengeId, challengeId));
    return result[0]?.count || 0;
  }

  // Tasks
  async getTasksByChallenge(challengeId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.challengeId, challengeId));
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task as any).returning();
    return newTask;
  }

  // Quizzes
  async getQuizByTask(taskId: string): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.taskId, taskId));
    return quiz || undefined;
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz as any).returning();
    return newQuiz;
  }

  // Submissions
  async getUserSubmissions(userId: string, taskId?: string): Promise<Submission[]> {
    if (taskId) {
      return await db
        .select()
        .from(submissions)
        .where(and(eq(submissions.userId, userId), eq(submissions.taskId, taskId)));
    }
    return await db.select().from(submissions).where(eq(submissions.userId, userId));
  }

  async getSubmission(userId: string, taskId: string): Promise<Submission | undefined> {
    const [submission] = await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.userId, userId), eq(submissions.taskId, taskId)));
    return submission || undefined;
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db.insert(submissions).values(submission).returning();
    return newSubmission;
  }

  async updateSubmissionStatus(id: string, status: string, score?: number): Promise<Submission> {
    const [updated] = await db
      .update(submissions)
      .set({ status, score })
      .where(eq(submissions.id, id))
      .returning();
    return updated;
  }

  // User Progress
  async getUserProgress(userId: string, challengeId?: string): Promise<UserProgress[]> {
    if (challengeId) {
      return await db
        .select()
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.challengeId, challengeId)));
    }
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getProgress(userId: string, challengeId: string): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.challengeId, challengeId)));
    return progress || undefined;
  }

  async createProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [newProgress] = await db.insert(userProgress).values(progress).returning();
    return newProgress;
  }

  async updateProgress(id: string, data: Partial<UserProgress>): Promise<UserProgress> {
    const [updated] = await db
      .update(userProgress)
      .set(data)
      .where(eq(userProgress.id, id))
      .returning();
    return updated;
  }

  // Certifications
  async getAllCertifications(): Promise<Certification[]> {
    return await db.select().from(certifications).orderBy(desc(certifications.dateAdded));
  }

  async createCertification(cert: InsertCertification): Promise<Certification> {
    const [newCert] = await db.insert(certifications).values(cert).returning();
    return newCert;
  }

  async deleteCertification(id: string): Promise<void> {
    await db.delete(certifications).where(eq(certifications.id, id));
  }

  // Roadmaps
  async getAllRoadmaps(): Promise<Roadmap[]> {
    return await db.select().from(roadmaps).orderBy(desc(roadmaps.createdAt));
  }

  async getRoadmap(id: string): Promise<Roadmap | undefined> {
    const [roadmap] = await db.select().from(roadmaps).where(eq(roadmaps.id, id));
    return roadmap || undefined;
  }

  async createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap> {
    const [newRoadmap] = await db.insert(roadmaps).values(roadmap).returning();
    return newRoadmap;
  }

  async updateRoadmap(id: string, data: Partial<Roadmap>): Promise<Roadmap> {
    const [updated] = await db.update(roadmaps).set(data).where(eq(roadmaps.id, id)).returning();
    return updated;
  }

  async deleteRoadmap(id: string): Promise<void> {
    await db.delete(roadmaps).where(eq(roadmaps.id, id));
  }

  // Roadmap Steps
  async getStepsByRoadmap(roadmapId: string): Promise<RoadmapStep[]> {
    return await db.select().from(roadmapSteps).where(eq(roadmapSteps.roadmapId, roadmapId)).orderBy(roadmapSteps.stepNumber);
  }

  async getRoadmapStep(id: string): Promise<RoadmapStep | undefined> {
    const [step] = await db.select().from(roadmapSteps).where(eq(roadmapSteps.id, id));
    return step || undefined;
  }

  async createRoadmapStep(step: InsertRoadmapStep): Promise<RoadmapStep> {
    const [newStep] = await db.insert(roadmapSteps).values(step as any).returning();
    return newStep;
  }

  async updateRoadmapStep(id: string, data: Partial<RoadmapStep>): Promise<RoadmapStep> {
    const [updated] = await db.update(roadmapSteps).set(data).where(eq(roadmapSteps.id, id)).returning();
    return updated;
  }

  async deleteRoadmapStep(id: string): Promise<void> {
    await db.delete(roadmapSteps).where(eq(roadmapSteps.id, id));
  }
}

export const storage = new DatabaseStorage();
