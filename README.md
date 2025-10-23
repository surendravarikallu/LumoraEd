# LumoraEd - Student Learning Platform

A comprehensive full-stack web application for student learning and challenge platform built with React, Node.js, and PostgreSQL.

## 🚀 Features

- **Student Dashboard** - Track progress, view challenges, and monitor achievements
- **Learning Roadmaps** - Structured learning paths for Python, Java, Full Stack Development, AI, and Data Science
- **Challenge System** - Interactive coding challenges and quizzes
- **Certification Tracking** - Manage and track learning certifications
- **Admin Panel** - Comprehensive admin interface for content management
- **Real-time Progress** - Live progress tracking and analytics
- **Responsive Design** - Mobile-first design with dark/light theme support

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Radix UI** for components
- **TanStack Query** for data fetching
- **Wouter** for routing
- **Firebase** for authentication

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL
- **Firebase Admin** for authentication
- **Winston** for logging
- **Helmet** for security
- **Rate limiting** and input validation

### Database
- **PostgreSQL** with Neon
- **Redis** for caching and sessions

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lumoraed.git
   cd lumoraed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.production.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed:roadmaps
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
lumoraed/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Node.js application
│   ├── middleware/        # Express middleware
│   ├── routes/           # API routes
│   ├── utils/            # Server utilities
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
└── dist/                 # Build output
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🔧 Development Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run db:push          # Push database schema
npm run db:seed:roadmaps # Seed roadmaps data
```

## 🔒 Security Features

- **Input Validation** - Sanitize and validate all inputs
- **XSS Protection** - Prevent cross-site scripting
- **Security Headers** - Comprehensive security headers
- **Session Security** - Secure session management
- **Authentication** - Firebase-based authentication

## 📊 Performance Features

- **Compression** - Gzip compression for responses
- **Database Optimization** - Connection pooling and query optimization
- **Lazy Loading** - Code splitting and lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/lumoraed/issues) page
2. Create a new issue if your problem isn't already reported
3. Join our community discussions

---

Made with ❤️ by the LumoraEd team