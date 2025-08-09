import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleExploreInternshipsClick = () => {
    navigate('/internships');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 font-inter">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-poppins font-extrabold text-gray-800 leading-tight mb-6">
            <span className="inline-block">Your Gateway to</span> <br /> <span className="text-teal-600 inline-block">Dream Internships</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Internsaathi connects ambitious students with top companies, offering a seamless platform for internship discovery, application, and talent acquisition.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <button
                onClick={handleDashboardClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
                >
                  Login
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
                >
                  Register
                </button>
              </>
            )}
            <button
              onClick={handleExploreInternshipsClick}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
            >
              Explore Internships
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="pt-16 -mt-16 py-16 md:py-24 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl font-poppins font-bold text-gray-700 mb-6">About Internsaathi</h2>
          <p className="text-lg text-gray-700 mb-4">
            Internsaathi was founded with a mission to bridge the gap between aspiring talent and leading organizations. We believe that every student deserves a chance to gain real-world experience,<br/>and every company deserves to find the perfect fit for their teams.
          </p>
          <p className="text-lg text-gray-700">
            Our platform provides a comprehensive solution for internship seekers, companies, and colleges, streamlining the entire process from posting to placement.
          </p>
        </div>
      </section>

      {/* Features Section */}
<section id="features" className="pt-16 -mt-16 py-16 md:py-24 bg-gradient-to-r from-emerald-50 to-teal-50 px-4">
  <div className="max-w-5xl mx-auto animate-fade-in">
    <h2 className="text-4xl font-poppins font-bold text-center text-gray-700 mb-12">Key Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      {/* Feature 1 */}
      <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:scale-105">
        <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.944 12c.071 1.09.28 2.158.625 3.176M12 21.056c-1.09-.071-2.158-.28-3.176-.625M21.056 12c-.071-1.09-.28-2.158-.625-3.176" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3 className="text-xl font-poppins font-semibold text-gray-700 mb-3">
          Vast Internship<br />Database
        </h3>
        <p className="text-gray-700 text-center">Discover countless internships
in every field and location —
with new ones added daily.</p>
      </div>

      {/* Feature 2 */}
      <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:scale-105">
        <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3 className="text-xl font-poppins font-semibold text-gray-700 mb-3">
          Easy Application<br />Process
        </h3>
        <p className="text-gray-700 text-center">Apply to your desired internships with a few simple clicks and a personalized cover letter.</p>
      </div>

      {/* Feature 3 */}
      <div className="bg-white p-8 rounded-xl shadow-md text-center transform transition-all duration-300 hover:scale-105">
        <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
          <path d="M12 6.253v13m0-13C10.832 5.477 9.205 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.795 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.795 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.205 18 16.5 18s-3.332.477-4.5 1.253" stroke="url(#grad3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3 className="text-xl font-poppins font-semibold text-gray-600 mb-3">
          Company & College<br />Dashboards
        </h3>
        <p className="text-gray-700 text-center">Smart dashboards for companies to post
and colleges to monitor every
student's placement journey.</p>
      </div>

    </div>
  </div>
</section>


      {/* Call to Action for Companies/Colleges */}
      <section className="py-16 md:py-24 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl font-poppins font-bold text-gray-700 mb-6">Are You a Company or College?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Join Internsaathi to connect with bright, aspiring talent and streamline your hiring process.
          </p>
          <button
            onClick={handleRegisterClick}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
          >
            Register Your Organization
          </button>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact-us" className="pt-16 -mt-16 py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-teal-100 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl font-poppins font-bold text-gray-700 mb-6">Contact Us</h2>
          <p className="text-lg text-gray-700 mb-8">
            Have questions or need support? Feel free to reach out to us!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:support@Internsaathi.com"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
            >
              Email Us
            </a>
            <a
              href="tel:+911234567890"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer 
      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Internsaathi. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </footer>
      */}
    </div>
  );
};

export default LandingPage;
