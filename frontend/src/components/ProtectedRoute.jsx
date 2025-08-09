import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Optionally render a loading spinner or message while authentication state is being determined
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 font-raleway text-gray-700 text-xl">
        Loading...
      </div>
    );
  }

  if (!user) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles are specified, check if the user's role is included in the allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is authenticated but not authorized for this specific route
    // Redirect them to the dashboard or a "not authorized" page
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and authorized, render the children components (the protected content)
  return children;
};

export default ProtectedRoute;
