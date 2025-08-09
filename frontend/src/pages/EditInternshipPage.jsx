import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import internshipService from '../api/internshipService';
import { useAuth } from '../contexts/AuthContext';

const EditInternshipPage = () => {
  const { id } = useParams(); // Get internship ID from URL
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    companyName: '',
    title: '',
    description: '',
    location: '',
    workType: '',
    stipend: '',
    duration: '',
    internshipDomain: '',
    applicationDeadline: '',
    skillsRequired: '',
    responsibilities: '',
    whoCanApply: '',
    perks: '',
    positions: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not a company user
  useEffect(() => {
    if (!user || user.role !== 'company') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch the internship data to pre-fill the form
  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const internship = await internshipService.getInternshipById(id);
        // Pre-fill the form with the fetched data
        setFormData({
          companyName: internship.companyName || '',
          title: internship.title || '',
          description: internship.description || '',
          location: internship.location || '',
          workType: internship.workType || '',
          stipend: internship.stipend || '',
          duration: internship.duration || '',
          internshipDomain: internship.internshipDomain || '',
          // Format date for the input field
          applicationDeadline: internship.applicationDeadline ? internship.applicationDeadline.split('T')[0] : '',
          // Convert arrays back to comma-separated strings for the input fields
          skillsRequired: internship.skillsRequired ? internship.skillsRequired.join(', ') : '',
          responsibilities: internship.responsibilities ? internship.responsibilities.join(', ') : '',
          whoCanApply: internship.whoCanApply ? internship.whoCanApply.join(', ') : '',
          perks: internship.perks ? internship.perks.join(', ') : '',
          positions: internship.positions || 1,
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load internship for editing.');
        setLoading(false);
      }
    };

    if (id) {
      fetchInternship();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Convert comma-separated strings back to arrays
      const dataToSend = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s !== ''),
        responsibilities: formData.responsibilities.split(',').map(s => s.trim()).filter(s => s !== ''),
        whoCanApply: formData.whoCanApply.split(',').map(s => s.trim()).filter(s => s !== ''),
        perks: formData.perks.split(',').map(s => s.trim()).filter(s => s !== ''),
        applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
      };

      await internshipService.updateInternship(id, dataToSend);
      setSuccess('Internship updated successfully!');
      navigate('/my-internships'); // Redirect back to my internships page
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update internship.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-6 font-poppins text-gray-700 text-xl">
        Loading internship details for editing...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-6 font-poppins text-red-600 text-xl">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4 font-inter animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-poppins font-extrabold text-center mb-6 text-gray-800">Edit Internship</h2>
        {error && <p className="text-red-600 text-center mb-6 font-medium bg-red-100 p-3 rounded-lg border border-red-200">{error}</p>}
        {success && <p className="text-green-600 text-center mb-6 font-medium bg-green-100 p-3 rounded-lg border border-green-200">{success}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name Input */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="companyName">Company Name</label>
            <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Your Company Inc."
            />
          </div>

          {/* Internship Title */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">Internship Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Software Development Intern"
            />
          </div>

          {/* Internship Domain */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="internshipDomain">Internship Domain</label>
            <input type="text" id="internshipDomain" name="internshipDomain" value={formData.internshipDomain} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Web Development, Marketing, HR"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Remote, Bangalore, India"
            />
          </div>

          {/* Work Type */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="workType">Work Type</label>
            <select id="workType" name="workType" value={formData.workType} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
            >
              <option value="In-office">In-office</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Stipend */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="stipend">Stipend</label>
            <select id="stipend" name="stipend" value={formData.stipend} onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Negotiable">Negotiable</option>
              <option value="₹5,000/month">₹5,000/month</option>
              <option value="₹10,000/month">₹10,000/month</option>
              <option value="₹15,000/month">₹15,000/month</option>
              <option value="₹20,000+/month">₹20,000+/month</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="duration">Duration</label>
            <select id="duration" name="duration" value={formData.duration} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
            >
              <option value="3 Months">3 Months</option>
              <option value="4 Months">4 Months</option>
              <option value="5 Months">5 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="More than 6 Months">More than 6 Months</option>
            </select>
          </div>

          {/* Application Deadline */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="applicationDeadline">Application Deadline</label>
            <input type="date" id="applicationDeadline" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">Job Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="4"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="Provide a detailed description of the internship responsibilities, requirements, and what the intern will learn."
            ></textarea>
          </div>

          {/* Skills Required */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="skillsRequired">Required Skills (comma-separated)</label>
            <input type="text" id="skillsRequired" name="skillsRequired" value={formData.skillsRequired} onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., React, Node.js, MongoDB, JavaScript"
            />
          </div>

          {/* Responsibilities */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="responsibilities">Key Responsibilities (comma-separated)</label>
            <textarea id="responsibilities" name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows="3"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Develop new features, Participate in code reviews, Debug and optimize code"
            ></textarea>
          </div>

          {/* Who Can Apply */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="whoCanApply">Who Can Apply (comma-separated)</label>
            <input type="text" id="whoCanApply" name="whoCanApply" value={formData.whoCanApply} onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Final year students, B.Tech CSE, Graduates from any stream"
            />
          </div>

          {/* Perks */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="perks">Perks (comma-separated)</label>
            <input type="text" id="perks" name="perks" value={formData.perks} onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              placeholder="e.g., Certificate, LOR, Flexible hours, Stipend"
            />
          </div>

          {/* Positions */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="positions">Number of Positions</label>
            <input type="number" id="positions" name="positions" value={formData.positions} onChange={handleChange} required min="1"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              Update Internship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInternshipPage;
