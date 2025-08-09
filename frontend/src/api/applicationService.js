import axios from 'axios';

const API_URL = 'http://localhost:3000/api/applications/';

// Helper function to get the user token from local storage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

// Apply for an internship
const applyForInternship = async (internshipId, applicationData) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + internshipId, applicationData, config);
  return response.data;
};

// Get all applications submitted by the authenticated student
const getStudentApplications = async () => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'student/my-applications', config);
  return response.data;
};

// Get all applications for a specific company's internships
const getCompanyApplications = async () => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'company/my-applications', config);
  return response.data;
};

// Get all applications for a specific college's students
const getCollegeApplications = async () => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'college/my-applications', config);
  return response.data;
};

// Get applicants for a single internship (newly added function)
const getInternshipApplicants = async (internshipId) => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + `internship/${internshipId}`, config);
  return response.data;
};

// Update application status (for companies)
const updateApplicationStatus = async (applicationId, status) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + `${applicationId}/status`, { status }, config);
  return response.data;
};

const applicationService = {
  applyForInternship,
  getStudentApplications,
  getCompanyApplications,
  getCollegeApplications,
  getInternshipApplicants, // Ensure this function is exported
  updateApplicationStatus,
};

export default applicationService;
