import { expect } from 'chai';
import { describe } from 'mocha';
import sinon from 'sinon';
import facultyAuthMiddleware from '../../middleware/facultyAuthMiddleware.js';

describe('facultyAuthMiddleware', () => {
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
      facultyAuthMiddleware(req, res, next);
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  
    it('should call next if user role is faculty', () => {
      req.user = { role: 'faculty' };
      facultyAuthMiddleware(req, res, next);
      expect(next.calledOnce).to.be.true;
    });
  });