import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - stores user information and authentication data
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("student"),
  firebaseUid: text("firebase_uid").unique(),
  // Student profile fields
  rollNumber: text("roll_number"),
  branch: text("branch"),
  year: text("year"),
  collegeName: text("college_name"),
  profileComplete: boolean("profile_complete").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Challenges table - stores learning challenges
export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tasks table - daily tasks within challenges
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengeId: varchar("challenge_id").notNull().references(() => challenges.id, { onDelete: "cascade" }),
  dayNumber: integer("day_number").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  resourceLinks: jsonb("resource_links").$type<Array<{ type: string; url: string; title: string }>>(),
});

// Quizzes table - quizzes for tasks
export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskId: varchar("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  questions: jsonb("questions").notNull().$type<Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>>(),
});

// Submissions table - student task submissions
export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  taskId: varchar("task_id").notNull().references(() => tasks.id),
  status: text("status").notNull().default("pending"),
  score: integer("score"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

// User progress table - tracks user progress in challenges
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  challengeId: varchar("challenge_id").notNull().references(() => challenges.id, { onDelete: "cascade" }),
  completedDays: integer("completed_days").notNull().default(0),
  streakCount: integer("streak_count").notNull().default(0),
  lastActivityDate: timestamp("last_activity_date"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
});

// Certifications table - free certification alerts
export const certifications = pgTable("certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  link: text("link").notNull(),
  dateAdded: timestamp("date_added").defaultNow().notNull(),
});

// Roadmaps table - learning roadmaps
export const roadmaps = pgTable("roadmaps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  estimatedDuration: integer("estimated_duration").notNull(), // in weeks
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Roadmap steps table - individual steps in a roadmap
export const roadmapSteps = pgTable("roadmap_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roadmapId: varchar("roadmap_id").notNull().references(() => roadmaps.id, { onDelete: "cascade" }),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  resourceLinks: jsonb("resource_links").$type<Array<{ type: string; url: string; title: string }>>(),
  isOptional: boolean("is_optional").notNull().default(false),
  xpReward: integer("xp_reward").default(10),
});

// User XP and Achievements
export const userXP = pgTable("user_xp", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  totalXP: integer("total_xp").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  streakCount: integer("streak_count").default(0).notNull(),
  lastActivityDate: timestamp("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const badges = pgTable("badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  xpRequired: integer("xp_required").default(0),
  category: text("category").notNull(),
  isRare: boolean("is_rare").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeId: varchar("badge_id").notNull().references(() => badges.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const xpTransactions = pgTable("xp_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  source: text("source").notNull(), // 'task_completion', 'quiz_perfect', 'streak', 'challenge_completion'
  sourceId: text("source_id"), // ID of the task, quiz, challenge, etc.
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Student requests table - for requesting new content
export const studentRequests = pgTable("student_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'roadmap', 'challenge', 'certification', 'suggestion'
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category"),
  priority: text("priority").default("medium"), // 'low', 'medium', 'high'
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected', 'in_progress', 'completed'
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  challenges: many(challenges),
  submissions: many(submissions),
  progress: many(userProgress),
  requests: many(studentRequests),
  userXP: many(userXP),
  userBadges: many(userBadges),
  xpTransactions: many(xpTransactions),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  creator: one(users, {
    fields: [challenges.createdBy],
    references: [users.id],
  }),
  tasks: many(tasks),
  userProgress: many(userProgress),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  challenge: one(challenges, {
    fields: [tasks.challengeId],
    references: [challenges.id],
  }),
  quiz: one(quizzes),
  submissions: many(submissions),
}));

export const quizzesRelations = relations(quizzes, ({ one }) => ({
  task: one(tasks, {
    fields: [quizzes.taskId],
    references: [tasks.id],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [submissions.taskId],
    references: [tasks.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  challenge: one(challenges, {
    fields: [userProgress.challengeId],
    references: [challenges.id],
  }),
}));

export const roadmapsRelations = relations(roadmaps, ({ one, many }) => ({
  creator: one(users, {
    fields: [roadmaps.createdBy],
    references: [users.id],
  }),
  steps: many(roadmapSteps),
}));

export const roadmapStepsRelations = relations(roadmapSteps, ({ one }) => ({
  roadmap: one(roadmaps, {
    fields: [roadmapSteps.roadmapId],
    references: [roadmaps.id],
  }),
}));

export const userXPRelations = relations(userXP, ({ one }) => ({
  user: one(users, {
    fields: [userXP.userId],
    references: [users.id],
  }),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

export const xpTransactionsRelations = relations(xpTransactions, ({ one }) => ({
  user: one(users, {
    fields: [xpTransactions.userId],
    references: [users.id],
  }),
}));

export const studentRequestsRelations = relations(studentRequests, ({ one }) => ({
  user: one(users, {
    fields: [studentRequests.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submittedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  enrolledAt: true,
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
  dateAdded: true,
});

export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({
  id: true,
  createdAt: true,
});

export const insertRoadmapStepSchema = createInsertSchema(roadmapSteps).omit({
  id: true,
});

export const insertUserXPSchema = createInsertSchema(userXP).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
  createdAt: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});

export const insertXPTransactionSchema = createInsertSchema(xpTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertStudentRequestSchema = createInsertSchema(studentRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;

export type Roadmap = typeof roadmaps.$inferSelect;
export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;

export type RoadmapStep = typeof roadmapSteps.$inferSelect;
export type InsertRoadmapStep = z.infer<typeof insertRoadmapStepSchema>;

export type UserXP = typeof userXP.$inferSelect;
export type InsertUserXP = z.infer<typeof insertUserXPSchema>;

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;

export type XPTransaction = typeof xpTransactions.$inferSelect;
export type InsertXPTransaction = z.infer<typeof insertXPTransactionSchema>;

export type StudentRequest = typeof studentRequests.$inferSelect;
export type InsertStudentRequest = z.infer<typeof insertStudentRequestSchema>;
