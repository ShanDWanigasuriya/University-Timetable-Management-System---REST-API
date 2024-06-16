import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: String,
  capacity: Number, // Maximum capacity of the room
  location: String, // Location or building where the room is situated
  resources: [String] // Array of resource names available in the room
});

export default mongoose.model('Room', roomSchema);