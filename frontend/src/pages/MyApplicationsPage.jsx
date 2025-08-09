import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import applicationService from '../api/applicationService';
import { useAuth } from '../contexts/AuthContext';

const MyApplicationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not a student user
  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login'); // Redirect to login or a "not authorized" page
    }
  }, [user, navigate]);

  // Fetch student's applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (user && user.role === 'student') {
        try {
          const data = await applicationService.getStudentApplications();
          setApplications(data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch your applications.');
          setLoading(false);
        }
      }
    };
    fetchApplications();
  }, [user]); // Re-fetch when user object changes (e.g., after login)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-6 font-raleway text-gray-700 text-xl">
        Loading your applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-6 font-raleway text-red-600 text-xl">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6 font-raleway animate-fade-in">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl animate-fade-in">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">
          My Applications
        </h2>

        {applications.length === 0 ? (
          <div className="text-center text-gray-600 text-xl py-10">
            You haven't applied for any internships yet.
            <br />
            <button
              onClick={() => navigate('/internships')}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Explore Internships
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.005] flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="text-left mb-4 sm:mb-0">
                  <h3 className="text-xl font-bold text-teal-700 mb-1">{app.internship.title}</h3>
                  <p className="text-gray-800 font-semibold mb-1">{app.company.companyName || app.company.name}</p>
                  <p className="text-gray-600 text-sm">Applied on: {new Date(app.applicationDate).toLocaleDateString()}</p>
                  <p className="text-gray-600 text-sm mt-1">Deadline: {new Date(app.internship.applicationDeadline).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold
                      ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${app.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' : ''}
                      ${app.status === 'Accepted' ? 'bg-green-100 text-green-800' : ''}
                      ${app.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                      ${app.status === 'Withdrawn' ? 'bg-gray-200 text-gray-700' : ''}
                    `}
                  >
                    {app.status}
                  </span>
                  {/* Optionally add a "View Details" button for the application */}
                  {/* <button
                    onClick={() => navigate(`/application/${app._id}`)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1.5 px-3 rounded-lg text-sm transition duration-200"
                  >
                    View Details
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
