// loginRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Admin from '../models/admin.js';
import Faculty from '../models/faculty.js';
import Student from '../models/student.js';

const router = express.Router();

// Admin Signup
router.post('/admin/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin record
        const newAdmin = new Admin({
            username,
            password: hashedPassword
        });

        // Save the admin record to the database
        await newAdmin.save();

        res.json({ message: 'Admin signed up successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Attach the admin user object to the request
        req.user = admin;
        const token = jwt.sign({ user: { id: admin._id, role: 'admin' } }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Faculty Login
router.post('/faculty/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const faculty = await Faculty.findOne({ username });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, faculty.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ user: { id: faculty._id, role: 'faculty' } }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Student Login
router.post('/student/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const student = await Student.findOne({ username });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ user: { id: student._id, role: 'student' } }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
