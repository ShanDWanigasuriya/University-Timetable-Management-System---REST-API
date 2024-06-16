import authMiddleware from '../../middleware/authMiddleware.js';
import sinon from 'sinon';

describe('authMiddleware', () => {
  it('should return 401 if token is null', () => {
    const req = { headers: { authorization: 'bearer' } };
    const res = { sendStatus: sinon.spy() };
    const next = sinon.spy();
    
    authMiddleware(req, res, next);
    
    sinon.assert.calledWith(res.sendStatus, 401);
    sinon.assert.notCalled(next);
  });

  it('should return 403 if token is invalid', () => {
    const req = { headers: { authorization: 'bearer invalid_token' } };
    const res = { sendStatus: sinon.spy() };
    const next = sinon.spy();
    
    authMiddleware(req, res, next);
    
    sinon.assert.calledWith(res.sendStatus, 403);
    sinon.assert.notCalled(next);
  });
});
