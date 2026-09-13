jest.mock('../models/Review');

const request = require('supertest');
const express = require('express');
const Review = require('../models/Review');
const reviewController = require('../controllers/reviewController');

const app = express();
app.use(express.json());
app.use('/review', reviewController);

afterEach(() => jest.clearAllMocks());

describe('GET /review/:productId', () => {
  it('lists reviews for a product, most recent first', async () => {
    const sort = jest.fn().mockResolvedValue([{ _id: 'r1', message: 'great!' }]);
    Review.find.mockReturnValue({ sort });

    const res = await request(app).get('/review/product1');

    expect(Review.find).toHaveBeenCalledWith({ productId: 'product1' });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('POST /review', () => {
  it('rejects missing fields', async () => {
    const res = await request(app).post('/review').send({ name: 'Jane' });
    expect(res.status).toBe(400);
  });

  it('creates a review on success', async () => {
    Review.create.mockResolvedValue({
      _id: 'r1',
      productId: 'p1',
      name: 'Jane',
      email: 'jane@example.com',
      message: 'great!',
    });

    const res = await request(app)
      .post('/review')
      .send({ productId: 'p1', name: 'Jane', email: 'jane@example.com', message: 'great!' });

    expect(res.status).toBe(201);
    expect(Review.create).toHaveBeenCalledWith({
      productId: 'p1',
      name: 'Jane',
      email: 'jane@example.com',
      message: 'great!',
    });
  });
});
