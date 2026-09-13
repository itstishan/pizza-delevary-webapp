jest.mock('../models/Product');

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const productController = require('../controllers/productController');

const app = express();
app.use(express.json());
app.use('/product', productController);

const adminToken = () => jwt.sign({ id: 'admin1', isAdmin: true }, process.env.JWT_SECRET);
const userToken = () => jwt.sign({ id: 'user1', isAdmin: false }, process.env.JWT_SECRET);

afterEach(() => jest.clearAllMocks());

describe('GET /product', () => {
  it('only forwards the category field to the query, never arbitrary operators', async () => {
    Product.find.mockResolvedValue([]);

    // an attempted NoSQL-injection style query
    await request(app).get('/product').query({ category: 'Pizza', 'price[$gt]': 0 });

    expect(Product.find).toHaveBeenCalledWith({ category: 'Pizza' });
  });

  it('queries with an empty filter when no category is given', async () => {
    Product.find.mockResolvedValue([]);

    await request(app).get('/product');

    expect(Product.find).toHaveBeenCalledWith({});
  });
});

describe('GET /product/find/:id', () => {
  it('returns 404 when the product does not exist', async () => {
    Product.findById.mockResolvedValue(null);

    const res = await request(app).get('/product/find/000000000000000000000000');

    expect(res.status).toBe(404);
  });

  it('returns 400 for an invalid id instead of hanging', async () => {
    Product.findById.mockRejectedValue(new Error('Cast to ObjectId failed'));

    const res = await request(app).get('/product/find/not-an-id');

    expect(res.status).toBe(400);
  });

  it('returns the product on success', async () => {
    Product.findById.mockResolvedValue({ _id: '1', title: 'Cheese Pizza' });

    const res = await request(app).get('/product/find/1');

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Cheese Pizza');
  });
});

describe('POST /product', () => {
  it('rejects requests with no token', async () => {
    const res = await request(app).post('/product').send({ title: 'x' });
    expect(res.status).toBe(403);
  });

  it('rejects a non-admin user', async () => {
    const res = await request(app)
      .post('/product')
      .set('Authorization', `Bearer ${userToken()}`)
      .send({ title: 'x' });

    expect(res.status).toBe(403);
  });

  it('creates a product for an admin user', async () => {
    Product.create.mockResolvedValue({ _id: '1', title: 'Veggie Pizza' });

    const res = await request(app)
      .post('/product')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({
        title: 'Veggie Pizza',
        description: 'desc',
        price: 9.99,
        img: 'veggie.jpg',
        category: 'Pizza',
      });

    expect(res.status).toBe(201);
    expect(Product.create).toHaveBeenCalledWith({
      title: 'Veggie Pizza',
      description: 'desc',
      price: 9.99,
      img: 'veggie.jpg',
      images: undefined,
      category: 'Pizza',
    });
  });
});

describe('PUT /product/update/:id', () => {
  it('rejects a non-admin user', async () => {
    const res = await request(app)
      .put('/product/update/1')
      .set('Authorization', `Bearer ${userToken()}`)
      .send({ title: 'x' });

    expect(res.status).toBe(403);
  });

  it('returns 404 when updating a product that does not exist', async () => {
    Product.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .put('/product/update/1')
      .set('Authorization', `Bearer ${adminToken()}`)
      .send({ title: 'x' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /product/delete/:id', () => {
  it('rejects a non-admin user', async () => {
    const res = await request(app)
      .delete('/product/delete/1')
      .set('Authorization', `Bearer ${userToken()}`);

    expect(res.status).toBe(403);
  });

  it('returns 404 when deleting a product that does not exist', async () => {
    Product.findByIdAndDelete.mockResolvedValue(null);

    const res = await request(app)
      .delete('/product/delete/1')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(404);
  });

  it('deletes successfully for an admin user', async () => {
    Product.findByIdAndDelete.mockResolvedValue({ _id: '1' });

    const res = await request(app)
      .delete('/product/delete/1')
      .set('Authorization', `Bearer ${adminToken()}`);

    expect(res.status).toBe(200);
  });
});
