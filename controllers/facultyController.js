import Room from '../models/room.js';
import Resource from '../models/resource.js';
import RoomBooking from '../models/roomBooking.js';
import ResourceBooking from '../models/resourceBooking.js';
import Timetable from '../models/timetable.js';
import Faculty from '../models/faculty.js';
import Course from '../models/course.js';
import Student from '../models/student.js';
import notificationController from '../controllers/notificationController.js';

const facultyController = {
  viewTimetable: async (req, res) => {
    try {
        console.log("Current Faculty ID:", req.user.user.id); // Check the faculty ID

        const timetables = await Timetable.find({ faculty: req.user.user.id }).populate('classSessions.course');
        console.log("Timetables:", timetables); // Log the fetched timetables

        res.json({ timetables });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
},

  bookRoom: async (req, res) => {
    try {
      const { room, roomName, date, startTime, endTime, faculty } = req.body;
      const rooms = await Room.findById(room);
      if (!rooms) {
        return res.status(404).json({ message: 'Room not found' });
      }
      
      // Check if the room is already booked for the given date and time
      const existingBooking = await RoomBooking.findOne({
        room: room,
        date,
        $or: [
          { // Check if the new booking's start time is between the existing booking's start and end time
            startTime: { $gte: startTime, $lt: endTime }
          },
          { // Check if the new booking's end time is between the existing booking's start and end time
            endTime: { $gt: startTime, $lte: endTime }
          },
          { // Check if the existing booking is completely within the new booking's start and end time
            startTime: { $lte: startTime },
            endTime: { $gte: endTime }
          }
        ]
      });
      if (existingBooking) {
        return res.status(409).json({ message: 'Room already booked for the specified time' });
      }
      
      // Create a booking record in the database
      const booking = new RoomBooking({
        room: room,
        roomName, // Add roomName field
        date,
        startTime,
        endTime,
        faculty: faculty
      });
      await booking.save();
      res.json({ message: 'Room booked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  bookResource: async (req, res) => {
    try {
      const { resource, date, startTime, endTime, faculty } = req.body;
      const resources = await Resource.findById(resource);
      if (!resources) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      
      // Check if the resource is already booked for the given date and time
      const existingBooking = await ResourceBooking.findOne({
        resource: resource,
        date,
        $or: [
          { // Check if the new booking's start time is between the existing booking's start and end time
            startTime: { $gte: startTime, $lt: endTime }
          },
          { // Check if the new booking's end time is between the existing booking's start and end time
            endTime: { $gt: startTime, $lte: endTime }
          },
          { // Check if the existing booking is completely within the new booking's start and end time
            startTime: { $lte: startTime },
            endTime: { $gte: endTime }
          }
        ]
      });
      if (existingBooking) {
        return res.status(409).json({ message: 'Resource already booked for the specified time' });
      }
      
      // Create a booking record in the database
      const booking = new ResourceBooking({
        resource: resource,
        date,
        startTime,
        endTime,
        faculty: faculty 
      });
      await booking.save();
      res.json({ message: 'Resource booked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  viewStudentEnrollments: async (req, res) => {
    try {
        // Fetch enrollments for the current faculty (req.user._id)
        const enrollments = await Student.find({ faculty: req.user.user.id }).populate('coursesEnrolled');

        // Return the filtered enrollments
        res.json({ enrollments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
},

updateStudentEnrollment: async (req, res) => {
  try {
      const { studentId, coursesToRemove } = req.body; // Assuming you receive the student ID and courses to remove in the request body

      // Find the student by ID
      const student = await Student.findById(studentId);

      // If the student is not found, return a 404 error
      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }

      console.log('Courses to remove:', coursesToRemove);
      console.log('Student courses enrolled before:', student.coursesEnrolled);

      // Filter out courses to remove from the student's enrollment
      student.coursesEnrolled = student.coursesEnrolled.filter(courseId => !coursesToRemove.includes(courseId.toString()));

      console.log('Student courses enrolled after:', student.coursesEnrolled);

      // Save the updated student object
      await student.save();

      // Fetch the updated student data with populated coursesEnrolled
      const updatedStudent = await Student.findById(studentId).populate('coursesEnrolled');

      // Return success message along with updated student data
      res.json({ message: 'Student enrollment updated successfully', student: updatedStudent });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
},

  createTimetable: async (req, res) => {
    try {
      const { classSessions } = req.body;
      const { faculty, specialization, batch } = req.body;
  
      // Array to store information about booked slots
      const bookedSlots = [];
  
      // Check if any class session contains a room number
      for (const session of classSessions) {
        if (session.location) {
          const { room, roomName } = session.location; // Access room and roomName from session.location
          const { date, startTime, endTime } = session; // Access date, startTime, and endTime directly from session
          const existingBooking = await RoomBooking.findOne({
            room,
            roomName,
            date,
            $or: [
              { startTime: { $gte: startTime, $lt: endTime } },
              { endTime: { $gt: startTime, $lte: endTime } },
              { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
            ]
          }).populate('room'); // Populate the 'room' field to get room details
          if (existingBooking) {
            // If room is already booked, push the booked slot information
            bookedSlots.push({
              roomName: existingBooking.roomName, // Assuming roomName is the property containing the room name
              startTime: existingBooking.startTime,
              endTime: existingBooking.endTime
            });
          }
        }
      }
  
      // If any slots are already booked, return a 409 status with the booked slots information
      if (bookedSlots.length > 0) {
        return res.status(409).json({ message: 'Room already booked for the specified time', bookedSlots });
      }
  
      // If all rooms are available, book them for the specified time slots
      for (const session of classSessions) {
        if (session.location) {
          const { room, roomName } = session.location;
          const { date, startTime, endTime } = session;
          const booking = new RoomBooking({
            room,
            roomName,
            date,
            startTime,
            endTime,
            faculty: faculty // Make sure to pass the faculty ID here
          });
          await booking.save();
        }
      }
  
      // Create the timetable
      const timetable = new Timetable({
        faculty,
        specialization,
        batch,
        classSessions
      });
  
      await timetable.save();

    const faculties = await Faculty.findById(faculty);
    faculties.timetables.push(timetable);

    // Save the faculty document with the updated timetables field
    await faculties.save();

      res.json({ message: 'Timetable created successfully', timetable });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  
  // Update timetable
updateTimetable: async (req, res) => {
  try {
    const { timetableId } = req.params;
    const { classSessions } = req.body;
    const updatedTimetable = await Timetable.findByIdAndUpdate(timetableId, { classSessions }, { new: true });
    if (!updatedTimetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // Get the batch information from the updated timetable
    const { batch } = updatedTimetable;

    // Send timetable notification to students of the specific batch
    const timetableMessage = 'Timetable has been updated';
    await notificationController.sendTimetableNotification(timetableMessage, batch);

    res.json({ message: 'Timetable updated successfully', timetable: updatedTimetable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

// Delete timetable
deleteTimetable: async (req, res) => {
  try {
    const { timetableId } = req.params;
    const timetable = await Timetable.findByIdAndDelete(timetableId);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // Get the batch information from the deleted timetable
    const { batch } = timetable;

    // Delete room bookings related to the deleted timetable (identified by faculty)
    const { faculty } = timetable;
    await RoomBooking.deleteMany({ faculty });

    // Send timetable deletion notification to students of the specific batch
    const timetableDeleteMessage = 'Timetable has been deleted';
    await notificationController.sendTimetableNotification(timetableDeleteMessage, batch);

    res.json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

};

export default facultyController;

