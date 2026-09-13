jest.mock('../models/Order');

const request = require('supertest');
const express = require('express');
const Order = require('../models/Order');
const orderController = require('../controllers/orderController');

const app = express();
app.use(express.json());
app.use('/order', orderController);

afterEach(() => jest.clearAllMocks());

describe('POST /order', () => {
  it('rejects an empty cart', async () => {
    const res = await request(app).post('/order').send({ items: [], shippingAddress: {} });
    expect(res.status).toBe(400);
  });

  it('rejects a missing shipping address', async () => {
    const res = await request(app)
      .post('/order')
      .send({ items: [{ productId: '1', title: 'Pizza', price: 10, quantity: 2 }] });

    expect(res.status).toBe(400);
  });

  it('computes subtotal, shipping cost and total correctly', async () => {
    Order.create.mockImplementation((data) => Promise.resolve({ _id: 'order1', ...data }));

    const res = await request(app)
      .post('/order')
      .send({
        items: [
          { productId: '1', title: 'Pizza', price: 10, quantity: 2 },
          { productId: '2', title: 'Burger', price: 5, quantity: 1 },
        ],
        shippingAddress: {
          name: 'Jane',
          email: 'jane@example.com',
          phone: '123',
          country: 'X',
          city: 'Y',
          postalCode: '12345',
        },
      });

    expect(res.status).toBe(201);
    expect(Order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        subtotal: 25, // 10*2 + 5*1
        shippingCost: 30,
        totalAmount: 55, // 25 + 30
      })
    );
  });
});

describe('GET /order/:id', () => {
  it('returns 404 when the order does not exist', async () => {
    Order.findById.mockResolvedValue(null);
    const res = await request(app).get('/order/000000000000000000000000');
    expect(res.status).toBe(404);
  });

  it('returns the order on success', async () => {
    Order.findById.mockResolvedValue({ _id: '1', totalAmount: 55 });
    const res = await request(app).get('/order/1');
    expect(res.status).toBe(200);
    expect(res.body.totalAmount).toBe(55);
  });
});
