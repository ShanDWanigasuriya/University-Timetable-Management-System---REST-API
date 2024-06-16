import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminAuthMiddleware from '../middleware/adminAuthMiddleware.js';
import adminController from '../controllers/adminController.js';

const router = express.Router();

// Add new faculty
router.post('/faculty', authMiddleware, adminAuthMiddleware, adminController.addFaculty);

// Manage courses
router.post('/courses', authMiddleware, adminAuthMiddleware, adminController.addCourse);
router.put('/courses/:courseId', authMiddleware, adminAuthMiddleware, adminController.updateCourse);
router.delete('/courses/:courseId', authMiddleware, adminAuthMiddleware, adminController.deleteCourse);

// Assign faculty to course
router.post('/assign-faculty', authMiddleware, adminAuthMiddleware, adminController.assignFacultyToCourse);

// Add new student
router.post('/student', authMiddleware, adminAuthMiddleware, adminController.addStudent);

// Add new room
router.post('/room', authMiddleware, adminAuthMiddleware, adminController.addRoom);

// Update room
router.put('/room/:roomId', authMiddleware, adminAuthMiddleware, adminController.updateRoom);

// Delete room
router.delete('/room/:roomId', authMiddleware, adminAuthMiddleware, adminController.deleteRoom);

// Add new resource
router.post('/resource', authMiddleware, adminAuthMiddleware, adminController.addResource);

// Update resource
router.put('/resource/:resourceId', authMiddleware, adminAuthMiddleware, adminController.updateResource);

// Delete resource
router.delete('/resource/:resourceId', authMiddleware, adminAuthMiddleware, adminController.deleteResource);

// View all faculties
router.get('/faculties', authMiddleware, adminAuthMiddleware, adminController.viewFaculties);

// View all students
router.get('/students', authMiddleware, adminAuthMiddleware, adminController.viewStudents);

// Route for sending announcement notifications
router.post('/send-announcement-notification', authMiddleware, adminAuthMiddleware, adminController.sendAnnouncementNotification);

export default router;
