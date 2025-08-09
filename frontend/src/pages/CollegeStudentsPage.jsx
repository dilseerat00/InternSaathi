import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../api/authService';

const CollegeStudentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'college') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (user && user.role === 'college') {
        try {
          const data = await authService.getCollegeStudents();
          setStudents(data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch students.');
          setLoading(false);
        }
      }
    };
    fetchStudents();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 font-poppins text-gray-700 text-xl">
        Loading students...
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
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-2xl animate-fade-in">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">
          Students of {user?.collegeName}
        </h2>
        
        {students.length === 0 ? (
          <div className="text-center text-gray-600 text-xl py-10 font-inter">
            No students have registered with your college yet.
          </div>
        ) : (
          <div className="space-y-6">
            {students.map((student) => (
              <div key={student._id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.005]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="text-left">
                    <h3 className="text-xl font-poppins font-bold text-teal-700 mb-1">
                      {student.name}
                    </h3>
                    <p className="text-gray-600 text-sm font-inter">
                      <span className="font-semibold">Student ID:</span> {student.studentId}
                    </p>
                    <p className="text-gray-600 text-sm font-inter">
                      <span className="font-semibold">Email:</span> {student.email}
                    </p>
                    <p className="text-gray-600 text-sm font-inter">
                      <span className="font-semibold">Major:</span> {student.major}
                    </p>
                  </div>
                  <div className="md:text-right mt-4 md:mt-0">
                    <button
                      onClick={() => navigate(`/student-applications/${student._id}`)}
                      className="bg-emerald-200 hover:bg-emerald-300 text-emerald-800 font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md text-sm"
                    >
                      View Applications
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

export default CollegeStudentsPage;
