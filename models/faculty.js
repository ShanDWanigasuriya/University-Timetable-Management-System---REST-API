import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  notification: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  coursesAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  timetables: [{ type: mongoose.Schema.Types.Mixed }] // Store the entire timetable object
});

export default mongoose.model('Faculty', facultySchema);
