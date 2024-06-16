import mongoose from 'mongoose';

const resourceBookingSchema = new mongoose.Schema({
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
  date: Date,
  startTime: Date,
  endTime: Date,
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }
});

export default mongoose.model('resourceBooking', resourceBookingSchema);