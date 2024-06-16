import { expect } from 'chai';
import sinon from 'sinon';
import studentController from '../../controllers/studentController.js';
import Student from '../../models/student.js';
import Course from '../../models/course.js';
import Timetable from '../../models/timetable.js';

describe('Student Controller', () => {
  describe('viewTimetable', () => {
    it('should return timetable for the student\'s batch and specialization', async () => {
      // Mock Student.findById to return a student
      const student = { _id: 'studentId', batch: 'Batch A', specialization: 'Computer Science' };
      sinon.stub(Student, 'findById').resolves(student);

      // Mock Timetable.find to return timetable
      const timetable = [{ day: 'Monday', time: '9:00 AM - 10:00 AM', course: 'Maths' }];
      sinon.stub(Timetable, 'find').resolves(timetable);

      // Mock response object
      const res = { json: sinon.stub() };

      // Call the function
      await studentController.viewTimetable({ user: { user: { id: 'studentId' } } }, res);

      // Assertions
      sinon.assert.calledWithExactly(Student.findById, 'studentId');
      sinon.assert.calledWithExactly(Timetable.find, { batch: 'Batch A', specialization: 'Computer Science' });
      sinon.assert.calledWithExactly(res.json, { timetable });

      // Restore the stubs
      Student.findById.restore();
      Timetable.find.restore();
    });

    it('should return 404 error if student is not found', async () => {
      // Mock Student.findById to return null
      sinon.stub(Student, 'findById').resolves(null);

      // Mock response object
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      // Call the function
      await studentController.viewTimetable({ user: { user: { id: 'studentId' } } }, res);

      // Assertions
      sinon.assert.calledWithExactly(res.status, 404);
      sinon.assert.calledWithExactly(res.json, { message: 'Student not found' });

      // Restore the stub
      Student.findById.restore();
    });
  });

  describe('enrollCourse', () => {
    it('should enroll the student in the course', async () => {
      // Mock Course.findById to return a course
      const course = { _id: 'courseId' };
      sinon.stub(Course, 'findById').resolves(course);

      // Mock Student.findById to return a student
      const student = { _id: 'studentId', coursesEnrolled: [], save: sinon.stub().resolves() };
      sinon.stub(Student, 'findById').resolves(student);

      // Mock request object
      const req = { body: { courseId: 'courseId', studentId: 'studentId' } };

      // Mock response object
      const res = { json: sinon.stub() };

      // Call the function
      await studentController.enrollCourse(req, res);

      // Assertions
      expect(student.coursesEnrolled).to.deep.include('courseId');
      sinon.assert.calledOnce(student.save);

      // Restore the stubs
      Course.findById.restore();
      Student.findById.restore();
    });
  });
});
