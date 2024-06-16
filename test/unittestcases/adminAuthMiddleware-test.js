import sinon from 'sinon';
import { describe } from 'mocha';
import adminAuthMiddleware from '../../middleware/adminAuthMiddleware.js';
import { expect } from 'chai';

describe('adminAuthMiddleware', () => {
  it('should return 403 if user object is missing', () => {
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
    const next = sinon.spy();

    adminAuthMiddleware(req, res, next);

    sinon.assert.calledWith(res.status, 403);
    sinon.assert.calledWith(res.json, { message: 'Admin access required' });
    sinon.assert.notCalled(next);
  });

  it('should call next() if user is an admin', () => {
    const req = { user: { role: 'admin' } };
    const res = {};
    const next = sinon.spy();

    adminAuthMiddleware(req, res, next);

    sinon.assert.calledOnce(next);
  });
});
