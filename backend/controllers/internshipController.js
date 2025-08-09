import Internship from '../models/Internship.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new internship
// @route   POST /api/internships
// @access  Private (Company only)
const createInternship = asyncHandler(async (req, res) => {
  if (req.user.role !== 'company') {
    res.status(403);
    throw new Error('Only company users can post internships.');
  }

  const {
    companyName,
    title,
    description,
    location,
    workType,
    stipend,
    duration,
    internshipDomain,
    applicationDeadline,
    skillsRequired,
    responsibilities,
    whoCanApply,
    perks,
    positions,
  } = req.body;

  if (!companyName || !title || !description || !location || !workType || !duration || !internshipDomain || !applicationDeadline || !positions) {
    res.status(400);
    throw new Error('Please fill all required internship fields: Company Name, Title, Description, Location, Work Type, Duration, Domain, Deadline, Positions.');
  }

  const internship = await Internship.create({
    company: req.user._id,
    companyName,
    title,
    description,
    location,
    workType,
    stipend,
    duration,
    internshipDomain,
    applicationDeadline,
    skillsRequired,
    responsibilities,
    whoCanApply,
    perks,
    positions,
  });

  res.status(201).json(internship);
});

// @desc    Get all internships (with search and filter capabilities)
// @route   GET /api/internships?keyword=...
// @access  Public
const getInternships = asyncHandler(async (req, res) => {

  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { location: { $regex: req.query.keyword, $options: 'i' } },
          { internshipDomain: { $regex: req.query.keyword, $options: 'i' } },
          { companyName: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const filter = {};

  if (req.query.stipend) {
    const stipendValue = req.query.stipend;
    const numericStipendMatch = stipendValue.match(/\d[\d,]*/);
    if (numericStipendMatch) {
      const numericValue = parseInt(numericStipendMatch[0].replace(/,/g, ''), 10);
      if (!isNaN(numericValue)) {
        filter.stipend = { $gte: numericValue };
        console.log(`Backend: Stipend filter set to numeric $gte: ${numericValue}`);
      } else {
        filter.stipend = { $regex: stipendValue, $options: 'i' };
        console.log(`Backend: Stipend filter set to regex: ${stipendValue}`);
      }
    } else {
        filter.stipend = { $regex: stipendValue, $options: 'i' };
        console.log(`Backend: Stipend filter set to regex (no numeric part): ${stipendValue}`);
    }
  }

  if (req.query.duration) {
    filter.duration = { $regex: req.query.duration, $options: 'i' };
  }

  if (req.query.skills) {
    filter.skillsRequired = { $in: req.query.skills.split(',').map(s => new RegExp(s.trim(), 'i')) };
  }

  if (req.query.workType) {
    filter.workType = { $regex: req.query.workType, $options: 'i' };
  }

  if (req.query.domain) {
    filter.internshipDomain = { $regex: req.query.domain, $options: 'i' };
  }

  const query = { ...keyword, ...filter };
  console.log('Backend: Final MongoDB query object:', JSON.stringify(query, null, 2));

  const count = await Internship.countDocuments(query);
  console.log('Backend: Count of matching internships:', count);

  // --- FETCH AND POPULATE LOGO (THE FIX) ---
  const internshipsFromDB = await Internship.find(query)
    // 1. Populate the 'company' field and select only the 'companyLogo' from the User model
    .populate('company', 'companyLogo')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .lean(); // Use .lean() for better performance and to allow modification

  // 2. Map the results to add the companyLogo to the top level of each internship object
  const internships = internshipsFromDB.map(internship => ({
    ...internship,
    companyLogo: internship.company?.companyLogo || '', // Add the logo URL, with a fallback
  }));

  res.json({ internships, page, pages: Math.ceil(count / pageSize) });
});


// @desc    Get a single internship by ID
// @route   GET /api/internships/:id
// @access  Public
const getInternshipById = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id)
    // Also populate the logo here for the details page
    .populate('company', 'name email companyName companyDescription companyLogo');

  if (internship) {
    // Convert to a plain object to add the logo property for consistency
    const populatedInternship = internship.toObject();
    populatedInternship.companyLogo = internship.company?.companyLogo || '';
    res.status(200).json(populatedInternship);
  } else {
    res.status(404);
    throw new Error('Internship not found');
  }
});

// @desc    Update an internship (Company only)
// @route   PUT /api/internships/:id
// @access  Private (Company only)
const updateInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);

  if (!internship) {
    res.status(404);
    throw new Error('Internship not found');
  }

  if (internship.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('User not authorized to update this internship');
  }

  if (req.user.role !== 'company') {
    res.status(403);
    throw new Error('Only company users can update internships.');
  }

  const updatedBody = { ...req.body };
  if (updatedBody.skillsRequired && typeof updatedBody.skillsRequired === 'string') {
    updatedBody.skillsRequired = updatedBody.skillsRequired.split(',').map(s => s.trim()).filter(s => s !== '');
  }
  if (updatedBody.responsibilities && typeof updatedBody.responsibilities === 'string') {
    updatedBody.responsibilities = updatedBody.responsibilities.split(',').map(s => s.trim()).filter(s => s !== '');
  }
  if (updatedBody.whoCanApply && typeof updatedBody.whoCanApply === 'string') {
    updatedBody.whoCanApply = updatedBody.whoCanApply.split(',').map(s => s.trim()).filter(s => s !== '');
  }
  if (updatedBody.perks && typeof updatedBody.perks === 'string') {
    updatedBody.perks = updatedBody.perks.split(',').map(s => s.trim()).filter(s => s !== '');
  }

  if (updatedBody.workType && typeof updatedBody.workType === 'string') {
    updatedBody.workType = updatedBody.workType.trim();
  }
  if (updatedBody.internshipDomain && typeof updatedBody.internshipDomain === 'string') {
    updatedBody.internshipDomain = updatedBody.internshipDomain.trim();
  }
  if (updatedBody.companyName && typeof updatedBody.companyName === 'string') {
    updatedBody.companyName = updatedBody.companyName.trim();
  }


  const updatedInternship = await Internship.findByIdAndUpdate(
    req.params.id,
    updatedBody,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedInternship);
});

// @desc    Delete an internship (Company only)
// @route   DELETE /api/internships/:id
// @access  Private (Company only)
const deleteInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);

  if (!internship) {
    res.status(404);
    throw new Error('Internship not found');
  }

  if (internship.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('User not authorized to delete this internship');
  }

  if (req.user.role !== 'company') {
    res.status(403);
    throw new Error('Only company users can delete internships.');
  }

  await Internship.deleteOne({ _id: req.params.id });

  res.status(200).json({ message: 'Internship removed' });
});

// @desc    Get internships posted by the authenticated company
// @route   GET /api/internships/my-internships
// @access  Private (Company only)
const getMyInternships = asyncHandler(async (req, res) => {
  if (req.user.role !== 'company') {
    res.status(403);
    throw new Error('Only company users can view their posted internships.');
  }
  const internships = await Internship.find({ company: req.user._id });
  res.status(200).json(internships);
});


export {
  createInternship,
  getInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  getMyInternships,
};
