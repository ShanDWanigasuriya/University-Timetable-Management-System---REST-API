import Course from '../models/course.js';
import Student from '../models/student.js';
import Timetable from '../models/timetable.js';

const studentController = {
  viewTimetable: async (req, res) => {
    try {
      const student = await Student.findById(req.user.user.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Fetch timetable for the student's batch and specialization
      const timetable = await Timetable.find({ batch: student.batch, specialization: student.specialization });
  
      res.json({ timetable });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  
  enrollCourse: async (req, res) => {
    try {
      const { courseId } = req.body;
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      const { studentId } = req.body;
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      // Check if the student is already enrolled in the course
      if (student.coursesEnrolled.includes(courseId)) {
        return res.status(409).json({ message: 'Student already enrolled in the course' });
      }
      // Enroll the student in the course
      student.coursesEnrolled.push(courseId);
      await student.save();
      res.json({ message: 'Course enrolled successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  viewProfile: async (req, res) => {
    try {
      const student = await Student.findById(req.user.user.id).populate('coursesEnrolled', 'courseName');
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json({ student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

export default studentController;
