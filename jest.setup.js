// Jest setup file
import '@testing-library/jest-dom';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/lumoraed_test';
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.FIREBASE_PRIVATE_KEY = 'test-key';
process.env.FIREBASE_CLIENT_EMAIL = 'test@test.com';

// Mock Firebase Admin
jest.mock('./server/firebase-admin', () => ({
  verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-uid' })
}));

// Mock database
jest.mock('./server/db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([{ id: 'test-id' }]),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis()
  }
}));

// Mock storage
jest.mock('./server/storage', () => ({
  storage: {
    getUser: jest.fn(),
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    getAllChallenges: jest.fn(),
    createChallenge: jest.fn(),
    getAllRoadmaps: jest.fn(),
    createRoadmap: jest.fn(),
    getAllCertifications: jest.fn(),
    createCertification: jest.fn()
  }
}));

// Global test utilities
global.testUtils = {
  createMockUser: () => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'student',
    firebaseUid: 'test-firebase-uid',
    createdAt: new Date()
  }),
  
  createMockChallenge: () => ({
    id: 'test-challenge-id',
    title: 'Test Challenge',
    description: 'Test Description',
    duration: 30,
    createdBy: 'test-user-id',
    createdAt: new Date()
  }),
  
  createMockRoadmap: () => ({
    id: 'test-roadmap-id',
    title: 'Test Roadmap',
    description: 'Test Description',
    category: 'Programming',
    difficulty: 'Beginner',
    estimatedDuration: 8,
    createdBy: 'test-user-id',
    createdAt: new Date()
  })
};

// Console error suppression for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
