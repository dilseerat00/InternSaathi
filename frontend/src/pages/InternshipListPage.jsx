import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import internshipService from '../api/internshipService';
import { useAuth } from '../contexts/AuthContext';
import { FaBuilding } from 'react-icons/fa'; // 1. Import a placeholder icon

const InternshipListPage = () => {
  // State for storing fetched data and UI status
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // State for filter inputs
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [stipend, setStipend] = useState('');
  const [duration, setDuration] = useState('');
  const [skills, setSkills] = useState('');
  const [workType, setWorkType] = useState('');
  const [domain, setDomain] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();
  const locationHook = useLocation();

  const fetchInternships = useCallback(async (queryParamsString) => {
    setLoading(true);
    setError('');
    try {
      const data = await internshipService.getInternships(queryParamsString);
      setInternships(data.internships);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch internships.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    setKeyword(params.get('keyword') || '');
    setLocation(params.get('location') || '');
    setStipend(params.get('stipend') || '');
    setDuration(params.get('duration') || '');
    setSkills(params.get('skills') || '');
    setWorkType(params.get('workType') || '');
    setDomain(params.get('domain') || '');
    const pageNumber = Number(params.get('pageNumber')) || 1;
    setPage(pageNumber);
    fetchInternships(locationHook.search.substring(1));
  }, [locationHook.search, fetchInternships]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newPage = 1;
    setPage(newPage);
    const queryParams = new URLSearchParams();
    if (keyword.trim()) queryParams.append('keyword', keyword.trim());
    if (location.trim()) queryParams.append('location', location.trim());
    if (stipend) queryParams.append('stipend', stipend);
    if (duration) queryParams.append('duration', duration);
    if (skills.trim()) queryParams.append('skills', skills.trim());
    if (workType) queryParams.append('workType', workType);
    if (domain.trim()) queryParams.append('domain', domain.trim());
    queryParams.append('pageNumber', newPage);
    navigate(`?${queryParams.toString()}`);
  };

  const clearFilters = () => {
    setKeyword('');
    setLocation('');
    setStipend('');
    setDuration('');
    setSkills('');
    setWorkType('');
    setDomain('');
    setPage(1);
    navigate('');
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const queryParams = new URLSearchParams(locationHook.search);
    queryParams.set('pageNumber', newPage);
    navigate(`?${queryParams.toString()}`);
  };

  const handleApplyClick = (internshipId) => {
    navigate(`/apply/${internshipId}`);
  };

  return (
    <div className="p-6 font-inter animate-fade-in">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-4xl font-poppins font-extrabold text-center mb-8 text-gray-800 tracking-tight">
          Explore Internships
        </h2>

        {/* --- FORM WITH AUTOCOMPLETE ATTRIBUTES --- */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <div className="col-span-full">
            <label htmlFor="keyword" className="sr-only">Search Keyword</label>
            <input
              type="text"
              id="keyword"
              placeholder="Search by title, description, location, or domain..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="location" className="sr-only">Location</label>
            <input
              type="text"
              id="location"
              placeholder="Location (e.g., Remote, Delhi)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
              autoComplete="address-level2"
            />
          </div>

          <div>
            <label htmlFor="stipend" className="sr-only">Stipend</label>
            <select
              id="stipend"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
              autoComplete="off"
            >
              <option value="">All Stipends</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Negotiable">Negotiable</option>
              <option value="5000">₹5,000+/month</option>
              <option value="10000">₹10,000+/month</option>
              <option value="15000">₹15,000+/month</option>
              <option value="20000">₹20,000+/month</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="sr-only">Duration</label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
              autoComplete="off"
            >
              <option value="">All Durations</option>
              <option value="3 Months">3 Months</option>
              <option value="4 Months">4 Months</option>
              <option value="5 Months">5 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="More than 6 Months">More than 6 Months</option>
            </select>
          </div>

          <div>
            <label htmlFor="skills" className="sr-only">Skills</label>
            <input
              type="text"
              id="skills"
              placeholder="Skills (comma-separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="workType" className="sr-only">Work Type</label>
            <select
              id="workType"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
              autoComplete="off"
            >
              <option value="">All Work Types</option>
              <option value="In-office">In-office</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label htmlFor="domain" className="sr-only">Domain</label>
            <input
              type="text"
              id="domain"
              placeholder="Internship Domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200"
              autoComplete="organization-title"
            />
          </div>

          <div className="md:col-span-3 flex justify-center gap-4 mt-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Search Internships
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Clear Filters
            </button>
          </div>
        </form>

        {/* --- DISPLAY AREA --- */}
        {loading ? (
          <div className="text-center text-xl text-gray-700 py-10">Loading Internships...</div>
        ) : error ? (
          <div className="text-center text-red-600 text-xl py-10">{error}</div>
        ) : internships.length === 0 ? (
          <div className="text-center text-gray-600 text-xl py-10">No internships found matching your criteria.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.map((internship) => (
                <div key={internship._id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex flex-col justify-between">
                  <div>
                    {/* --- 2. NEW LOGO DISPLAY SECTION --- */}
                    <div className="flex items-start mb-3">
                      {internship.companyLogo ? (
                        <img src={internship.companyLogo} alt={`${internship.companyName} Logo`} className="w-14 h-14 object-contain rounded-md mr-4 border p-1 bg-white" />
                      ) : (
                        <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-gray-200 rounded-md mr-4">
                          <FaBuilding className="text-gray-400 text-2xl" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-poppins font-bold text-teal-700 leading-tight">{internship.title}</h3>
                        <p className="text-gray-800 font-semibold text-sm">{internship.companyName}</p>
                      </div>
                    </div>
                    
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
                    <div className="mb-4">
                      <span className="font-semibold text-gray-700 text-sm">Skills:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {internship.skillsRequired.map((skill, index) => (
                          <span key={index} className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-600 text-xs mb-2">
                      Apply by: {new Date(internship.applicationDeadline).toLocaleDateString()}
                    </p>
                    {user && user.role === 'student' ? (
                      <button
                        onClick={() => handleApplyClick(internship._id)}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
                      >
                        Apply Now
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg"
                      >
                        Login to Apply
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* --- PAGINATION --- */}
            {pages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {[...Array(pages).keys()].map((x) => (
                  <button
                    key={x + 1}
                    onClick={() => handlePageChange(x + 1)}
                    className={`py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      x + 1 === page
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {x + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InternshipListPage;
