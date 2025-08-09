import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import uploadService from '../api/uploadService'; // 1. Import the new upload service

const EditProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyDescription: '',
    companyLogo: '',
    collegeName: '',
    collegeLocation: '',
    collegeLogo: '',
    studentId: '',
    major: '',
    resume: '',
    profilePicture: '',
  });
  
  // 2. New state for the selected image file and upload progress
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        companyName: user.companyName || '',
        companyDescription: user.companyDescription || '',
        companyLogo: user.companyLogo || '',
        collegeName: user.collegeName || '',
        collegeLocation: user.collegeLocation || '',
        collegeLogo: user.collegeLogo || '',
        studentId: user.studentId || '',
        major: user.major || '',
        resume: user.resume || '',
        profilePicture: user.profilePicture || '',
      });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. New handler for when a user selects a file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Show a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageFieldName = getImageFieldName();
        if (imageFieldName) {
          setFormData(prev => ({ ...prev, [imageFieldName]: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      if (!user || !user.token) {
        setError('User not authenticated. Please log in again.');
        return;
      }

      const dataToUpdate = { ...formData };
      
      // 4. Check if a new image file was selected for upload
      if (imageFile) {
        setUploading(true);
        // Upload the image and get the secure URL from Cloudinary
        const imageUrl = await uploadService.uploadImage(imageFile);
        setUploading(false);
        
        // Add the new URL to the data we're about to save
        const imageFieldName = getImageFieldName();
        if (imageFieldName) {
          dataToUpdate[imageFieldName] = imageUrl;
        }
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }
      delete dataToUpdate.confirmPassword;

      const response = await axios.put('http://localhost:3000/api/auth/profile', dataToUpdate, config);
      
      updateUser(response.data);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    }
  };

  if (!user) return null;

  // Helper to get the correct field name for the logo/picture
  const getImageFieldName = () => {
    if (user.role === 'company') return 'companyLogo';
    if (user.role === 'college') return 'collegeLogo';
    if (user.role === 'student') return 'profilePicture';
    return null;
  };

  const imageField = getImageFieldName();
  const imageLabel = user.role === 'student' ? 'Profile Picture' : `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Logo`;

  return (
    <div className="flex items-center justify-center p-6 font-poppins animate-fade-in">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Edit Profile
        </h2>
        {error && <p className="text-red-600 text-center mb-6">{error}</p>}
        {success && <p className="text-green-600 text-center mb-6">{success}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Fields */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
            />
          </div>

          {/* Role-Specific Fields */}
          {user.role === 'company' && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="companyName">Company Name</label>
                <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="companyDescription">Company Description</label>
                <textarea id="companyDescription" name="companyDescription" value={formData.companyDescription} onChange={handleChange} rows="3" required
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                ></textarea>
              </div>
            </>
          )}

          {user.role === 'college' && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="collegeName">College Name</label>
                <input type="text" id="collegeName" name="collegeName" value={formData.collegeName} onChange={handleChange} required
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="collegeLocation">College Location</label>
                <input type="text" id="collegeLocation" name="collegeLocation" value={formData.collegeLocation} onChange={handleChange} required
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                />
              </div>
            </>
          )}

          {user.role === 'student' && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="studentId">Student ID</label>
                <input type="text" id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="major">Major</label>
                <input type="text" id="major" name="major" value={formData.major} onChange={handleChange} required
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="collegeName">College Name</label>
                <input type="text" id="collegeName" name="collegeName" value={formData.collegeName} onChange={handleChange} required
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="resume">Resume Link (PDF only)</label>
                <input type="url" id="resume" name="resume" value={formData.resume} onChange={handleChange}
                  className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                  placeholder="https://drive.google.com/your-resume-link.pdf"
                />
              </div>
            </>
          )}

          {/* --- 5. NEW FILE UPLOAD FIELD --- */}
          {imageField && (
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="imageUpload">
                {imageLabel}
              </label>
              <div className="flex items-center space-x-4">
                {formData[imageField] && (
                  <img src={formData[imageField]} alt="Profile Preview" className="h-20 w-20 object-contain rounded-md border p-1" />
                )}
                <input type="file" id="imageUpload" name="imageUpload" onChange={handleFileChange} accept="image/png, image/jpeg, image/jpg"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>
          )}

          {/* Password Fields */}
          <div className="md:col-span-2 mt-4">
            <h3 className="text-xl font-poppins font-bold text-gray-800 mb-4">Change Password (Optional)</h3>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="password">New Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 font-inter" htmlFor="confirmPassword">Confirm New Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
              placeholder="Confirm your new password"
            />
          </div>

          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              disabled={uploading}
              className="bg-emerald-200 hover:bg-emerald-300 text-emerald-800 font-bold py-3 px-8 rounded-lg disabled:opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
            >
              {uploading ? 'Uploading Image...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
