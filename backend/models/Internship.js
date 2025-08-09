import mongoose from 'mongoose';

const internshipSchema = mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User (Company) who posted it
      required: true,
      ref: 'User', // Refers to the 'User' model
    },
    companyName: { // NEW FIELD: Company name as entered/displayed on the internship
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    workType: {
      type: String,
      enum: ['Remote', 'Hybrid', 'In-office'],
      required: true,
    },
    stipend: {
      type: String,
      default: 'Unpaid',
    },
    duration: {
      type: String,
      required: true,
    },
    internshipDomain: {
      type: String,
      required: true,
      trim: true,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    skillsRequired: [
      {
        type: String,
      },
    ],
    responsibilities: [
      {
        type: String,
      },
    ],
    whoCanApply: [
      {
        type: String,
      },
    ],
    perks: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'closed', 'filled', 'draft'],
      default: 'active',
    },
    positions: {
      type: Number,
      required: true,
      default: 1,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Internship = mongoose.model('Internship', internshipSchema);

export default Internship;
