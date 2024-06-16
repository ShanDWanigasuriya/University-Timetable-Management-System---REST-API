// resource.js
import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  name: String,
  description: String,
});

export default mongoose.model('Resource', resourceSchema);