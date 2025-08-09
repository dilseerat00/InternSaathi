import React, { useState, useEffect, useCallback } from 'react';
import collegeService from '../api/collegeService';
import { FaEnvelope, FaUniversity } from 'react-icons/fa'; // Import a placeholder icon

const CollegeListPage = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const filters = {};
      if (keyword) filters.keyword = keyword;
      if (location) filters.location = location;
      
      const data = await collegeService.getColleges(filters);
      setColleges(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch colleges. Only company accounts can view this page.');
    } finally {
      setLoading(false);
    }
  }, [keyword, location]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchColleges();
  };

  return (
    <div className="p-6 font-inter">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-4xl font-poppins font-extrabold text-center mb-4 text-gray-800">
          Find Colleges & Universities
        </h2>

        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-8" role="alert">
          <p className="font-bold">A Note to Companies</p>
          <p>Internsaathi serves as a platform to connect you with educational institutions. We strongly advise you to conduct your own due diligence and verify credentials before entering into any formal agreements.</p>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
          <input
            type="text"
            placeholder="Search by college name or location..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full p-3 border rounded-lg md:col-span-1"
          />
          <input
            type="text"
            placeholder="Filter by Location (e.g., Chandigarh)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border rounded-lg md:col-span-1"
          />
          <div className="md:col-span-2 flex justify-center">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg">
              Search Colleges
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center text-gray-600">Loading colleges...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : colleges.length === 0 ? (
          <div className="text-center text-gray-600">No colleges found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <div key={college._id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
                <div>
                  {/* --- NEW LOGO DISPLAY SECTION --- */}
                  <div className="flex items-center mb-4">
                    {college.collegeLogo ? (
                      <img src={college.collegeLogo} alt={`${college.name} Logo`} className="w-16 h-16 object-contain rounded-md mr-4 border p-1" />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md mr-4">
                        <FaUniversity className="text-gray-400 text-2xl" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-teal-700">{college.name}</h3>
                      <p className="text-gray-700 text-sm">{college.location.city}</p>
                    </div>
                  </div>
                </div>
                <a
                  href={`mailto:${college.email}`}
                  className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out text-center inline-flex items-center justify-center"
                >
                  <FaEnvelope className="mr-2" /> Contact
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeListPage;
