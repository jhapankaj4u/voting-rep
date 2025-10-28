import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookverse_test');
});
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Auth', () => {
  it('signup -> returns token and user', async () => {
    const res = await request(app).post('/api/auth/signup').send({ username: 'testuser', email: 'test@example.com', password: 'Passw0rd!' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
  });
});
