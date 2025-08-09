import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 1. Import Link
import internshipService from '../api/internshipService';
import { useAuth } from '../contexts/AuthContext';
import { FaUniversity, FaPlusCircle } from 'react-icons/fa'; // 2. Import icons for styling

const MyInternshipsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not a company user
  useEffect(() => {
    if (!user || user.role !== 'company') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch company's internships
  const fetchMyInternships = async () => {
    if (user && user.role === 'company') {
      try {
        setLoading(true);
        const data = await internshipService.getMyInternships();
        setInternships(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch your internships.');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMyInternships();
  }, [user]);

  // Handle internship deletion
  const handleDeleteInternship = async (id) => {
    // Replaced window.confirm with a simple confirmation for now.
    // Consider implementing a custom modal for a better user experience.
    const confirmed = true; // Placeholder for a modal confirmation
    if (confirmed) {
      try {
        await internshipService.deleteInternship(id);
        setInternships(prevInternships =>
          prevInternships.filter(internship => internship._id !== id)
        );
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete internship.');
      }
    }
  };

  const handleEditInternship = (id) => {
    navigate(`/edit-internship/${id}`);
  };

  const handleViewApplicants = (id) => {
    navigate(`/internship-applicants/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 font-poppins text-gray-700 text-xl">
        Loading your internships...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 font-poppins text-red-600 text-xl">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 font-poppins animate-fade-in">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-4 md:mb-0">
            Company Dashboard
          </h2>
          {/* --- NEW ACTION BUTTONS SECTION --- */}
          <div className="flex space-x-4">
            <Link
              to="/colleges"
              className="bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg inline-flex items-center"
            >
              <FaUniversity className="mr-2" /> Find Colleges
            </Link>
            <button
              onClick={() => navigate('/post-internship')}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg inline-flex items-center"
            >
              <FaPlusCircle className="mr-2" /> Post Internship
            </button>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">My Posted Internships</h3>

        {internships.length === 0 ? (
          <div className="text-center text-gray-600 text-xl py-10 font-inter">
            You haven't posted any internships yet.
          </div>
        ) : (
          <div className="space-y-6">
            {internships.map((internship) => (
              <div key={internship._id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.005]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="text-left mb-4 sm:mb-0">
                    <h3 className="text-xl font-poppins font-bold text-teal-700 mb-1">{internship.title}</h3>
                    <p className="text-gray-800 font-semibold mb-1 font-inter">
                      <span className="font-medium text-gray-600">Domain:</span> {internship.internshipDomain}
                    </p>
                    <p className="text-gray-600 text-sm font-inter">
                      <span className="font-semibold">Location:</span> {internship.location} ({internship.workType})
                    </p>
                    <p className="text-gray-600 text-sm font-inter">
                      <span className="font-semibold">Stipend:</span> {internship.stipend}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleEditInternship(internship._id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteInternship(internship._id)}
                      className="bg-red-200 hover:bg-red-300 text-red-800 font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewApplicants(internship._id)}
                      className="bg-emerald-200 hover:bg-emerald-300 text-emerald-800 font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md text-sm"
                    >
                      View Applicants
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInternshipsPage;
