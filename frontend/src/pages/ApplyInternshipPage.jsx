import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import internshipService from '../api/internshipService';
import applicationService from '../api/applicationService';
import { useAuth } from '../contexts/AuthContext';

const ApplyInternshipPage = () => {
  const { id: internshipId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState(user?.resume || '');
  const [applicationSuccess, setApplicationSuccess] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchInternshipDetails = async () => {
      try {
        const data = await internshipService.getInternshipById(internshipId);
        setInternship(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load internship details.');
        setLoading(false);
      }
    };

    if (internshipId) {
      fetchInternshipDetails();
    }
  }, [internshipId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setApplicationSuccess('');

    if (!coverLetter) {
      setError('Cover letter is required.');
      return;
    }

    try {
      // Pass all required internship details to the application service call
      const applicationData = {
        coverLetter,
        resumeUrl,
        internshipDomain: internship.internshipDomain,
        workType: internship.workType,
        companyName: internship.companyName,
      };

      await applicationService.applyForInternship(internshipId, applicationData);
      setApplicationSuccess('Your application has been submitted successfully!');
      setCoverLetter('');
      navigate('/my-applications');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit application.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 font-poppins text-gray-700 text-xl">
        Loading Internship Details...
      </div>
    );
  }

  if (error && !internship) {
    return (
      <div className="flex items-center justify-center p-6 font-poppins text-red-600 text-xl">
        Error: {error}
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="flex items-center justify-center p-6 font-poppins text-gray-600 text-xl">
        Internship not found.
      </div>
    );
  }

  return (
    <div className="p-6 font-poppins animate-fade-in">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-[1.005]">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Apply for Internship</h2>

        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-teal-700 mb-2">{internship.title}</h3>
          <p className="text-gray-800 font-semibold mb-1">{internship.companyName}</p>
          <p className="text-gray-600 text-sm mb-2">{internship.internshipDomain}</p>
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-semibold">Location:</span> {internship.location} ({internship.workType})
          </p>
          <p className="text-gray-700 text-sm mb-1">
            <span className="font-semibold">Stipend:</span> {internship.stipend}
          </p>
          <p className="text-gray-700 text-sm mb-4">
            <span className="font-semibold">Duration:</span> {internship.duration}
          </p>
          <p className="text-gray-700 text-base mb-4">{internship.description}</p>
          <div className="mb-4">
            <span className="font-semibold text-gray-700 text-sm">Skills Required:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {internship.skillsRequired.map((skill, index) => (
                <span key={index} className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Application Deadline: {new Date(internship.applicationDeadline).toLocaleDateString()}
          </p>
        </div>

        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Your Application</h3>
        {error && <p className="text-red-600 text-center mb-6 font-inter font-medium bg-red-100 p-3 rounded-lg border border-red-200">{error}</p>}
        {applicationSuccess && <p className="text-green-600 text-center mb-6 font-inter font-medium bg-green-100 p-3 rounded-lg border border-green-200">{applicationSuccess}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="coverLetter">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows="8"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a compelling cover letter highlighting your interest and qualifications..."
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="resumeUrl">
              Resume URL (Optional, will use profile resume if empty)
            </label>
            <input
              type="url"
              id="resumeUrl"
              name="resumeUrl"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="e.g., https://yourportfolio.com/resume.pdf"
            />
          </div>

          <div className="flex items-center justify-center mt-8">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyInternshipPage;
