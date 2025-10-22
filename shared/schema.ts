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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  challenges: many(challenges),
  submissions: many(submissions),
  progress: many(userProgress),
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
