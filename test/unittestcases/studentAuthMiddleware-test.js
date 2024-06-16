import { expect } from 'chai';
import studentAuthMiddleware from '../../middleware/studentAuthMiddleware.js';
import sinon from 'sinon';

describe('studentAuthMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 403 error if user is not present in request', () => {
    studentAuthMiddleware(req, res, next);
    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('should call next if user role is student', () => {
    req.user = { role: 'student' };
    studentAuthMiddleware(req, res, next);
    expect(next.calledOnce).to.be.true;
  });
});
