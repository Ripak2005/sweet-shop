const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const User = require('../../models/User');

let mongoServer;

/**
 * Setup: Connect to in-memory MongoDB before all tests
 */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

/**
 * Cleanup: Clear database after each test
 */
afterEach(async () => {
  await User.deleteMany({});
});

/**
 * Teardown: Close connection and stop MongoDB after all tests
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth API Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toHaveProperty('name', userData.name);
      expect(res.body.data.user).toHaveProperty('email', userData.email);
      expect(res.body.data.user).not.toHaveProperty('password');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.role).toBe('user');
    });

    it('should register an admin user when role is specified', async () => {
      const userData = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(res.body.data.user.role).toBe('admin');
    });

    it('should fail when email already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Try to register with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('email');
    });

    it('should fail when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe'
          // Missing email and password
        })
        .expect(400);

      expect(res.body.status).toBe('error');
    });

    it('should fail when email format is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);

      expect(res.body.status).toBe('error');
    });

    it('should fail when password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: '12345'
        })
        .expect(400);

      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid credentials');
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid credentials');
    });

    it('should fail when email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        })
        .expect(400);

      expect(res.body.status).toBe('error');
    });

    it('should fail when password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        })
        .expect(400);

      expect(res.body.status).toBe('error');
    });
  });
});
