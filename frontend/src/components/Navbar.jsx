import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close mobile menu on logout
    navigate('/login');
  };

  // **FIXED LOGIC**: This function determines the correct dashboard path based on user role.
  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'company':
        return '/my-internships'; // Or a dedicated company dashboard
      case 'student':
        return '/my-applications'; // Or a dedicated student dashboard
      case 'college':
        return '/college-dashboard';
      default:
        return '/dashboard'; // Fallback generic dashboard
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-21">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="logo.png"
                alt="InternSaathi Logo"
                className="w-45 h-22 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/internships" className="text-gray-700 hover:text-teal-600 font-medium">
              Explore Internships
            </Link>
            <HashLink smooth to="/#about-us" className="text-gray-700 hover:text-teal-600 font-medium">
              About Us
            </HashLink>
            <HashLink smooth to="/#features" className="text-gray-700 hover:text-teal-600 font-medium">
              Features
            </HashLink>
            <HashLink smooth to="/#contact-us" className="text-gray-700 hover:text-teal-600 font-medium">
              Contact Us
            </HashLink>

            {user ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-teal-600 font-medium">
                  Profile
                </Link>
                <Link to={getDashboardLink()} className="px-4 py-2 bg-emerald-200 text-emerald-800 rounded-lg hover:bg-emerald-300 shadow-md font-bold">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 shadow-md font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 bg-emerald-200 text-emerald-800 rounded-lg hover:bg-emerald-300 shadow-md font-bold">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-teal-200 text-teal-800 rounded-lg hover:bg-teal-300 shadow-md font-bold">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon logic */}
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link onClick={() => setIsOpen(false)} to="/internships" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
              Explore Internships
            </Link>
            <HashLink onClick={() => setIsOpen(false)} smooth to="/#about-us" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
              About Us
            </HashLink>
            <HashLink onClick={() => setIsOpen(false)} smooth to="/#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
              Features
            </HashLink>
            <HashLink onClick={() => setIsOpen(false)} smooth to="/#contact-us" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
              Contact Us
            </HashLink>
            
            <hr className="my-2"/>

            {user ? (
              <>
                <Link onClick={() => setIsOpen(false)} to={getDashboardLink()} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                  Dashboard
                </Link>
                <Link onClick={() => setIsOpen(false)} to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link onClick={() => setIsOpen(false)} to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                  Login
                </Link>
                <Link onClick={() => setIsOpen(false)} to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
