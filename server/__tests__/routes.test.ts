import request from 'supertest';
import { Express } from 'express';
import { registerRoutes } from '../routes';
import { storage } from '../storage';

// Mock the storage module
jest.mock('../storage');

describe('API Routes', () => {
  let app: Express;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  beforeAll(async () => {
    // Create Express app for testing
    const express = require('express');
    app = express();
    app.use(express.json());
    
    // Register routes
    await registerRoutes(app);
  });
  
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
  
  describe('Authentication', () => {
    it('should create admin user', async () => {
      const mockUser = global.testUtils.createMockUser();
      (storage.createUser as jest.Mock).mockResolvedValue(mockUser);
      
      const response = await request(app)
        .post('/api/auth/admin-login')
        .send({
          email: 'admin@lumoraed.com',
          password: 'Admin@123'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
    });
    
    it('should reject invalid admin credentials', async () => {
      const response = await request(app)
        .post('/api/auth/admin-login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        })
        .expect(401);
      
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('Challenges', () => {
    it('should get all challenges', async () => {
      const mockChallenges = [global.testUtils.createMockChallenge()];
      (storage.getAllChallenges as jest.Mock).mockResolvedValue(mockChallenges);
      
      const response = await request(app)
        .get('/api/challenges')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
    
    it('should get challenge by ID', async () => {
      const mockChallenge = global.testUtils.createMockChallenge();
      (storage.getChallenge as jest.Mock).mockResolvedValue(mockChallenge);
      
      const response = await request(app)
        .get('/api/challenges/test-challenge-id')
        .expect(200);
      
      expect(response.body).toHaveProperty('id');
    });
  });
  
  describe('Roadmaps', () => {
    it('should get all roadmaps', async () => {
      const mockRoadmaps = [global.testUtils.createMockRoadmap()];
      (storage.getAllRoadmaps as jest.Mock).mockResolvedValue(mockRoadmaps);
      
      const response = await request(app)
        .get('/api/roadmaps')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
    
    it('should get roadmap by ID', async () => {
      const mockRoadmap = global.testUtils.createMockRoadmap();
      (storage.getRoadmap as jest.Mock).mockResolvedValue(mockRoadmap);
      (storage.getStepsByRoadmap as jest.Mock).mockResolvedValue([]);
      
      const response = await request(app)
        .get('/api/roadmaps/test-roadmap-id')
        .expect(200);
      
      expect(response.body).toHaveProperty('roadmap');
      expect(response.body).toHaveProperty('steps');
    });
  });
  
  describe('Certifications', () => {
    it('should get all certifications', async () => {
      const mockCertifications = [
        {
          id: 'test-cert-id',
          title: 'Test Certification',
          provider: 'Test Provider',
          link: 'https://example.com',
          dateAdded: new Date()
        }
      ];
      (storage.getAllCertifications as jest.Mock).mockResolvedValue(mockCertifications);
      
      const response = await request(app)
        .get('/api/certifications')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
  
  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
    });
    
    it('should handle validation errors', async () => {
      const response = await request(app)
        .post('/api/auth/admin-login')
        .send({}) // Empty body
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });
});
