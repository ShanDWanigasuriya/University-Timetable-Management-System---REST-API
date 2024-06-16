import mongoose from 'mongoose';

const roomBookingSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  roomName: String,
  date: Date,
  startTime: Date,
  endTime: Date,
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }
});

export default mongoose.model('roomBooking', roomBookingSchema);