import React, { useState, useEffect, useCallback } from 'react';
import companyService from '../api/companyService';
import { FaEnvelope, FaBuilding } from 'react-icons/fa'; // Import a placeholder icon

const CompanyListPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await companyService.getCompanies({ keyword });
      setCompanies(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch companies. Only college accounts can view this page.');
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  return (
    <div className="p-6 font-inter">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-4xl font-poppins font-extrabold text-center mb-8 text-gray-800">
          Find Companies
        </h2>

        {/* --- Search Form --- */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by company name or description..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full p-3 border rounded-lg flex-grow"
            />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg">
              Search
            </button>
          </div>
        </form>

        {/* --- Display Company Cards --- */}
        {loading ? (
          <div className="text-center text-gray-600">Loading companies...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : companies.length === 0 ? (
          <div className="text-center text-gray-600">No companies found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company._id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
                <div>
                  {/* --- NEW LOGO DISPLAY SECTION --- */}
                  <div className="flex items-center mb-4">
                    {company.companyLogo ? (
                      <img src={company.companyLogo} alt={`${company.companyName} Logo`} className="w-16 h-16 object-contain rounded-md mr-4 border p-1" />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md mr-4">
                        <FaBuilding className="text-gray-400 text-2xl" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-teal-700">{company.companyName}</h3>
                  </div>
                  <p className="text-gray-600 mt-2 mb-4 text-sm line-clamp-3">{company.companyDescription}</p>
                </div>
                <a
                  href={`mailto:${company.email}`}
                  className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out text-center inline-flex items-center justify-center"
                >
                  <FaEnvelope className="mr-2" /> Contact Company
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyListPage;
