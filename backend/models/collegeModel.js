import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
  },
  website: {
    type: String,
    trim: true,
  },
  domains: {
    type: [String], // e.g., ["Engineering", "Business", "Arts"]
    required: true,
  },
  placementContact: {
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  // You can add more fields later, like accreditation, student count, etc.
}, {
  timestamps: true,
});

const College = mongoose.model('College', collegeSchema);

export default College;