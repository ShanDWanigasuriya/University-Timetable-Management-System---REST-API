import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 50 },
  password: { type: String, required: true },
  fullName: { type: String, required: true, maxlength: 100 },
  nic: { type: String, required: true, unique: true }, // Assuming NIC is a unique identifier
  address: { type: String, maxlength: 200 },
  contactNo: { type: String, validate: /^[0-9]{10}$/ }, // Assuming 10-digit phone number
  email: { type: String, required: true, unique: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  batch: { type: String },
  specialization: { type: String},
  coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  notification: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }]
});

export default mongoose.model('Student', studentSchema);