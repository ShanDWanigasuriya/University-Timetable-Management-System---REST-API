import mongoose from 'mongoose';

const classSessionSchema = new mongoose.Schema({
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  location: {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    roomName: String  // Add roomName field
  }
});

const timetableSchema = new mongoose.Schema({
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  specialization: { type: String, required: true },
  batch: { type: String, required: true },
  classSessions: [classSessionSchema]
});

export default mongoose.model('Timetable', timetableSchema);