import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: String,
  code: String,
  description: String,
  credits: Number,
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }
});

export default mongoose.model('Course', courseSchema);