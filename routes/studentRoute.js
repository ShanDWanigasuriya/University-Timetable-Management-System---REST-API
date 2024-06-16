// studentRoute.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import studentAuthMiddleware from '../middleware/studentAuthMiddleware.js';
import studentController from '../controllers/studentController.js';

const router = express.Router();

// View timetable
router.get('/timetable', authMiddleware, studentAuthMiddleware, studentController.viewTimetable);

// Enroll in a course
router.post('/enroll', authMiddleware, studentAuthMiddleware, studentController.enrollCourse);

// View student details
router.get('/profile', authMiddleware, studentAuthMiddleware, studentController.viewProfile);

export default router;
