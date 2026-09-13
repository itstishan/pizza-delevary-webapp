jest.mock('../models/ContactMessage');

const request = require('supertest');
const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const contactController = require('../controllers/contactController');

const app = express();
app.use(express.json());
app.use('/contact', contactController);

afterEach(() => jest.clearAllMocks());

describe('POST /contact', () => {
  it('rejects missing required fields', async () => {
    const res = await request(app).post('/contact').send({ name: 'Jane' });
    expect(res.status).toBe(400);
  });

  it('creates a contact message on success', async () => {
    ContactMessage.create.mockResolvedValue({
      _id: '1',
      name: 'Jane',
      email: 'jane@example.com',
      subject: 'Hello',
      message: 'Hi there',
    });

    const res = await request(app)
      .post('/contact')
      .send({ name: 'Jane', email: 'jane@example.com', subject: 'Hello', message: 'Hi there' });

    expect(res.status).toBe(201);
    expect(ContactMessage.create).toHaveBeenCalledWith({
      name: 'Jane',
      email: 'jane@example.com',
      subject: 'Hello',
      message: 'Hi there',
    });
  });
});
