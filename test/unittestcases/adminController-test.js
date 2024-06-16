import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import Faculty from '../../models/faculty.js';
import Course from '../../models/course.js';
import Room from '../../models/room.js';
import adminController from '../../controllers/adminController.js';

describe('adminController', () => {
    describe('assignFacultyToCourse', () => {
      afterEach(() => {
        sinon.restore(); // Restore the original behavior of the wrapped methods
      });
  
      // Test case 1: Return 404 error if faculty not found
      it('should return 404 error if faculty not found', async () => {
        const req = { body: { facultyId: 'nonexistentId', courseId: 'courseId' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        const stubFaculty = sinon.stub(Faculty, 'findById').resolves(null);
        await adminController.assignFacultyToCourse(req, res);

        expect(stubFaculty.calledOnceWith('nonexistentId')).to.be.true;
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledOnceWith({ message: 'Faculty not found' })).to.be.true;
      });
  
      // Test case 2: Return 404 error if course not found
      it('should return 404 error if course not found', async () => {
        const req = { body: { facultyId: 'facultyId', courseId: 'nonexistentId' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        const stubFaculty = sinon.stub(Faculty, 'findById').resolves({ _id: 'facultyId' });
        const stubCourse = sinon.stub(Course, 'findById').resolves(null);

        await adminController.assignFacultyToCourse(req, res);

        expect(stubFaculty.calledOnceWith('facultyId')).to.be.true;
        expect(stubCourse.calledOnceWith('nonexistentId')).to.be.true;
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledOnceWith({ message: 'Course not found' })).to.be.true;
      });
    });
  });


  describe('Admin Controller', () => {
    afterEach(() => {
      sinon.restore(); // Restore all stubs and spies after each test
    });
  
    describe('addFaculty', () => {
      it('should return 409 if username already exists', async () => {
        const req = { body: { username: 'existingfaculty', password: 'password123' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
        // Stubbing the Faculty.findOne method to return an existing faculty with the same username
        sinon.stub(Faculty, 'findOne').resolves({});
  
        await adminController.addFaculty(req, res);
  
        sinon.assert.calledWithExactly(Faculty.findOne, { username: 'existingfaculty' });
        sinon.assert.calledWithExactly(res.status, 409);
        sinon.assert.calledWithExactly(res.json, { message: 'Username already exists' });
      });
  
      it('should handle internal server error', async () => {
        const req = { body: { username: 'newfaculty', password: 'password123' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
        // Stubbing the Faculty.findOne method to throw an error
        sinon.stub(Faculty, 'findOne').rejects(new Error('Database connection error'));
  
        await adminController.addFaculty(req, res);
  
        sinon.assert.calledWithExactly(res.status, 500);
        sinon.assert.calledWithExactly(res.json, { message: 'Internal Server Error' });
      });
    });
  });

  describe('Admin Controller Unit Tests', () => {
    let req;
    let res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            json: sinon.spy(),
            status: sinon.stub().returns({ json: sinon.spy() }),
        };
    });

    describe('addFaculty', () => {
        it('should add a new faculty', async () => {
            req.body.username = 'testfaculty';
            req.body.password = 'password';

            sinon.stub(Faculty, 'findOne').resolves(null);
            sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
            sinon.stub(Faculty.prototype, 'save').resolves();

            await adminController.addFaculty(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.have.property('message').equal('Faculty added successfully');
        });
    });

    describe('updateCourse', () => {
      it('should update an existing course', async () => {
          req.params.courseId = 'courseId';
          req.body = { name: 'Updated Course Name', code: 'UC101', description: 'Updated Description', credits: 4 };

          sinon.stub(Course, 'findByIdAndUpdate').resolves({ name: 'Existing Course', code: 'EC101', description: 'Existing Description', credits: 3 });

          await adminController.updateCourse(req, res);

          expect(res.json.calledOnce).to.be.true;
          expect(res.json.firstCall.args[0]).to.have.property('message').equal('Course updated successfully');
      });
  });

  describe('deleteCourse', () => {
    it('should delete an existing course', async () => {
        req.params.courseId = 'courseId';

        sinon.stub(Course, 'findByIdAndDelete').resolves({ _id: 'courseId' });

        await adminController.deleteCourse(req, res);

        expect(res.json.calledOnce).to.be.true;
        expect(res.json.firstCall.args[0]).to.have.property('message').equal('Course deleted successfully');
    });
});
});