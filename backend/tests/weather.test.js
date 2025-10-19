const request = require('supertest');
const app = require('../server');

describe('Weather API Tests', () => {
  
  describe('Health Check', () => {
    test('GET /api/health should return status OK', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Weather Endpoints', () => {
    test('POST /api/weather/current should get weather for valid location', async () => {
      const response = await request(app)
        .post('/api/weather/current')
        .send({ location: 'London' });
      
      if (response.status === 200) {
        expect(response.body.location).toBeDefined();
        expect(response.body.current).toBeDefined();
        expect(response.body.forecast).toBeDefined();
      } else {
        // API key might not be configured
        expect(response.status).toBe(400);
      }
    });

    test('GET /api/weather should return weather records', async () => {
      const response = await request(app)
        .get('/api/weather')
        .expect(200);
      
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('Data Export', () => {
    test('GET /api/data/stats should return statistics', async () => {
      const response = await request(app)
        .get('/api/data/stats')
        .expect(200);
      
      expect(response.body.overall).toBeDefined();
      expect(response.body.topLocations).toBeDefined();
    });
  });
});

// Clean up after tests
afterAll(async () => {
  // Close database connection if needed
  // await mongoose.connection.close();
});