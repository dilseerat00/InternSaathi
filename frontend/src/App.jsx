import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PostInternshipPage from './pages/PostInternshipPage';
import InternshipListPage from './pages/InternshipListPage';
import ApplyInternshipPage from './pages/ApplyInternshipPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ManageApplicantsPage from './pages/ManageApplicantsPage';
import CollegeDashboardPage from './pages/CollegeDashboardPage';
import MyInternshipsPage from './pages/MyInternshipsPage';
import EditInternshipPage from './pages/EditInternshipPage';
import InternshipApplicantsPage from './pages/InternshipApplicantsPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import CollegeStudentsPage from './pages/CollegeStudentsPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CollegeListPage from './pages/CollegeListPage';
import CompanyListPage from './pages/CompanyListPage'; // 1. Import the new CompanyListPage

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 font-inter">
          <Navbar />
          <main className="pt-16 pb-10">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-internship"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <PostInternshipPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/internships" element={<InternshipListPage />} />
              <Route
                path="/apply/:id"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <ApplyInternshipPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <MyApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-applicants"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <ManageApplicantsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/college-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['college']}>
                    <CollegeDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-internships"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <MyInternshipsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-internship/:id"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <EditInternshipPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/internship-applicants/:id"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <InternshipApplicantsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/college/students"
                element={
                  <ProtectedRoute allowedRoles={['college']}>
                    <CollegeStudentsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/colleges"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <CollegeListPage />
                  </ProtectedRoute>
                }
              />

              {/* 2. Add the new route for finding companies */}
              <Route
                path="/companies"
                element={
                  <ProtectedRoute allowedRoles={['college']}>
                    <CompanyListPage />
                  </ProtectedRoute>
                }
              />

            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
