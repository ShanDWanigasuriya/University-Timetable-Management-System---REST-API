import bcrypt from 'bcrypt';
import Admin from '../models/admin.js';
import Faculty from '../models/faculty.js';
import Course from '../models/course.js';
import Student from '../models/student.js';
import Room from '../models/room.js';
import Resource from '../models/resource.js';
import Notification from '../models/notification.js';
import notificationController from '../controllers/notificationController.js';

const adminController = {
    addFaculty: async (req, res) => {
        try {
            const { username, password } = req.body;
            // Check if the username already exists
            const existingFaculty = await Faculty.findOne({ username });
            if (existingFaculty) {
                return res.status(409).json({ message: 'Username already exists' });
            }
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Create a new faculty record with the hashed password
            const faculty = new Faculty({ 
                username, 
                password: hashedPassword, 
                coursesAssigned: [], 
                timetables: [],
                notification: [] // Initialize notification as an empty array
            });
            await faculty.save();
            res.json({ message: 'Faculty added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    addCourse: async (req, res) => {
        try {
            // Assuming request body contains course details
            const { name, code, description, credits } = req.body;
            
            // Check if the course already exists
            const existingCourse = await Course.findOne({ code });
    
            if (existingCourse) {
                // If course with the same code exists, return error
                return res.status(400).json({ message: 'Course already exists' });
            }
    
            // If course doesn't exist, save it
            const course = new Course({
                name,
                code,
                description,
                credits,
                faculty: req.user._id // Assuming the logged-in user is the faculty
            });
            await course.save();
            res.json({ message: 'Course added successfully', course });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    
      updateCourse: async (req, res) => {
        try {
          const courseId = req.params.courseId;
          // Assuming request body contains updated course details
          const { name, code, description, credits } = req.body;
          const course = await Course.findByIdAndUpdate(courseId, { name, code, description, credits }, { new: true });
          if (!course) {
            return res.status(404).json({ message: 'Course not found' });
          }
          res.json({ message: 'Course updated successfully', course });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      },
    
      deleteCourse: async (req, res) => {
        try {
          const courseId = req.params.courseId;
          const course = await Course.findByIdAndDelete(courseId);
          if (!course) {
            return res.status(404).json({ message: 'Course not found' });
          }
          res.json({ message: 'Course deleted successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      },

    assignFacultyToCourse: async (req, res) => {
        try {
            const { facultyId, courseId } = req.body;
    
            // Find the faculty
            const faculty = await Faculty.findById(facultyId);
            if (!faculty) {
                return res.status(404).json({ message: 'Faculty not found' });
            }
    
            // Find the course
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Check if the course is already asign to the faculty
            if (faculty.coursesAssigned.includes(courseId)) {
                return res.status(409).json({ message: 'Course already asigned to the faculty' });
            }
    
            // Assign the faculty to the course
            course.faculty = facultyId;
            await course.save();
    
            // Update the faculty's coursesAssigned field
            faculty.coursesAssigned.push(courseId);
            await faculty.save();
    
            res.json({ message: 'Faculty assigned to course successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    addStudent: async (req, res) => {
        try {
            const { username, password, fullName, nic, address, contactNo, email, faculty, batch, specialization } = req.body;
            // Check if the username already exists
            const existingStudent = await Student.findOne({ username });
            if (existingStudent) {
                return res.status(409).json({ message: 'Username already exists' });
            }
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Create a new student record with the hashed password
            const student = new Student({ username, password: hashedPassword, fullName, nic, address, contactNo, email, faculty, batch, specialization });
            await student.save();
            res.json({ message: 'Student added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    
    addRoom: async (req, res) => {
        try {
            const { name, capacity, location, resources } = req.body;
            
            // Check if the room already exists
            const existingRoom = await Room.findOne({ name });
    
            if (existingRoom) {
                // If room with the same name exists, return error
                return res.status(400).json({ message: 'Room already exists' });
            }
    
            // If room doesn't exist, save it
            const room = new Room({ name, capacity, location, resources });
            await room.save();
            res.json({ message: 'Room added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // Update room
    updateRoom: async (req, res) => {
        try {
            const { roomId } = req.params;
            const { name, capacity, location, resources } = req.body;
            const room = await Room.findByIdAndUpdate(roomId, { name, capacity, location, resources }, { new: true });
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            // Send room update notification to faculties
            const roomMessage = 'Room details have been updated';
            await notificationController.sendRoomResourceNotification(roomMessage);

            res.json({ message: 'Room updated successfully', room });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // Delete room
    deleteRoom: async (req, res) => {
        try {
            const { roomId } = req.params;
            const room = await Room.findByIdAndDelete(roomId);
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            // Send room deletion notification to faculties
            const roomDeleteMessage = 'Room has been deleted';
            await notificationController.sendRoomResourceNotification(roomDeleteMessage);

            res.json({ message: 'Room deleted successfully', room });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    addResource: async (req, res) => {
        try {
            const { name, description } = req.body;
            
            // Check if the resource already exists
            const existingResource = await Resource.findOne({ name });
    
            if (existingResource) {
                // If resource with the same name exists, return error
                return res.status(400).json({ message: 'Resource already exists' });
            }
    
            // If resource doesn't exist, save it
            const resource = new Resource({ name, description });
            await resource.save();
            res.json({ message: 'Resource added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // Update resource
    updateResource: async (req, res) => {
        try {
            const { resourceId } = req.params;
            const { name, description } = req.body;
            const resource = await Resource.findByIdAndUpdate(resourceId, { name, description }, { new: true });
            if (!resource) {
                return res.status(404).json({ message: 'Resource not found' });
            }

            // Send resource update notification to faculties
            const resourceMessage = 'Resource details have been updated';
            await notificationController.sendRoomResourceNotification(resourceMessage);

            res.json({ message: 'Resource updated successfully', resource });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
          }
      },
  
      // Delete resource
      deleteResource: async (req, res) => {
          try {
              const { resourceId } = req.params;
              const resource = await Resource.findByIdAndDelete(resourceId);
              if (!resource) {
                  return res.status(404).json({ message: 'Resource not found' });
              }
  
              // Send resource deletion notification to faculties
              const resourceDeleteMessage = 'Resource has been deleted';
              await notificationController.sendRoomResourceNotification(resourceDeleteMessage);
  
              res.json({ message: 'Resource deleted successfully', resource });
          } catch (error) {
              console.error(error);
              res.status(500).json({ message: 'Internal Server Error' });
          }
      },
  
      viewFaculties: async (req, res) => {
          try {
              const faculties = await Faculty.find({});
              res.json({ faculties });
          } catch (error) {
              console.error(error);
              res.status(500).json({ message: 'Internal Server Error' });
          }
      },
  
      viewStudents: async (req, res) => {
          try {
              const students = await Student.find({});
              res.json({ students });
          } catch (error) {
              console.error(error);
              res.status(500).json({ message: 'Internal Server Error' });
          }
      },

    // Send announcement notification to all users
    sendAnnouncementNotification: async (req, res) => {
        try {
            const { message } = req.body;

            // Find all faculties and students
            const faculties = await Faculty.find({});
            const students = await Student.find({});

            // Send announcement notifications to faculties
            await Promise.all(faculties.map(async faculty => {
                const notification = new Notification({
                    message,
                    recipient: faculty._id
                });
                await notification.save();
            }));

            // Send announcement notifications to students
            await Promise.all(students.map(async student => {
                const notification = new Notification({
                    message,
                    recipient: student._id
                });
                await notification.save();
            }));

            res.json({ message: 'Announcement notifications sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
  };
  
  export default adminController;
  
