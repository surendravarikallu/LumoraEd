# LumoraEd - Student Learning Platform

## Overview
LumoraEd is a full-stack web application that helps students achieve academic and career goals through structured daily challenges. Students can complete tasks, take quizzes, track progress, and discover free certification opportunities.

## Tech Stack
- **Frontend**: React, TailwindCSS, shadcn/ui, Wouter (routing), TanStack Query
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Firebase Auth (Google & Email/Password)
- **Charts**: Recharts
- **Hosting**: Replit

## Core Features

### User Features
1. **Authentication**: Google and email/password login via Firebase
2. **Dashboard**: Progress overview with metrics, charts, and active challenges
3. **Challenges**: Browse and enroll in learning challenges
4. **Daily Tasks**: Complete structured daily tasks with resources (links, PDFs, videos)
5. **Quizzes**: Test knowledge with interactive quizzes and instant feedback
6. **Progress Tracking**: View completion percentage, daily streaks, and progress history
7. **Certifications**: Discover free certification opportunities

### Admin Features
1. **Challenge Management**: Create and manage learning challenges
2. **Task Creation**: Add daily tasks with content and resource links
3. **Certification Alerts**: Add free certification opportunities for students

## Database Schema

### Tables
- `users`: User accounts (id, email, name, role, firebaseUid)
- `challenges`: Learning challenges (id, title, description, duration, createdBy)
- `tasks`: Daily tasks within challenges (id, challengeId, dayNumber, title, content, resourceLinks)
- `quizzes`: Quizzes for tasks (id, taskId, questions)
- `submissions`: Student task submissions (id, userId, taskId, status, score)
- `user_progress`: Track user progress in challenges (id, userId, challengeId, completedDays, streakCount)
- `certifications`: Free certification alerts (id, title, provider, link)

## API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Firebase token and create/retrieve user

### Dashboard
- `GET /api/dashboard` - Get user dashboard data (metrics, progress, charts)

### Challenges
- `GET /api/challenges` - Get all challenges with enrollment status
- `GET /api/challenges/:id` - Get challenge details with tasks and progress
- `POST /api/challenges/:id/enroll` - Enroll in a challenge

### Tasks
- `GET /api/tasks/:id` - Get task details with quiz and submission
- `POST /api/tasks/:id/complete` - Mark task as complete
- `POST /api/tasks/:id/quiz/submit` - Submit quiz answers

### Certifications
- `GET /api/certifications` - Get all certifications

### Admin
- `GET /api/admin/challenges` - Get all challenges (admin only)
- `POST /api/admin/challenges` - Create new challenge (admin only)
- `POST /api/admin/challenges/:id/tasks` - Create task for challenge (admin only)
- `GET /api/admin/certifications` - Get all certifications (admin only)
- `POST /api/admin/certifications` - Add certification (admin only)
- `DELETE /api/admin/certifications/:id` - Delete certification (admin only)

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn components
│   │   ├── AppSidebar.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── MetricCard.tsx
│   │   └── StreakCalendar.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/
│   │   ├── firebase.ts
│   │   └── queryClient.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Challenges.tsx
│   │   ├── ChallengeDetail.tsx
│   │   ├── TaskDetail.tsx
│   │   ├── Certifications.tsx
│   │   └── Admin.tsx
│   └── App.tsx
server/
├── db.ts          # Database connection
├── storage.ts     # Data access layer
└── routes.ts      # API routes
shared/
└── schema.ts      # Shared types and database schema
```

## Environment Variables

Required Firebase environment variables (frontend):
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_API_KEY`

Database environment variables (auto-configured):
- `DATABASE_URL`
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

## Running the Application

1. Install dependencies: `npm install`
2. Push database schema: `npm run db:push`
3. Start development server: `npm run dev`

The application will be available on port 5000.

## User Roles

- **student**: Default role for new users, can enroll in challenges and track progress
- **admin**: Can create challenges, tasks, and manage certifications

To make a user admin, update their role in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Design System

The application uses a clean, minimal design with:
- Primary color: Purple-blue (251 63% 51%)
- Secondary color: Blue (217 91% 60%)
- Success color: Green (142 71% 45%)
- Font family: Inter (primary), JetBrains Mono (code/resources)
- Dark mode support with automatic theme switching

## Key Features Implementation

### Progress Tracking
- Tracks completed days, streak count, and last activity date
- Calculates streaks based on consecutive daily completions
- Updates progress when tasks are completed

### Quiz System
- Multiple choice questions with instant feedback
- Scores are calculated and stored in submissions
- Quiz completion triggers task completion

### Challenge Enrollment
- Students can enroll in multiple challenges
- Progress is tracked separately for each challenge
- Enrollment creates a user_progress record

### Resource Links
- Supports multiple resource types (PDF, video, links)
- Stored as JSONB array in tasks table
- Displayed with appropriate icons in the UI

## Recent Changes
- Initial setup with Firebase authentication
- Complete database schema implementation
- All frontend pages and components built
- API endpoints for all features
- Admin panel for content management
