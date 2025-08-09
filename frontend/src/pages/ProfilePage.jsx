import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setProfile(user);
      setLoading(false);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleEditProfile = () => {
    navigate('/edit-profile'); // Navigate to the new edit page
  };
  
  const renderRoleSpecificDetails = () => {
    if (!profile) return null;
    
    switch (profile.role) {
      case 'company':
        return (
          <>
            <p className="text-gray-700 font-inter">
              <span className="font-semibold">Company:</span> {profile.companyName}
            </p>
            <p className="text-gray-600 italic text-sm mt-1">
              {profile.companyDescription}
            </p>
          </>
        );
      case 'college':
        return (
          <>
            <p className="text-gray-700 font-inter">
              <span className="font-semibold">College:</span> {profile.collegeName}
            </p>
            <p className="text-gray-600 italic text-sm mt-1">
              Location: {profile.collegeLocation}
            </p>
          </>
        );
      case 'student':
        return (
          <>
            <p className="text-gray-700 font-inter">
              <span className="font-semibold">Student ID:</span> {profile.studentId}
            </p>
            <p className="text-gray-700 font-inter">
              <span className="font-semibold">Major:</span> {profile.major}
            </p>
            {profile.resumeUrl && (
              <p className="text-gray-700 font-inter">
                <span className="font-semibold">Resume:</span> <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 underline">View</a>
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };
  
  if (!profile) return null;

  return (
    <div className="flex items-center justify-center p-6 font-poppins animate-fade-in">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-xl text-center border border-gray-100">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
          Your Profile
        </h2>
        
        <div className="space-y-4 mb-8">
          <p className="text-gray-700 font-inter">
            <span className="font-semibold">Name:</span> {profile.name}
          </p>
          <p className="text-gray-700 font-inter">
            <span className="font-semibold">Email:</span> {profile.email}
          </p>
          <p className="text-gray-700 font-inter">
            <span className="font-semibold">Role:</span> <span className="capitalize">{profile.role}</span>
          </p>
          
          {renderRoleSpecificDetails()}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleEditProfile}
            className="bg-teal-100 hover:bg-teal-400 text-teal-800 font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
