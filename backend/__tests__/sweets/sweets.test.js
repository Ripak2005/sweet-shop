const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const User = require('../../models/User');
const Sweet = require('../../models/Sweet');

let mongoServer;
let userToken;
let adminToken;
let userId;
let adminId;

/**
 * Setup: Connect to in-memory MongoDB before all tests
 */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create test users
  const userRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      role: 'user'
    });
  
  userToken = userRes.body.data.token;
  userId = userRes.body.data.user._id;

  const adminRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    });
  
  adminToken = adminRes.body.data.token;
  adminId = adminRes.body.data.user._id;
});

/**
 * Cleanup: Clear sweets after each test
 */
afterEach(async () => {
  await Sweet.deleteMany({});
});

/**
 * Teardown: Close connection and stop MongoDB after all tests
 */
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Sweet API Endpoints', () => {
  describe('POST /api/sweets', () => {
    it('should create a new sweet as admin', async () => {
      const sweetData = {
        name: 'Dark Chocolate Bar',
        category: 'chocolate',
        price: 25.99,
        quantity: 100,
        description: 'Premium dark chocolate',
        imageUrl: 'https://example.com/chocolate.jpg'
      };

      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(res.body.status).toBe('success');
      expect(res.body.data.sweet).toHaveProperty('name', sweetData.name);
      expect(res.body.data.sweet).toHaveProperty('category', sweetData.category);
      expect(res.body.data.sweet).toHaveProperty('price', sweetData.price);
      expect(res.body.data.sweet).toHaveProperty('quantity', sweetData.quantity);
      expect(res.body.data.sweet).toHaveProperty('_id');
    });

    it('should fail to create sweet as regular user', async () => {
      const sweetData = {
        name: 'Dark Chocolate Bar',
        category: 'chocolate',
        price: 25.99,
        quantity: 100
      };

      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);

      expect(res.body.status).toBe('error');
    });

    it('should fail to create sweet without authentication', async () => {
      const sweetData = {
        name: 'Dark Chocolate Bar',
        category: 'chocolate',
        price: 25.99,
        quantity: 100
      };

      const res = await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);

      expect(res.body.status).toBe('error');
    });

    it('should fail when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate'
          // Missing category, price, quantity
        })
        .expect(400);

      expect(res.body.status).toBe('error');
    });

    it('should fail when sweet name already exists', async () => {
      const sweetData = {
        name: 'Unique Chocolate',
        category: 'chocolate',
        price: 25.99,
        quantity: 100
      };

      // Create first sweet
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData);

      // Try to create duplicate
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(400);

      expect(res.body.status).toBe('error');
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      // Create test sweets
      await Sweet.create([
        {
          name: 'Dark Chocolate',
          category: 'chocolate',
          price: 25.99,
          quantity: 100
        },
        {
          name: 'Gummy Bears',
          category: 'gummy',
          price: 15.50,
          quantity: 50
        },
        {
          name: 'Lollipop',
          category: 'lollipop',
          price: 5.99,
          quantity: 200
        }
      ]);
    });

    it('should get all sweets', async () => {
      const res = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.sweets).toHaveLength(3);
      expect(res.body.data).toHaveProperty('count', 3);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .get('/api/sweets')
        .expect(401);

      expect(res.body.status).toBe('error');
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create([
        {
          name: 'Dark Chocolate Bar',
          category: 'chocolate',
          price: 25.99,
          quantity: 100
        },
        {
          name: 'Milk Chocolate',
          category: 'chocolate',
          price: 20.50,
          quantity: 50
        },
        {
          name: 'Gummy Bears',
          category: 'gummy',
          price: 15.50,
          quantity: 75
        },
        {
          name: 'Strawberry Lollipop',
          category: 'lollipop',
          price: 5.99,
          quantity: 200
        }
      ]);
    });

    it('should search sweets by name', async () => {
      const res = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.sweets.length).toBeGreaterThan(0);
      expect(res.body.data.sweets.every(s => 
        s.name.toLowerCase().includes('chocolate')
      )).toBe(true);
    });

    it('should filter sweets by category', async () => {
      const res = await request(app)
        .get('/api/sweets/search?category=chocolate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.sweets.every(s => s.category === 'chocolate')).toBe(true);
    });

    it('should filter sweets by price range', async () => {
      const res = await request(app)
        .get('/api/sweets/search?minPrice=10&maxPrice=20')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.sweets.every(s => 
        s.price >= 10 && s.price <= 20
      )).toBe(true);
    });

    it('should search with multiple filters', async () => {
      const res = await request(app)
        .get('/api/sweets/search?category=chocolate&minPrice=20')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.sweets.every(s => 
        s.category === 'chocolate' && s.price >= 20
      )).toBe(true);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'candy',
        price: 10.99,
        quantity: 50
      });
      sweetId = sweet._id;
    });

    it('should update sweet as admin', async () => {
      const updateData = {
        price: 15.99,
        quantity: 100
      };

      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.sweet.price).toBe(updateData.price);
      expect(res.body.data.sweet.quantity).toBe(updateData.quantity);
    });

    it('should fail to update as regular user', async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 15.99 })
        .expect(403);

      expect(res.body.status).toBe('error');
    });

    it('should fail with invalid sweet ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 15.99 })
        .expect(404);

      expect(res.body.status).toBe('error');
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'candy',
        price: 10.99,
        quantity: 50
      });
      sweetId = sweet._id;
    });

    it('should delete sweet as admin', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.status).toBe('success');

      // Verify sweet is deleted
      const sweet = await Sweet.findById(sweetId);
      expect(sweet).toBeNull();
    });

    it('should fail to delete as regular user', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.status).toBe('error');
    });

    it('should fail with invalid sweet ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .delete(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'candy',
        price: 10.99,
        quantity: 50
      });
      sweetId = sweet._id;
    });

    it('should purchase sweet and decrease quantity', async () => {
      const purchaseData = { quantity: 5 };

      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.sweet.quantity).toBe(45);
      expect(res.body.data).toHaveProperty('totalPrice', 54.95);
    });

    it('should fail when purchasing more than available', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 100 })
        .expect(400);

      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('stock');
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .send({ quantity: 5 })
        .expect(401);

      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: 'Test Sweet',
        category: 'candy',
        price: 10.99,
        quantity: 50
      });
      sweetId = sweet._id;
    });

    it('should restock sweet as admin', async () => {
      const restockData = { quantity: 30 };

      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restockData)
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.data.sweet.quantity).toBe(80);
    });

    it('should fail to restock as regular user', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 30 })
        .expect(403);

      expect(res.body.status).toBe('error');
    });

    it('should fail with negative quantity', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -10 })
        .expect(400);

      expect(res.body.status).toBe('error');
    });
  });
});
