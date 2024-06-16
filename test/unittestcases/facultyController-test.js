import sinon from 'sinon';
import { expect } from 'chai';
import facultyController from '../../controllers/facultyController.js';
import Timetable from '../../models/timetable.js';

describe('facultyController', () => {
  describe('viewTimetable', () => {
    afterEach(() => {
      sinon.restore(); // Restore stubs after each test
    });
      
    it('should handle internal server error', async () => {
      const req = { user: { user: { id: 'faculty_id' } } }; // Adjusted faculty ID structure
      const jsonSpy = sinon.spy();
      const statusStub = sinon.stub().returnsThis();
      const res = { json: jsonSpy, status: statusStub };

      // Stub Timetable.find() to throw an error
      sinon.stub(Timetable, 'find').throws('Error');

      await facultyController.viewTimetable(req, res);

      expect(statusStub.calledWith(500)).to.be.true;
      expect(jsonSpy.calledOnce).to.be.true;
    });
  });
});
