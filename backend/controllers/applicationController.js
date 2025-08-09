import Application from '../models/Application.js';
import Internship from '../models/Internship.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

const applyForInternship = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Only student users can apply for internships.');
  }

  const { internshipId } = req.params;
  const { coverLetter, resumeUrl } = req.body;

  if (!coverLetter) {
    res.status(400);
    throw new Error('Please provide a cover letter for your application.');
  }

  const internship = await Internship.findById(internshipId);

  if (!internship) {
    res.status(404);
    throw new Error('Internship not found.');
  }

  const existingApplication = await Application.findOne({
    internship: internshipId,
    applicant: req.user._id,
  });

  if (existingApplication) {
    res.status(400);
    throw new Error('You have already applied for this internship.');
  }

  // Get the college user ID based on the student's collegeName
  const collegeUser = await User.findOne({
    role: 'college',
    collegeName: req.user.collegeName,
  });

  if (!collegeUser) {
    res.status(404);
    throw new Error('College not found for this student. Please update your profile with a valid college name.');
  }

  const application = await Application.create({
    internship: internshipId,
    applicant: req.user._id,
    company: internship.company,
    college: collegeUser._id, // NEW: Save the college's user ID to the application
    coverLetter,
    resumeUrl: resumeUrl || req.user.resume,
    status: 'Pending',
  });

  internship.applicants.push(req.user._id);
  await internship.save();

  res.status(201).json({ message: 'Application submitted successfully!', application });
});

const getCompanyApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'company') {
    res.status(403);
    throw new Error('Only company users can view applications for their internships.');
  }

  const applications = await Application.find({ company: req.user._id })
    .populate('internship', 'title companyName location')
    .populate('applicant', 'name email studentId major');

  res.status(200).json(applications);
});

const getStudentApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Only student users can view their submitted applications.');
  }

  const applications = await Application.find({ applicant: req.user._id })
    .populate('internship', 'title companyName location applicationDeadline')
    .populate('company', 'name email companyName');

  res.status(200).json(applications);
});

const getCollegeApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'college') {
    res.status(403);
    throw new Error('Only college users can view applications for their students.');
  }
  
  // The query now directly uses the college ID stored on the application
  const applications = await Application.find({ college: req.user._id })
    .populate('internship', 'title companyName location')
    .populate('applicant', 'name email studentId major');

  res.status(200).json(applications);
});

const getInternshipApplicants = asyncHandler(async (req, res) => {
  const { internshipId } = req.params;

  const internship = await Internship.findById(internshipId);

  if (!internship) {
    res.status(404);
    throw new Error('Internship not found.');
  }

  if (internship.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view applicants for this internship.');
  }

  const applications = await Application.find({ internship: internshipId })
    .populate('applicant', 'name email studentId major');

  res.status(200).json(applications);
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== 'company') {
    res.status(403);
    throw new Error('Only company users can update application status.');
  }

  const { id } = req.params;
  const { status } = req.body;

  const application = await Application.findById(id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found.');
  }

  if (application.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this application.');
  }

  const validStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected', 'Withdrawn'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid application status provided.');
  }

  application.status = status;
  await application.save();

  res.status(200).json({ message: 'Application status updated successfully!', application });
});

export {
  applyForInternship,
  getCompanyApplications,
  getStudentApplications,
  getCollegeApplications,
  getInternshipApplicants,
  updateApplicationStatus,
};
