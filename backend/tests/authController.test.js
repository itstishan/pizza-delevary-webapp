jest.mock('../models/User');
jest.mock('bcrypt');

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const authController = require('../controllers/authController');

const app = express();
app.use(express.json());
app.use('/auth', authController);

afterEach(() => jest.clearAllMocks());

describe('POST /auth/register', () => {
  it('rejects missing fields with 400', async () => {
    const res = await request(app).post('/auth/register').send({ username: 'a' });
    expect(res.status).toBe(400);
  });

  it('rejects a password shorter than 6 characters', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'a', email: 'a@b.com', password: '123' });
    expect(res.status).toBe(400);
  });

  it('rejects a duplicate email with 409', async () => {
    User.findOne.mockResolvedValue({ _id: 'existing-user' });

    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'a', email: 'a@b.com', password: '123456' });

    expect(res.status).toBe(409);
  });

  it('creates a user and ignores a client-supplied isAdmin flag', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed-password');
    // a real Mongoose document exposes fields both as top-level getters and inside _doc - mirror both here
    User.create.mockResolvedValue({
      _id: 'new-user-id',
      username: 'a',
      email: 'a@b.com',
      password: 'hashed-password',
      isAdmin: false,
      _doc: {
        _id: 'new-user-id',
        username: 'a',
        email: 'a@b.com',
        password: 'hashed-password',
        isAdmin: false,
      },
    });

    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'a', email: 'a@b.com', password: '123456', isAdmin: true });

    expect(res.status).toBe(201);
    expect(res.body.others.password).toBeUndefined();
    expect(res.body.token).toBeDefined();

    // the client-sent isAdmin: true must never reach User.create - only whitelisted fields do (this was a privilege-escalation bug)
    expect(User.create).toHaveBeenCalledWith({
      username: 'a',
      email: 'a@b.com',
      password: 'hashed-password',
    });

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.isAdmin).toBe(false);
  });
});

describe('POST /auth/login', () => {
  it('rejects missing fields with 400', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('returns 401 (not 500) for an unknown email', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'nope@b.com', password: '123456' });

    expect(res.status).toBe(401);
  });

  it('returns 401 for a wrong password', async () => {
    User.findOne.mockResolvedValue({ _doc: { _id: 'u1', password: 'hashed' }, password: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'a@b.com', password: 'wrong' });

    expect(res.status).toBe(401);
  });

  it('logs in successfully and signs isAdmin into the token', async () => {
    User.findOne.mockResolvedValue({
      _id: 'u1',
      password: 'hashed',
      isAdmin: true,
      _doc: { _id: 'u1', username: 'a', email: 'a@b.com', password: 'hashed', isAdmin: true },
    });
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'a@b.com', password: 'correct' });

    expect(res.status).toBe(200);
    expect(res.body.others.password).toBeUndefined();

    // isAdmin must be on the login token too, or verifyTokenAdmin never passes for a user who just logged in
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.isAdmin).toBe(true);
  });
});
