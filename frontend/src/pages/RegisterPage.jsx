import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', // Default role
    companyName: '',
    companyDescription: '',
    collegeName: '',
    collegeLocation: '',
    studentId: '',
    major: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const {
    name,
    email,
    password,
    role,
    companyName,
    companyDescription,
    collegeName,
    collegeLocation,
    studentId,
    major,
  } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (role === 'company' && (!companyName || !companyDescription)) {
        setError('Company name and description are required for company users.');
        return;
      }
      if (role === 'college' && (!collegeName || !collegeLocation)) {
        setError('College name and location are required for college users.');
        return;
      }
      if (role === 'student' && (!studentId || !major || !collegeName)) { // Added collegeName validation for students
        setError('Student ID, major, and college name are required for student users.');
        return;
      }

      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center p-6 font-poppins animate-fade-in">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 hover:scale-105 border border-gray-100">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800">Join InternSaathi!</h2>
        {error && <p className="text-red-600 text-center mb-6 font-inter font-medium bg-red-100 p-3 rounded-lg border border-red-200">{error}</p>}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              value={name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              value={email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 pr-10 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                value={password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.879 16.121A4.995 4.995 0 0112 15c1.414 0 2.757.653 3.792 1.588M12 21V3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="role">
              Register As
            </label>
            <select
              id="role"
              name="role"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
              value={role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="college">College</option>
            </select>
          </div>

          {role === 'company' && (
            <>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="companyName">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                  value={companyName}
                  onChange={handleChange}
                  placeholder="e.g., Tech Solutions Inc."
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="companyDescription">
                  Company Description
                </label>
                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                  value={companyDescription}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Tell us about your company..."
                  required
                ></textarea>
              </div>
            </>
          )}

          {role === 'college' && (
            <>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="collegeName">
                  College Name
                </label>
                <input
                  type="text"
                  id="collegeName"
                  name="collegeName"
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                  value={collegeName}
                  onChange={handleChange}
                  placeholder="e.g., University of Technology"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="collegeLocation">
                  College Location
                </label>
                <input
                  type="text"
                  id="collegeLocation"
                  name="collegeLocation"
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                  value={collegeLocation}
                  onChange={handleChange}
                  placeholder="e.g., New Delhi, India"
                  required
                />
              </div>
            </>
          )}

          {role === 'student' && (
            <>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="studentId">
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                  value={studentId}
                  onChange={handleChange}
                  placeholder="e.g., 2023CS101"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="major">
                  Major
                </label>
                <input
                  type="text"
                  id="major"
                  name="major"
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                  value={major}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="collegeName">
                  College Name
                </label>
                <input
                  type="text"
                  id="collegeName"
                  name="collegeName"
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200"
                  value={collegeName}
                  onChange={handleChange}
                  placeholder="e.g., University of Technology"
                  required
                />
              </div>
            </>
          )}

          <div className="md:col-span-2 flex items-center justify-between mt-6">
            <button
              type="submit"
              className="bg-emerald-200 hover:bg-emerald-300 text-emerald-800 font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Register
            </button>
          </div>
          <p className="md:col-span-2 text-center text-gray-600 text-sm mt-6 font-inter">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-teal-600 hover:text-teal-800 font-bold transition-colors duration-200"
            >
              Login here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
