// facultyRoute.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import facultyAuthMiddleware from '../middleware/facultyAuthMiddleware.js';
import facultyController from '../controllers/facultyController.js';

const router = express.Router();

// View timetable
router.get('/timetable', authMiddleware, facultyAuthMiddleware, facultyController.viewTimetable);

// Manage timetables
router.post('/timetables', authMiddleware, facultyAuthMiddleware, facultyController.createTimetable);
router.put('/timetables/:timetableId', authMiddleware, facultyAuthMiddleware, facultyController.updateTimetable);
router.delete('/timetables/:timetableId', authMiddleware, facultyAuthMiddleware, facultyController.deleteTimetable);

// Manage room and resource booking
router.post('/book-room', authMiddleware, facultyAuthMiddleware, facultyController.bookRoom);
router.post('/book-resource', authMiddleware, facultyAuthMiddleware, facultyController.bookResource);

// View and manage student enrollments
router.get('/enrollments', authMiddleware, facultyAuthMiddleware, facultyController.viewStudentEnrollments);
router.post('/update-enrollment', authMiddleware, facultyAuthMiddleware, facultyController.updateStudentEnrollment);

export default router;
