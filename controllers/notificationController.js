import Notification from '../models/notification.js';
import Faculty from '../models/faculty.js';
import Student from '../models/student.js';

const notificationController = {
  sendRoomResourceNotification: async (message) => {
    try {
      // Find all faculties
      const faculties = await Faculty.find();

      // Send notifications to faculties and update the notification field
      const notifications = await Promise.all(faculties.map(async faculty => {
          const notification = new Notification({
              message,
              recipient: faculty._id
          });
          await notification.save();

          //Update the notification field of the faculty
          faculty.notification.push(notification._id);
          await faculty.save();

          return notification;
      }));

      return notifications;
  } catch (error) {
      console.error(error);
      throw new Error('Failed to send room/resource notifications');
  }
  },
  
  sendTimetableNotification: async (message, batch) => {
    try {
      // Find students belonging to the specified batch
      const students = await Student.find({ batch });

      // Send notifications to students and update the notification field
      const notifications = await Promise.all(students.map(async student => {
          const notification = new Notification({
              message,
              recipient: student._id
          });
          await notification.save();

          //Update the notification field of the student
          student.notification.push(notification._id);
          await student.save();

          return notification;
      }));

      return notifications;
  } catch (error) {
      console.error(error);
      throw new Error('Failed to send timetable notifications');
  }
  }
};

export default notificationController;
