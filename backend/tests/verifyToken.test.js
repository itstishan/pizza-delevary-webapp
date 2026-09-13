const jwt = require('jsonwebtoken');
const { verifyToken, verifyTokenAdmin } = require('../middllewares/verifyToken');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('verifyToken', () => {
  it('rejects a request with no authorization header', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects a header that is not "Bearer <token>" instead of hanging with no response', () => {
    const req = { headers: { authorization: 'Basic abc123' } };
    const res = mockRes();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects an invalid/expired token', (done) => {
    const req = { headers: { authorization: 'Bearer not-a-real-token' } };
    const res = mockRes();
    res.json = jest.fn(() => {
      expect(res.status).toHaveBeenCalledWith(403);
      done();
    });

    verifyToken(req, res, jest.fn());
  });

  it('calls next() and attaches the decoded payload for a valid token', (done) => {
    const token = jwt.sign({ id: 'user1', isAdmin: false }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();

    verifyToken(req, res, () => {
      expect(req.user).toMatchObject({ id: 'user1', isAdmin: false });
      done();
    });
  });
});

describe('verifyTokenAdmin', () => {
  it('rejects a valid token for a non-admin user', (done) => {
    const token = jwt.sign({ id: 'user1', isAdmin: false }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    res.json = jest.fn(() => {
      expect(res.status).toHaveBeenCalledWith(403);
      done();
    });

    verifyTokenAdmin(req, res, jest.fn());
  });

  it('calls next() for a valid admin token', (done) => {
    const token = jwt.sign({ id: 'admin1', isAdmin: true }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();

    verifyTokenAdmin(req, res, () => {
      expect(req.user).toMatchObject({ id: 'admin1', isAdmin: true });
      done();
    });
  });
});
